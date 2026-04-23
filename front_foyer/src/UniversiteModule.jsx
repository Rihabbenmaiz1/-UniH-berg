import { useState, useEffect } from "react";

const API = "http://localhost:8080";

export default function UniversiteModule({ setPage }) {
    const [universites, setUniversites] = useState([]);
    const [form, setForm] = useState({
        nomUniversite: "",
        adresse: "",
        foyer: { nomFoyer: "", capaciteFoyer: 0 }
    });
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => { fetchUniversites(); }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (localStorage.getItem("refreshUniversites") === "true") {
                fetchUniversites();
                localStorage.removeItem("refreshUniversites");
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const fetchUniversites = async () => {
        try {
            const res = await fetch(`${API}/universite/findAll`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setUniversites(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            alert("❌ Erreur chargement universités !");
        }
    };

    const handleSubmit = async () => {
        if (!form.nomUniversite || !form.adresse ) {
            alert("⚠️ Remplir tous les champs !");
            return;
        }

        try {
            const payload = {
                ...form,
                foyer: {
                    ...form.foyer,
                    capaciteFoyer: parseInt(form.foyer.capaciteFoyer) || 0
                }
            };

            const res = await fetch(`${API}/universite/addOrUpdate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            setMessage("✅ Université ajoutée !");
            fetchUniversites();

            setForm({
                nomUniversite: "",
                adresse: "",
                foyer: { nomFoyer: "", capaciteFoyer: 0 }
            });

            setShowForm(false);
            setTimeout(() => setMessage(""), 3000);

        } catch (e) {
            console.error(e);
            alert("❌ Erreur ajout !");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette université ?")) return;

        try {
            const res = await fetch(`${API}/universite/deleteById?idUniversite=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();

            setMessage("🗑️ Supprimée !");
            fetchUniversites();

        } catch (e) {
            console.error(e);
            alert("❌ Erreur suppression !");
        }

        setTimeout(() => setMessage(""), 3000);
    };

    const handleDesaffecter = async (id) => {
        try {
            const res = await fetch(`${API}/universite/desaffecterFoyerAUniversite?idUniversite=${id}`, { method: "PUT" });
            if (!res.ok) throw new Error();

            setMessage("🔓 Foyer désaffecté !");
            fetchUniversites();

        } catch (e) {
            console.error(e);
            alert("❌ Erreur désaffectation !");
        }

        setTimeout(() => setMessage(""), 3000);
    };

    const safeUniversites = Array.isArray(universites) ? universites : [];

    const filtered = safeUniversites.filter(u =>
        u.nomUniversite?.toLowerCase().includes(search.toLowerCase()) ||
        u.adresse?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "2rem", background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Gestion des Universités</h1>
                    <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "0.9rem" }}>Module · Universités & Foyers</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                        style={{ padding: "0.6rem 1.4rem", background: "#0ea5e9", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: "700", fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(14,165,233,0.3)" }}>
                    ➕ Nouvelle université
                </button>
            </div>

            {message && (
                <div style={{ background: "#d1fae5", color: "#065f46", padding: "0.75rem 1rem", borderRadius: 10, marginBottom: "1rem", fontWeight: "600" }}>
                    {message}
                </div>
            )}

            {showForm && (
                <div style={{ background: "white", borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <input placeholder="Nom université" value={form.nomUniversite} onChange={e => setForm({ ...form, nomUniversite: e.target.value })}
                               style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />
                        <input placeholder="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })}
                               style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />
                        <input placeholder="Nom foyer" value={form.foyer.nomFoyer} onChange={e => setForm({ ...form, foyer: { ...form.foyer, nomFoyer: e.target.value } })}
                               style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />
                        <input type="number" placeholder="Capacité foyer" value={form.foyer.capaciteFoyer} onChange={e => setForm({ ...form, foyer: { ...form.foyer, capaciteFoyer: e.target.value } })}
                               style={{ padding: "0.6rem 1rem", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />
                    </div>
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                        <button onClick={handleSubmit}
                                style={{ padding: "0.6rem 1.4rem", background: "#0ea5e9", color: "white", border: "none", borderRadius: 10, fontWeight: "700" }}>
                            Ajouter
                        </button>
                        <button onClick={() => setShowForm(false)}
                                style={{ padding: "0.6rem 1.4rem", background: "#e2e8f0", border: "none", borderRadius: 10 }}>
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                    { label: "TOTAL", value: safeUniversites.length, color: "#0ea5e9" },
                    { label: "AVEC FOYER", value: safeUniversites.filter(u => u.foyer).length, color: "#10b981" },
                    { label: "SANS FOYER", value: safeUniversites.filter(u => !u.foyer).length, color: "#f59e0b" },
                    { label: "CAPACITÉ TOT.", value: safeUniversites.reduce((acc, u) => acc + (u.foyer?.capaciteFoyer || 0), 0), color: "#8b5cf6" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "white", borderRadius: 14, padding: "1.2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `4px solid ${s.color}` }}>
                        <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: "700", margin: 0 }}>{s.label}</p>
                        <p style={{ fontSize: "2rem", fontWeight: "800", color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ background: "white", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <input placeholder="🔍 Rechercher une université..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1.5px solid #e2e8f0", width: 280 }} />
                    <span>{filtered.length} université(s)</span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8fafc" }}>
                    <tr>
                        {["#", "Université", "Adresse", "Foyer", "Capacité", "Statut", "Actions"].map(h => (
                            <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: "700", color: "#64748b" }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(u => (
                        <tr key={u.idUniversite}>
                            <td style={{ padding: "0.9rem 1rem" }}>#{u.idUniversite}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>{u.nomUniversite}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>{u.adresse}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>{u.foyer?.nomFoyer || "Aucun"}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>{u.foyer?.capaciteFoyer || "-"}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>{u.foyer ? "Actif" : "Sans foyer"}</td>
                            <td style={{ padding: "0.9rem 1rem" }}>
                                {u.foyer ? (
                                    <>
                                        <button
                                            onClick={() => handleDesaffecter(u.idUniversite)}
                                            style={{
                                                padding: "0.4rem 0.9rem",
                                                background: "#facc15",
                                                color: "#92400e",
                                                border: "none",
                                                borderRadius: 8,
                                                marginRight: "0.5rem",
                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                        >
                                            🔓 Désaffecter
                                        </button>

                                        <button
                                            onClick={() => handleDelete(u.idUniversite)}
                                            style={{
                                                padding: "0.4rem 0.9rem",
                                                background: "#fecaca",
                                                color: "#7f1d1d",
                                                border: "none",
                                                borderRadius: 8,
                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleDelete(u.idUniversite)}
                                        style={{
                                            padding: "0.4rem 0.9rem",
                                            background: "#fecaca",
                                            color: "#7f1d1d",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: "600",
                                            cursor: "pointer"
                                        }}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

