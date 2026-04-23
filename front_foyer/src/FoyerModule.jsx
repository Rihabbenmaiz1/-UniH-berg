import { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function FoyerModule() {

    const [foyers, setFoyers] = useState([]);
    const [universites, setUniversites] = useState([]);

    const [form, setForm] = useState({
        nomFoyer: "",
        capaciteFoyer: "",
        idUniversite: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedFoyer, setSelectedFoyer] = useState(null);
    const [editForm, setEditForm] = useState({
        nomFoyer: "",
        capaciteFoyer: ""
    });

    useEffect(() => {
        fetchFoyers();
        fetchUniversites();
    }, []);

    const fetchFoyers = async () => {
        const res = await fetch(`${API}/universite/findAll`);
        const data = await res.json();

        const foyersData = data
            .filter(u => u.foyer)
            .map(u => ({
                ...u.foyer,
                universite: u.nomUniversite
            }));

        setFoyers(foyersData);
    };

    const fetchUniversites = async () => {
        const res = await fetch(`${API}/universite/findAll`);
        const data = await res.json();
        const unisSansFoyer = data.filter(u => !u.foyer);
        setUniversites(unisSansFoyer);
    };

    const handleAdd = async () => {
        if (!form.nomFoyer || !form.capaciteFoyer || !form.idUniversite) {
            alert("⚠️ Remplir tous les champs !");
            return;
        }

        await fetch(
            `${API}/foyer/ajouterFoyerEtAffecterAUniversite?idUniversite=${form.idUniversite}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomFoyer: form.nomFoyer,
                    capaciteFoyer: parseInt(form.capaciteFoyer)
                })
            }
        );

        setForm({ nomFoyer: "", capaciteFoyer: "", idUniversite: "" });
        fetchFoyers();
        fetchUniversites();
    };

    const handleDeleteFoyer = async (foyer) => {

        if (foyer.universite) {
            alert("❌ Impossible de supprimer : ce foyer est affecté à une université.\nDésaffectez-le d'abord.");
            return;
        }

        const confirmDelete = window.confirm("⚠️ Supprimer ce foyer ?");
        if (!confirmDelete) return;

        await fetch(`${API}/foyer/deleteFoyer?idFoyer=${foyer.idFoyer}`, {
            method: "DELETE"
        });

        fetchFoyers();
        fetchUniversites();
    };

    const openEditModal = (foyer) => {
        setSelectedFoyer(foyer);
        setEditForm({
            nomFoyer: foyer.nomFoyer,
            capaciteFoyer: foyer.capaciteFoyer
        });
        setShowModal(true);
    };

    const handleSaveEdit = async () => {
        await fetch(`${API}/foyer/updateFoyer`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idFoyer: selectedFoyer.idFoyer,
                nomFoyer: editForm.nomFoyer,
                capaciteFoyer: parseInt(editForm.capaciteFoyer)
            })
        });

        setShowModal(false);
        fetchFoyers();
    };

    return (
        <div style={{
            padding: "2rem",
            background: "#f1f5f9",
            minHeight: "100vh",
            fontFamily: "Segoe UI"
        }}>

            <style>{`
@keyframes fadeIn {
        from { opacity: 0 }
        to { opacity: 1 }
    }
@keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0 }
        to { transform: scale(1); opacity: 1 }
    }
    `}</style>

            <h2 style={{ marginBottom: "1.5rem", fontWeight: "700" }}>
                Gestion des Foyers
            </h2>

            <div style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: 14,
                marginBottom: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
                <div style={{ marginBottom: "1rem", fontWeight: "600" }}>
                    ➕ Ajouter un foyer
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

                    {universites.length === 0 ? (

                        <div style={{
                            color: "#ef4444",
                            fontWeight: "600"
                        }}>
                            ⚠ Toutes les universités ont déjà un foyer
                        </div>

                    ) : (

                        <>
                            <input
                                placeholder="Nom du foyer"
                                value={form.nomFoyer}
                                onChange={e => setForm({ ...form, nomFoyer: e.target.value })}
                                style={{ padding: "0.6rem", borderRadius: 8, border: "1px solid #ccc" }}
                            />

                            <input
                                type="number"
                                placeholder="Capacité"
                                value={form.capaciteFoyer}
                                onChange={e => setForm({ ...form, capaciteFoyer: e.target.value })}
                                style={{ padding: "0.6rem", borderRadius: 8, border: "1px solid #ccc" }}
                            />

                            <select
                                value={form.idUniversite}
                                onChange={e => setForm({ ...form, idUniversite: e.target.value })}
                                style={{ padding: "0.6rem", borderRadius: 8 }}
                            >
                                <option value="">Choisir université</option>
                                {universites.map(u => (
                                    <option key={u.idUniversite} value={u.idUniversite}>
                                        {u.nomUniversite}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleAdd}
                                style={{
                                    background: "#38bdf8",
                                    color: "white",
                                    border: "none",
                                    padding: "0.6rem 1.2rem",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Ajouter
                            </button>
                        </>
                    )}

                </div>
            </div>

            <div style={{
                background: "white",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed"
                }}>
                    <thead style={{ background: "#f8fafc" }}>
                    <tr>
                        <th style={{ width: "5%", padding: "0.9rem", textAlign: "left" }}>#</th>
                        <th style={{ width: "25%", padding: "0.9rem", textAlign: "left" }}>Foyer</th>
                        <th style={{ width: "20%", padding: "0.9rem", textAlign: "left" }}>Capacité</th>
                        <th style={{ width: "30%", padding: "0.9rem", textAlign: "left" }}>Université</th>
                        <th style={{ width: "20%", padding: "0.9rem", textAlign: "left" }}>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {foyers.map((f, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                            <td style={{ padding: "0.9rem" }}>{i + 1}</td>

                            <td style={{ padding: "0.9rem", fontWeight: "600" }}>
                                {f.nomFoyer}
                            </td>

                            <td style={{ padding: "0.9rem" }}>
                                {f.capaciteFoyer} places
                            </td>

                            <td style={{ padding: "0.9rem" }}>
                                <span style={{
                                    display: "inline-block",
                                    minWidth: "70px",
                                    textAlign: "center",
                                    background: "#e0f2fe",
                                    color: "#0369a1",
                                    padding: "4px 10px",
                                    borderRadius: 8,
                                    fontSize: "0.8rem",
                                    fontWeight: "600"
                                }}>
                                    {f.universite}
                                </span>
                            </td>

                            <td style={{ padding: "0.9rem" }}>
                                <button
                                    onClick={() => openEditModal(f)}
                                    style={{
                                        background: "#fde68a",
                                        border: "none",
                                        padding: "0.4rem 0.8rem",
                                        borderRadius: 8,
                                        marginRight: "0.5rem",
                                        cursor: "pointer"
                                    }}
                                >
                                    ✏️
                                </button>

                                <button
                                    onClick={() => handleDeleteFoyer(f)}
                                    style={{
                                        background: "#fecaca",
                                        border: "none",
                                        padding: "0.4rem 0.8rem",
                                        borderRadius: 8,
                                        cursor: "pointer"
                                    }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 0.3s"
                }}>
                    <div style={{
                        background: "white",
                        padding: "2rem",
                        borderRadius: 14,
                        width: "400px",
                        animation: "scaleIn 0.3s"
                    }}>
                        <h3 style={{ marginBottom: "1rem" }}>Modifier le foyer</h3>

                        <input
                            value={editForm.nomFoyer}
                            onChange={e => setEditForm({ ...editForm, nomFoyer: e.target.value })}
                            style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
                        />

                        <input
                            type="number"
                            value={editForm.capaciteFoyer}
                            onChange={e => setEditForm({ ...editForm, capaciteFoyer: e.target.value })}
                            style={{ width: "100%", padding: "0.6rem", marginBottom: "1rem" }}
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button onClick={() => setShowModal(false)}>Annuler</button>
                            <button onClick={handleSaveEdit} style={{
                                background: "#38bdf8",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: 8
                            }}>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
