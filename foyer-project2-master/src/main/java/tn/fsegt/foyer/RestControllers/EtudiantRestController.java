package tn.fsegt.foyer.RestControllers;

import tn.fsegt.foyer.Entities.Etudiant;
import tn.fsegt.foyer.Services.IEtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/etudiant")
public class EtudiantRestController {

    @Autowired
    IEtudiantService etudiantService;

    @PostMapping("/addOrUpdate")
    public Etudiant addOrUpdate(@RequestBody Etudiant etudiant) {
        return etudiantService.addOrUpdate(etudiant);
    }

    @GetMapping("/findAll")
    public List<Etudiant> findAll() {
        return etudiantService.getAll();
    }

    @GetMapping("/findById")
    public Etudiant findById(@RequestParam long id) {
        return etudiantService.getById(id);
    }

    @DeleteMapping("/deleteById")
    public void deleteById(@RequestParam long id) {
        etudiantService.delete(id);
    }
}
