package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Etudiant;
import java.util.List;

public interface IEtudiantService {
    Etudiant addOrUpdate(Etudiant etudiant);
    List<Etudiant> getAll();
    Etudiant getById(long id);
    void delete(long id);
}
