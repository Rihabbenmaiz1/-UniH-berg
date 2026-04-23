package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.*;
import tn.fsegt.foyer.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Service
public class ReservationServiceImpl implements IReservationService {

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    EtudiantRepository etudiantRepository;

    @Autowired
    ChambreRepository chambreRepository;

    @Override
    public Reservation ajouterReservationEtAssignerAChambreEtAEtudiant(Long numChambre, long cin) {

        Chambre chambre = chambreRepository
                .findByNumeroChambre(String.valueOf(numChambre))
                .orElse(null);

        Etudiant etudiant = etudiantRepository.findByCin(cin);

        if (chambre == null) {
            throw new RuntimeException("Chambre introuvable");
        }

        if (etudiant == null) {
            throw new RuntimeException("Étudiant introuvable");
        }

        if (chambre.getBloc() == null) {
            throw new RuntimeException("Chambre sans bloc");
        }

        long nbRes = (chambre.getReservations() != null)
                ? chambre.getReservations().size()
                : 0;

        long max = chambre.getCapacite();

        if (nbRes >= max) {
            throw new RuntimeException("Chambre complète");
        }

        LocalDate now = LocalDate.now();
        int year = now.getYear() % 100;

        String annee;
        if (now.getMonthValue() <= 7) {
            annee = "20" + (year - 1) + "/20" + year;
        } else {
            annee = "20" + year + "/20" + (year + 1);
        }

        String nomBloc = chambre.getBloc().getNomBloc();
        String idRes = annee + "-" + nomBloc + "-" + numChambre + "-" + cin;

        if (reservationRepository.existsById(idRes)) {
            throw new RuntimeException("Réservation déjà existante");
        }

        Reservation res = new Reservation();
        res.setIdReservation(idRes);
        res.setAnneeUniversitaire(new Date());
        res.setEstValide(true);

        res.setEtudiants(new ArrayList<>());
        res.getEtudiants().add(etudiant);
        res.setChambre(chambre);

        // 🔥 incrément
        chambre.setPlacesOccupees(chambre.getPlacesOccupees() + 1);

        // 🔥 SAUVEGARDE (C’EST ÇA QUI MANQUE)
        chambreRepository.save(chambre);

        return reservationRepository.save(res);
    }

    @Override
    public List<Reservation> getReservationParAnneeUniversitaire(Date debutAnnee, Date finAnnee) {
        return reservationRepository.findByAnneeUniversitaireBetween(debutAnnee, finAnnee);
    }

    @Override
    @Transactional
    public void annulerReservation(long cinEtudiant) {

        Etudiant etudiant = etudiantRepository.findByCin(cinEtudiant);
        if (etudiant == null) {
            throw new RuntimeException("Étudiant introuvable avec CIN : " + cinEtudiant);
        }

        Reservation reservation = reservationRepository
                .findByEtudiantsContainingAndEstValide(etudiant, true)
                .orElseThrow(() -> new RuntimeException(
                        "Aucune réservation active trouvée pour le CIN : " + cinEtudiant));

        // 🔥 AJOUT IMPORTANT : diminuer places occupées
        Chambre chambre = reservation.getChambre();
        if (chambre != null && chambre.getPlacesOccupees() > 0) {
            chambre.setPlacesOccupees(chambre.getPlacesOccupees() - 1);
        }

        String idRes = reservation.getIdReservation();

        reservationRepository.deleteEtudiantLinks(idRes);
        reservationRepository.deleteReservationById(idRes);
    }

    @Override
    public List<Chambre> getChambresNonReserveParNomFoyerEtTypeChambre(
            String nomFoyer, Chambre.TypeChambre type) {

        LocalDate now = LocalDate.now();
        int year = now.getYear() % 100;

        LocalDate dateDebutAU;
        LocalDate dateFinAU;

        if (now.getMonthValue() <= 7) {
            dateDebutAU = LocalDate.of(Integer.parseInt("20" + (year - 1)), 9, 15);
            dateFinAU = LocalDate.of(Integer.parseInt("20" + year), 6, 30);
        } else {
            dateDebutAU = LocalDate.of(Integer.parseInt("20" + year), 9, 15);
            dateFinAU = LocalDate.of(Integer.parseInt("20" + (year + 1)), 6, 30);
        }

        Date debut = java.sql.Date.valueOf(dateDebutAU);
        Date fin = java.sql.Date.valueOf(dateFinAU);

        List<Chambre> toutesChambres =
                chambreRepository.findByTypeChambreAndBlocFoyerNomFoyer(type, nomFoyer);

        List<Reservation> reservations =
                reservationRepository.findByAnneeUniversitaireBetween(debut, fin);

        List<Chambre> chambresReservees = reservations.stream()
                .map(Reservation::getChambre)
                .toList();

        return toutesChambres.stream()
                .filter(c -> !chambresReservees.contains(c))
                .toList();
    }
}