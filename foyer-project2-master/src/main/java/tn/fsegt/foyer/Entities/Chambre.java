package tn.fsegt.foyer.Entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chambres")
public class Chambre {

    // =========================
    // ENUM
    // =========================
    public enum TypeChambre {
        SIMPLE, DOUBLE, TRIPLE;

        public int getCapacite() {
            return switch (this) {
                case SIMPLE -> 1;
                case DOUBLE -> 2;
                case TRIPLE -> 3;
            };
        }
    }

    // =========================
    // ATTRIBUTS
    // =========================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_chambre", unique = true, nullable = false)
    private String numeroChambre;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_chambre", nullable = false)
    private TypeChambre typeChambre;

    @Column(name = "places_occupees", nullable = false)
    private int placesOccupees = 0;

    // =========================
    // RELATION BLOC (FIX CRASH JSON)
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bloc_id")
    @JsonIgnore
    private Bloc bloc;

    // =========================
    // RELATION RESERVATION
    // =========================
    @OneToMany(mappedBy = "chambre", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reservation> reservations = new ArrayList<>();

    // =========================
    // CONSTRUCTEURS
    // =========================
    public Chambre() {}

    public Chambre(String numeroChambre, TypeChambre typeChambre) {
        this.numeroChambre = numeroChambre;
        this.typeChambre = typeChambre;
    }

    // =========================
    // LOGIQUE MÉTIER
    // =========================
    public int getCapacite() {
        return typeChambre.getCapacite();
    }

    public int getPlacesDisponibles() {
        return Math.max(0, getCapacite() - placesOccupees);
    }

    public boolean isPleine() {
        return placesOccupees >= getCapacite();
    }

    public boolean isDisponible() {
        return !isPleine();
    }

    // =========================
    // GETTERS / SETTERS
    // =========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroChambre() {
        return numeroChambre;
    }

    public void setNumeroChambre(String numeroChambre) {
        this.numeroChambre = numeroChambre;
    }

    public TypeChambre getTypeChambre() {
        return typeChambre;
    }

    public void setTypeChambre(TypeChambre typeChambre) {
        this.typeChambre = typeChambre;
    }

    public int getPlacesOccupees() {
        return placesOccupees;
    }

    public void setPlacesOccupees(int placesOccupees) {
        this.placesOccupees = placesOccupees;
    }

    public Bloc getBloc() {
        return bloc;
    }

    public void setBloc(Bloc bloc) {
        this.bloc = bloc;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }
}