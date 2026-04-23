package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Bloc;
import tn.fsegt.foyer.Entities.Chambre;
import tn.fsegt.foyer.Entities.Chambre.TypeChambre;
import tn.fsegt.foyer.Repositories.BlocRepository;
import tn.fsegt.foyer.Repositories.ChambreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ChambreService {

    @Autowired
    private ChambreRepository chambreRepository;

    @Autowired
    private BlocRepository blocRepository;

    // =========================
    // GET ALL
    // =========================
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    // =========================
    // GET BY ID
    // =========================
    public Chambre getChambreById(Long id) {
        return chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre introuvable avec l'id: " + id));
    }

    // =========================
    // CREATE
    // =========================
    public Chambre createChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    // =========================
    // UPDATE
    // =========================
    public Chambre updateChambre(Long id, Chambre details) {

        Chambre chambre = getChambreById(id);

        if (!chambre.getNumeroChambre().equals(details.getNumeroChambre())
                && chambreRepository.existsByNumeroChambre(details.getNumeroChambre())) {
            throw new RuntimeException("Ce numéro de chambre est déjà utilisé.");
        }

        chambre.setNumeroChambre(details.getNumeroChambre());
        chambre.setTypeChambre(details.getTypeChambre());

        return chambreRepository.save(chambre);
    }

    // =========================
    // DELETE
    // =========================
    public void deleteChambre(Long id) {
        chambreRepository.delete(getChambreById(id));
    }

    // =========================
    // AFFECTER CHAMBRE A BLOC (CORRIGÉ)
    // =========================
    public Chambre affecterChambreABloc(Long chambreId, Long blocId) {

        Chambre chambre = getChambreById(chambreId);

        Bloc bloc = blocRepository.findById(blocId)
                .orElseThrow(() -> new RuntimeException("Bloc introuvable avec l'id: " + blocId));

        // logique propre : réaffectation autorisée
        if (chambre.getBloc() != null &&
                chambre.getBloc().getIdBloc().equals(blocId)) {
            return chambre; // déjà affectée au même bloc
        }

        chambre.setBloc(bloc);

        return chambreRepository.save(chambre);
    }

    // =========================
    // PAR BLOC
    // =========================
    public List<Chambre> getChambresByBloc(Long blocId) {
        return chambreRepository.findByBlocIdBloc(blocId);
    }

    // =========================
    // LIBRES
    // =========================
    public List<Chambre> getChambresLibres() {
        return chambreRepository.findChambresLibres();
    }

    // =========================
    // STATISTIQUES
    // =========================
    public Map<String, Long> getNombreParType() {
        return Map.of(
                "SIMPLE", chambreRepository.countByTypeChambre(TypeChambre.SIMPLE),
                "DOUBLE", chambreRepository.countByTypeChambre(TypeChambre.DOUBLE),
                "TRIPLE", chambreRepository.countByTypeChambre(TypeChambre.TRIPLE)
        );
    }

    // =========================
    // DISPONIBILITÉ
    // =========================
    public boolean isChambreDisponible(Long chambreId) {
        return getChambreById(chambreId).isDisponible();
    }

    // =========================
    // OCCUPER PLACE
    // =========================
    public void occuperPlace(Long chambreId) {

        Chambre chambre = getChambreById(chambreId);

        if (chambre.isPleine()) {
            throw new RuntimeException("La chambre " + chambre.getNumeroChambre() + " est complète.");
        }

        chambre.setPlacesOccupees(chambre.getPlacesOccupees() + 1);
        chambreRepository.save(chambre);
    }

    // =========================
    // LIBERER PLACE
    // =========================
    public void libererPlace(Long chambreId) {

        Chambre chambre = getChambreById(chambreId);

        if (chambre.getPlacesOccupees() > 0) {
            chambre.setPlacesOccupees(chambre.getPlacesOccupees() - 1);
            chambreRepository.save(chambre);
        }
    }
}