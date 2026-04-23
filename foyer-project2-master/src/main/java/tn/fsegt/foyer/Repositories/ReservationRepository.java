package tn.fsegt.foyer.Repositories;

import tn.fsegt.foyer.Entities.Etudiant;
import tn.fsegt.foyer.Entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, String> {

    List<Reservation> findByAnneeUniversitaireBetween(Date debut, Date fin);
    List<Reservation> findByEtudiantsContaining(Etudiant etudiant);
    Optional<Reservation> findByEtudiantsContainingAndEstValide(Etudiant etudiant, boolean estValide);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM reservation_etudiants WHERE reservations_id_reservation = :idReservation", nativeQuery = true)
    void deleteEtudiantLinks(@Param("idReservation") String idReservation);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM reservation WHERE id_reservation = :idReservation", nativeQuery = true)
    void deleteReservationById(@Param("idReservation") String idReservation);

}