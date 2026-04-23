export default function HistoriqueModal({ open, onClose, etudiant, reservations, loading }) {
    if (!open || !etudiant) return null;

    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(15,45,82,0.35)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "#fff", borderRadius: 14,
                padding: "1.75rem", width: 500, maxWidth: "94vw",
                boxShadow: "0 20px 60px rgba(15,45,82,0.15)"
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "#0f2d52" }}>
                            Historique des réservations
                        </div>
                        <div style={{ fontSize: 12, color: "#8a9ab5", marginTop: 2 }}>
                            {etudiant.prenomEt} {etudiant.nomEt}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: "#f0f4f8", border: "none", borderRadius: 8, padding: "5px 10px", color: "#8a9ab5", cursor: "pointer", fontSize: 16 }}
                    >
                        ✕
                    </button>
                </div>

                {/* Contenu */}
                <div style={{ minHeight: 80 }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "2rem 0", color: "#8a9ab5" }}>
                            Chargement...
                        </div>
                    ) : reservations.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2rem 0", color: "#adb8cc", fontSize: 14 }}>
                            Aucune réservation trouvée
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {reservations.map(r => (
                                <div
                                    key={r.idReservation}
                                    style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "10px 14px", background: "#f8fafc",
                                        borderRadius: 8, border: "1px solid #e8edf4", fontSize: 13
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: "#0f2d52" }}>
                                            Réservation #{r.idReservation}
                                        </div>
                                        <div style={{ fontSize: 11, color: "#8a9ab5", marginTop: 2 }}>
                                            {/* Affiche l'année universitaire si disponible */}
                                            {r.anneeUniversitaire
                                                ? `Année : ${new Date(r.anneeUniversitaire).getFullYear()}`
                                                : ""}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "3px 10px", borderRadius: 20,
                                        fontSize: 11, fontWeight: 600,
                                        background: r.estValide ? "#dcfce7" : "#fee2e2",
                                        color: r.estValide ? "#16a34a" : "#dc2626"
                                    }}>
                                        {r.estValide ? "✓ Valide" : "✕ Annulée"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                    <button
                        onClick={onClose}
                        style={{ background: "#1a6bc4", border: "none", borderRadius: 9, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}