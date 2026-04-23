package tn.fsegt.foyer.RestControllers;

import tn.fsegt.foyer.Entities.Bloc;
import tn.fsegt.foyer.Services.BlocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blocs")
@CrossOrigin(origins = "*")
public class BlocController {

    @Autowired
    private BlocService blocService;

    // GET /api/blocs
    @GetMapping
    public ResponseEntity<List<Bloc>> getAllBlocs() {
        return ResponseEntity.ok(blocService.getAllBlocs());
    }

    // GET /api/blocs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Bloc> getBlocById(@PathVariable Long id) {
        return ResponseEntity.ok(blocService.getBlocById(id));
    }

    // POST /api/blocs
    @PostMapping
    public ResponseEntity<Bloc> createBloc(@RequestBody Bloc bloc) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blocService.createBloc(bloc));
    }

    // PUT /api/blocs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Bloc> updateBloc(@PathVariable Long id, @RequestBody Bloc bloc) {
        return ResponseEntity.ok(blocService.updateBloc(id, bloc));
    }

    // DELETE /api/blocs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloc(@PathVariable Long id) {
        blocService.deleteBloc(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/affecterBlocAFoyer")
    public Bloc affecterBloc(
            @RequestParam long idBloc,
            @RequestParam long idFoyer) {

        return blocService.affecterBlocAFoyer(idBloc, idFoyer);
    }

    // GET /api/blocs/{id}/chambres
    @GetMapping("/{id}/chambres")
    public ResponseEntity<?> getChambresByBloc(@PathVariable Long id) {
        return ResponseEntity.ok(blocService.getBlocById(id).getChambres());
    }
}