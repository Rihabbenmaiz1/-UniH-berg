import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Chatbot from "./Chatbot";

const API = "http://localhost:8080";

const Icon = {
    plus:  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>,
    trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    search:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    x:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

function Modal({ title, onClose, onSave, saveLabel = "Enregistrer", children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,45,82,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: 440, maxWidth: "94vw", boxShadow: "0 20px 60px rgba(15,45,82,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "#0f2d52" }}>{title}</span>
                    <button onClick={onClose} style={{ background: "#f0f4f8", border: "none", borderRadius: 8, padding: "5px 7px", color: "#8a9ab5", display: "flex" }}>{Icon.x}</button>
                </div>
                <div>{children}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "1.5rem" }}>
                    <button onClick={onClose} style={{ background: "#fff", border: "1px solid #dde3ec", borderRadius: 9, padding: "8px 18px", fontSize: 13, color: "#4a5a72", fontWeight: 500 }}>Annuler</button>
                    <button onClick={onSave} style={{ background: "#1a6bc4", border: "none", borderRadius: 9, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{saveLabel}</button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4a5a72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
            {children}
        </div>
    );
}

function Toast({ msg, type }) {
    if (!msg) return null;
    const ok = type !== "error";
    return (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, background: ok ? "#0f2d52" : "#7f1d1d", color: "#fff", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: ok ? "#4ade80" : "#f87171", flexShrink: 0 }} />
            {msg}
        </div>
    );
}

function StatCard({ label, value, accent, hint }) {
    return (
        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1px solid #e8edf4" }}>
            <div style={{ fontSize: 10, color: "#8a9ab5", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: accent || "#0f2d52", lineHeight: 1 }}>{value}</div>
            {hint && <div style={{ fontSize: 11, color: accent || "#8a9ab5", marginTop: 5, fontWeight: 500 }}>{hint}</div>}
        </div>
    );
}

function Spinner() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem 0" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", border: "3px solid #e8edf4", borderTopColor: "#1a6bc4", animation: "spin .7s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

