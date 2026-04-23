package tn.fsegt.foyer.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.fsegt.foyer.Entities.Bloc;

@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {
}