package tn.fsegt.foyer.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.fsegt.foyer.Entities.Foyer;
import tn.fsegt.foyer.Repositories.FoyerRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class FoyerServiceImpl implements IFoyerService {

    private final FoyerRepository foyerRepository;

    @Override
    public Foyer add(Foyer foyer) {
        return foyerRepository.save(foyer);
    }

    @Override
    public List<Foyer> findAll() {
        return foyerRepository.findAll();
    }
}
