package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Chambre;
import tn.fsegt.foyer.Entities.Reservation;

import java.util.Date;
import java.util.List;

public interface IReservationService {

    Reservation ajouterReservationEtAssignerAChambreEtAEtudiant(Long numChambre, long cin);

    List<Reservation> getReservationParAnneeUniversitaire(Date debutAnnee, Date finAnnee);

    void annulerReservation(long cinEtudiant);  // ← long au lieu de String

    List<Chambre> getChambresNonReserveParNomFoyerEtTypeChambre(String nomFoyer, Chambre.TypeChambre type);
}