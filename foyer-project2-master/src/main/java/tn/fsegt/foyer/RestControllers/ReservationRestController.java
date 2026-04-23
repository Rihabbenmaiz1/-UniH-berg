package tn.fsegt.foyer.RestControllers;

import tn.fsegt.foyer.Entities.Chambre;
import tn.fsegt.foyer.Entities.Etudiant;
import tn.fsegt.foyer.Entities.Reservation;
import tn.fsegt.foyer.Repositories.EtudiantRepository;
import tn.fsegt.foyer.Repositories.ReservationRepository;
import tn.fsegt.foyer.Services.IReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "*")
public class ReservationRestController {

    @Autowired
    IReservationService reservationService;

    @Autowired
    EtudiantRepository etudiantRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @PostMapping("/ajouterReservationEtAssignerAChambreEtAEtudiant")
    public ResponseEntity<?> ajouterReservation(
            @RequestParam Long numChambre,
            @RequestParam long cin) {
        try {
            return ResponseEntity.ok(
                    reservationService.ajouterReservationEtAssignerAChambreEtAEtudiant(numChambre, cin)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/getReservationParAnneeUniversitaire")
    public List<Reservation> getReservationParAnnee(
            @RequestParam("debutAnnee")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date debutAnnee,
            @RequestParam("finAnnee")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date finAnnee) {
        return reservationService.getReservationParAnneeUniversitaire(debutAnnee, finAnnee);
    }

    @DeleteMapping("/annulerReservation")
    public ResponseEntity<String> annulerReservation(
            @RequestParam("cinEtudiant") long cinEtudiant) {
        try {
            reservationService.annulerReservation(cinEtudiant);
            return ResponseEntity.ok("Réservation annulée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getChambresNonReserveParNomFoyerEtTypeChambre")
    public List<Chambre> getChambresNonReserve(
            @RequestParam String nomFoyer,
            @RequestParam Chambre.TypeChambre type) {
        return reservationService.getChambresNonReserveParNomFoyerEtTypeChambre(nomFoyer, type);
    }

    @GetMapping("/getReservationParEtudiant")
    public ResponseEntity<?> getReservationParEtudiant(@RequestParam long cinEtudiant) {
        try {
            Etudiant etudiant = etudiantRepository.findByCin(cinEtudiant);
            if (etudiant == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étudiant introuvable");
            }
            List<Reservation> reservations = reservationRepository.findByEtudiantsContaining(etudiant);
            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}