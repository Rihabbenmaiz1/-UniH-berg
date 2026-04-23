package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Etudiant;
import tn.fsegt.foyer.Repositories.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EtudiantServiceImpl implements IEtudiantService {

    @Autowired
    EtudiantRepository etudiantRepository;

    @Override
    public Etudiant addOrUpdate(Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    @Override
    public List<Etudiant> getAll() {
        return etudiantRepository.findAll();
    }

    @Override
    public Etudiant getById(long id) {
        return etudiantRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(long id) {
        etudiantRepository.deleteById(id);
    }
}