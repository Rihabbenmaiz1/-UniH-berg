package tn.fsegt.foyer.RestControllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Services.IUniversiteService;

@RestController
@RequestMapping("/foyer")
@AllArgsConstructor
public class FoyerRestController {

    IUniversiteService universiteService;

    // ✅ Ajouter + affecter
    @PostMapping("/ajouterFoyerEtAffecterAUniversite")
    public Foyer ajouterFoyerEtAffecterAUniversite(@RequestBody Foyer foyer,
                                                   @RequestParam long idUniversite) {
        return universiteService.ajouterFoyerEtAffecterAUniversite(foyer, idUniversite);
    }

    // 🔥 SUPPRIMER FOYER
    @DeleteMapping("/deleteFoyer")
    public void deleteFoyer(@RequestParam long idFoyer) {
        universiteService.supprimerFoyer(idFoyer);
    }

    // 🔥 MODIFIER FOYER
    @PutMapping("/updateFoyer")
    public Foyer updateFoyer(@RequestBody Foyer foyer) {
        return universiteService.updateFoyer(foyer);
    }
}