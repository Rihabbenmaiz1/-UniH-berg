package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Bloc;
import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Repositories.BlocRepository;
import tn.fsegt.foyer.Repositories.FoyerRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
@Transactional
public class BlocService {

    @Autowired
    private BlocRepository blocRepository;

    @Autowired
    private FoyerRepository foyerRepository;

    // =========================
    // GET ALL BLOCS
    // =========================
    public List<Bloc> getAllBlocs() {
        return blocRepository.findAll();
    }

    // =========================
    // GET BY ID
    // =========================
    public Bloc getBlocById(Long id) {
        return blocRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bloc introuvable"));
    }

    // =========================
    // CREATE BLOC
    // =========================
    public Bloc createBloc(Bloc bloc) {
        return blocRepository.save(bloc);
    }

    // =========================
    // UPDATE BLOC
    // =========================
    public Bloc updateBloc(Long id, Bloc details) {

        Bloc bloc = getBlocById(id);

        bloc.setNomBloc(details.getNomBloc());
        bloc.setCapaciteBloc(details.getCapaciteBloc());

        return blocRepository.save(bloc);
    }

    // =========================
    // DELETE BLOC
    // =========================
    public void deleteBloc(Long id) {
        blocRepository.deleteById(id);
    }

    // =========================
    // AFFECTER BLOC A FOYER (IMPORTANT DDL)
    // =========================
    public Bloc affecterBlocAFoyer(Long idBloc, Long idFoyer) {

        Bloc bloc = getBlocById(idBloc);

        Foyer foyer = foyerRepository.findById(idFoyer)
                .orElseThrow(() -> new RuntimeException("Foyer introuvable"));

        bloc.setFoyer(foyer);

        return blocRepository.save(bloc);
    }
}