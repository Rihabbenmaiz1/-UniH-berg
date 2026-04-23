package tn.fsegt.foyer.Entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bloc")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"foyer", "chambres"})
@EqualsAndHashCode(exclude = {"foyer", "chambres"})
public class Bloc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bloc")
    private Long idBloc;

    @Column(name = "nom_bloc", nullable = false)
    private String nomBloc;

    @Column(name = "capacite_bloc")
    private Long capaciteBloc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "foyer_id")
    @JsonIgnore
    private Foyer foyer;

    @OneToMany(mappedBy = "bloc", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Chambre> chambres = new ArrayList<>();
}