package tn.fsegt.foyer.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.fsegt.foyer.Entities.Foyer;

@Repository
public interface FoyerRepository extends JpaRepository<Foyer, Long> {
    Foyer findByNomFoyer(String nomFoyer);
}