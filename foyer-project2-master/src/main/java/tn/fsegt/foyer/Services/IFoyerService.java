package tn.fsegt.foyer.Services;

import tn.fsegt.foyer.Entities.Foyer;
import java.util.List;

public interface IFoyerService {

    Foyer add(Foyer foyer);

    List<Foyer> findAll();
}