export default function ReservationModule() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [modal, setModal]               = useState(null);
    const [search, setSearch]             = useState("");
    const [toast, setToast]               = useState(null);
    const [form, setForm]                 = useState({ numChambre: "", cin: "" });

    // ✅ CIN de l'étudiant pour annulation (selon énoncé Service 11)
    const [cinEtudiant, setCinEtudiant]   = useState("");

    const showToast = useCallback((msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const loadReservations = useCallback(async () => {
        setLoading(true);
        try {
            const today = new Date();
            const year = today.getFullYear();

            let debut, fin;

            if (today.getMonth() + 1 <= 7) {
                debut = `${year - 1}-09-15`;
                fin   = `${year}-06-30`;
            } else {
                debut = `${year}-09-15`;
                fin   = `${year + 1}-06-30`;
            }

            const res = await axios.get(
                `${API}/reservation/getReservationParAnneeUniversitaire?debutAnnee=${debut}&finAnnee=${fin}`
            );

            setReservations(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error(e);
            setReservations([]);
            showToast("Erreur chargement réservations", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { loadReservations(); }, [loadReservations]);

    const ajouterReservation = async () => {
        if (!form.numChambre || !form.cin) return;
        try {
            await axios.post(
                `${API}/reservation/ajouterReservationEtAssignerAChambreEtAEtudiant?numChambre=${form.numChambre}&cin=${form.cin}`
            );
            showToast("Réservation ajoutée avec succès");
            setModal(null);
            loadReservations();
        } catch (e) {
            showToast(e.response?.data || e.response?.data?.message || "Erreur lors de la réservation", "error");
        }
    };

    // ✅ CORRIGÉ : annulation par CIN étudiant (Service 11)
    const annulerReservation = async () => {
        if (!cinEtudiant) return;
        try {
            await axios.delete(`${API}/reservation/annulerReservation`, {
                params: { cinEtudiant }
            });
            showToast("Réservation annulée avec succès");
            setModal(null);
            loadReservations();
        } catch (e) {
            showToast(e.response?.data || "Aucune réservation trouvée", "error");
        }
    };

    const totalValides   = reservations.filter(r => r.estValide).length;
    const totalInvalides = reservations.filter(r => !r.estValide).length;

    const filtered = reservations.filter(r =>
        String(r.idReservation).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

            {/* TopBar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f2d52" }}>Gestion des réservations</div>
                    <div style={{ fontSize: 11, color: "#8a9ab5", marginTop: 1 }}>Module · Réservations</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => { setCinEtudiant(""); setModal("annuler"); }}
                        style={{ background: "#fff", color: "#dc2626", border: "1px solid #fecaca", padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
                    >
                        {Icon.trash} Annuler réservation
                    </button>
                    <button
                        onClick={() => { setForm({ numChambre: "", cin: "" }); setModal("ajouter"); }}
                        style={{ background: "#1a6bc4", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
                    >
                        {Icon.plus} Nouvelle réservation
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "16px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, maxWidth: 500 }}>
                    <StatCard label="Total" value={reservations.length} accent="#1a6bc4" hint="réservations" />
                    <StatCard label="Valides" value={totalValides} accent="#15803d" hint="actives" />
                    {/* Stats <StatCard label="Invalides" value={totalInvalides} accent="#b91c1c" hint="annulées" />*/}
                </div>
            </div>

            {/* Contenu */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#adb8cc", display: "flex" }}>{Icon.search}</span>
                        <input
                            placeholder="Rechercher par ID réservation..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 34 }}
                        />
                    </div>
                </div>

                {loading ? <Spinner /> : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#adb8cc", fontSize: 14 }}>Aucune réservation trouvée</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {filtered.map(r => (
                            <div key={r.idReservation} style={{ background: "#fff", border: "1px solid #e8edf4", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: r.estValide ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ color: r.estValide ? "#166534" : "#991b1b" }}>{r.estValide ? Icon.check : Icon.x}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f2d52" }}>{r.idReservation}</div>
                                        <div style={{ fontSize: 12, color: "#8a9ab5", marginTop: 3 }}>
                                            {r.anneeUniversitaire ? new Date(r.anneeUniversitaire).toLocaleDateString("fr-FR") : "—"}
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                                    background: r.estValide ? "#dcfce7" : "#fee2e2",
                                    color: r.estValide ? "#166534" : "#991b1b",
                                    border: `1px solid ${r.estValide ? "#bbf7d0" : "#fecaca"}`,
                                }}>
                                    {r.estValide ? "Valide" : "Annulée"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CHATBOT */}
            <div style={{ marginTop: 30 }}>
                <Chatbot reservations={reservations} />
            </div>

            {/* Modal Ajouter */}
            {modal === "ajouter" && (
                <Modal title="Nouvelle réservation" onClose={() => setModal(null)} onSave={ajouterReservation} saveLabel="Réserver">
                    <Field label="Numéro de chambre">
                        <input
                            style={{ width: "100%" }}
                            type="number"
                            value={form.numChambre}
                            onChange={e => setForm(f => ({ ...f, numChambre: e.target.value }))}
                            placeholder="Ex : 101"
                            autoFocus
                        />
                    </Field>
                    <Field label="CIN de l'étudiant">
                        <input
                            style={{ width: "100%" }}
                            type="number"
                            value={form.cin}
                            onChange={e => setForm(f => ({ ...f, cin: e.target.value }))}
                            placeholder="Ex : 12345678"
                        />
                    </Field>
                </Modal>
            )}

            {/* ✅ Modal Annuler — par CIN étudiant */}
            {modal === "annuler" && (
                <Modal title="Annuler une réservation" onClose={() => setModal(null)} onSave={annulerReservation} saveLabel="Annuler la réservation">
                    <Field label="CIN de l'étudiant">
                        <input
                            style={{ width: "100%" }}
                            type="number"
                            value={cinEtudiant}
                            onChange={e => setCinEtudiant(e.target.value)}
                            placeholder="Ex : 12345678"
                            autoFocus
                        />
                    </Field>
                </Modal>
            )}

            <Toast msg={toast?.msg} type={toast?.type} />
        </div>
    );
}