package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Entities.Universite;
import java.util.List;

public interface IUniversiteService {
    Universite addOrUpdate(Universite u);
    List<Universite> findAll();
    Universite findById(long id);
    void deleteById(long id);
    Universite affecterFoyerAUniversite(long idFoyer, String nomUniversite);
    Universite desaffecterFoyerAUniversite(long idUniversite);
    Foyer ajouterFoyerEtAffecterAUniversite(Foyer foyer, long idUniversite);

    // 🔥 AJOUT ICI
    void supprimerFoyer(long idFoyer);
    Foyer updateFoyer(Foyer foyer);
}