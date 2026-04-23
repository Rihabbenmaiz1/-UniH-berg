package tn.fsegt.foyer.RestControllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.fsegt.foyer.Entities.Universite;
import tn.fsegt.foyer.Services.IUniversiteService;
import java.util.List;

@RestController
@RequestMapping("/universite")
@AllArgsConstructor
public class UniversiteRestController {

    IUniversiteService universiteService;

    @PostMapping("/addOrUpdate")
    public Universite addOrUpdate(@RequestBody Universite u) {
        return universiteService.addOrUpdate(u);
    }

    @GetMapping("/findAll")
    public List<Universite> findAll() {
        return universiteService.findAll();
    }

    @GetMapping("/findById")
    public Universite findById(@RequestParam long idUniversite) {
        return universiteService.findById(idUniversite);
    }

    @DeleteMapping("/deleteById")
    public void deleteById(@RequestParam long idUniversite) {
        universiteService.deleteById(idUniversite);
    }

    @PutMapping("/affecterFoyerAUniversite")
    public Universite affecterFoyerAUniversite(@RequestParam long idFoyer,
                                               @RequestParam String nomUniversite) {
        return universiteService.affecterFoyerAUniversite(idFoyer, nomUniversite);
    }

    @PutMapping("/desaffecterFoyerAUniversite")
    public Universite desaffecterFoyerAUniversite(@RequestParam long idUniversite) {
        return universiteService.desaffecterFoyerAUniversite(idUniversite);
    }
}