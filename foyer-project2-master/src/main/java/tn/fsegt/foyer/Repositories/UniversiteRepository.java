package tn.fsegt.foyer.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Entities.Universite;

@Repository
public interface UniversiteRepository extends JpaRepository<Universite, Long> {

    Universite findByNomUniversite(String nomUniversite);

    // 🔥 AJOUT IMPORTANT (corrige ton erreur)
    Universite findByFoyer(Foyer foyer);
}