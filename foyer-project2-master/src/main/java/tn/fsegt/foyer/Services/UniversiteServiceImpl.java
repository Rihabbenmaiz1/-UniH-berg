package tn.fsegt.foyer.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Entities.Universite;
import tn.fsegt.foyer.Repositories.FoyerRepository;
import tn.fsegt.foyer.Repositories.UniversiteRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class UniversiteServiceImpl implements IUniversiteService {

    UniversiteRepository universiteRepository;
    FoyerRepository foyerRepository;

    @Override
    public Universite addOrUpdate(Universite u) {
        return universiteRepository.save(u);
    }

    @Override
    public List<Universite> findAll() {
        return universiteRepository.findAll();
    }

    @Override
    public Universite findById(long id) {
        return universiteRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteById(long id) {
        universiteRepository.deleteById(id);
    }

    // ✅ CORRIGÉ ICI
    @Override
    public Universite affecterFoyerAUniversite(long idFoyer, String nomUniversite) {

        Universite universite = universiteRepository.findByNomUniversite(nomUniversite);
        if (universite == null) {
            throw new RuntimeException("Université introuvable");
        }

        Foyer foyer = foyerRepository.findById(idFoyer).orElse(null);
        if (foyer == null) {
            throw new RuntimeException("Foyer introuvable");
        }

        // 🔥 libérer ancien lien (corrige ton erreur 500)
        Universite ancienne = universiteRepository.findByFoyer(foyer);
        if (ancienne != null) {
            ancienne.setFoyer(null);
            universiteRepository.save(ancienne);
        }

        universite.setFoyer(foyer);
        return universiteRepository.save(universite);
    }

    @Override
    public Universite desaffecterFoyerAUniversite(long idUniversite) {
        Universite universite = universiteRepository.findById(idUniversite).orElse(null);
        universite.setFoyer(null);
        return universiteRepository.save(universite);
    }

    @Override
    public Foyer ajouterFoyerEtAffecterAUniversite(Foyer foyer, long idUniversite) {
        Universite universite = universiteRepository.findById(idUniversite).orElse(null);
        foyer.getBlocs().forEach(bloc -> bloc.setFoyer(foyer));
        Foyer savedFoyer = foyerRepository.save(foyer);
        universite.setFoyer(savedFoyer);
        universiteRepository.save(universite);
        return savedFoyer;
    }
    @Override
    public void supprimerFoyer(long idFoyer) {
        foyerRepository.deleteById(idFoyer);
    }

    @Override
    public Foyer updateFoyer(Foyer foyer) {
        return foyerRepository.save(foyer);
    }
}