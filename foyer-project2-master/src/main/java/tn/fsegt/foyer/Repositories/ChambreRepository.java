package tn.fsegt.foyer.Repositories;

import tn.fsegt.foyer.Entities.Chambre;
import tn.fsegt.foyer.Entities.Chambre.TypeChambre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChambreRepository extends JpaRepository<Chambre, Long> {

    boolean existsByNumeroChambre(String numeroChambre);

    Optional<Chambre> findByNumeroChambre(String numeroChambre);

    @Query("SELECT c FROM Chambre c WHERE c.bloc.id = :blocId")
    List<Chambre> findByBlocIdBloc(@Param("blocId") Long blocId);

    List<Chambre> findByTypeChambre(TypeChambre type);

    long countByTypeChambre(TypeChambre type);

    @Query("SELECT c FROM Chambre c WHERE c.typeChambre = :type AND c.bloc.foyer.nomFoyer = :nomFoyer")
    List<Chambre> findByTypeChambreAndBlocFoyerNomFoyer(@Param("type") TypeChambre type, @Param("nomFoyer") String nomFoyer);

    @Query("SELECT c FROM Chambre c WHERE " +
            "(c.typeChambre = 'SIMPLE' AND c.placesOccupees < 1) OR " +
            "(c.typeChambre = 'DOUBLE' AND c.placesOccupees < 2) OR " +
            "(c.typeChambre = 'TRIPLE' AND c.placesOccupees < 3)")
    List<Chambre> findChambresLibres();

    @Query("SELECT c FROM Chambre c WHERE c.bloc.id = :blocId AND (" +
            "(c.typeChambre = 'SIMPLE' AND c.placesOccupees < 1) OR " +
            "(c.typeChambre = 'DOUBLE' AND c.placesOccupees < 2) OR " +
            "(c.typeChambre = 'TRIPLE' AND c.placesOccupees < 3))")
    List<Chambre> findChambresLibresByBlocId(@Param("blocId") Long blocId);
}