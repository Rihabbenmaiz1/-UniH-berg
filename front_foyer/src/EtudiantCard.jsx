export default function EtudiantCard({ e, onEdit, onDelete, onHistorique }) {
    const initials = `${e.nomEt?.[0] || ""}${e.prenomEt?.[0] || ""}`.toUpperCase();

    return (
        <div style={{ background: "#fff", border: "1px solid #e8edf4", borderRadius: 12, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "#1a6bc4", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                    width: 42,
                    height: 42,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0
                }}>
                    {initials}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                        {e.prenomEt} {e.nomEt}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>
                        {e.ecole || "École non renseignée"}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "12px 16px 14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#8a9ab5" }}>CIN</span>
                        <span style={{ fontWeight: 600, color: "#0f2d52" }}>{e.cin}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#8a9ab5" }}>Date de naissance</span>
                        <span style={{ fontWeight: 500, color: "#4a5a72" }}>
                            {e.dateNaissance ? new Date(e.dateNaissance).toLocaleDateString("fr-FR") : "—"}
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 6, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={() => onHistorique(e)}>📋 Historique</button>
                    <button onClick={() => onEdit(e)}>Modifier</button>
                    <button onClick={() => onDelete(e.idEtudiant)}>Supprimer</button>
                </div>
            </div>
        </div>
    );
}