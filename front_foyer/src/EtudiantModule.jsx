import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import EtudiantCard from "./EtudiantCard";
import HistoriqueModal from "./HistoriqueModal";

const API = "http://localhost:8080";

const IconPlus   = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>;
const IconSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function Modal({ title, onClose, onSave, saveLabel = "Enregistrer", children }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,45,82,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "1.75rem", width: 440, maxWidth: "94vw", boxShadow: "0 20px 60px rgba(15,45,82,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "#0f2d52" }}>{title}</span>
                    <button onClick={onClose} style={{ background: "#f0f4f8", border: "none", borderRadius: 8, padding: "5px 7px", color: "#8a9ab5", display: "flex", cursor: "pointer" }}>
                        <IconX />
                    </button>
                </div>
                <div>{children}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "1.5rem" }}>
                    <button onClick={onClose} style={{ background: "#fff", border: "1px solid #dde3ec", borderRadius: 9, padding: "8px 18px", fontSize: 13, color: "#4a5a72", fontWeight: 500, cursor: "pointer" }}>
                        Annuler
                    </button>
                    <button onClick={onSave} style={{ background: "#1a6bc4", border: "none", borderRadius: 9, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4a5a72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function Toast({ msg, type }) {
    if (!msg) return null;
    const ok = type !== "error";
    return (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 2000, background: ok ? "#0f2d52" : "#7f1d1d", color: "#fff", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
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
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function EtudiantModule() {
    const [etudiants, setEtudiants]                   = useState([]);
    const [loading, setLoading]                       = useState(true);
    const [modal, setModal]                           = useState(null);
    const [editData, setEditData]                     = useState(null);
    const [search, setSearch]                         = useState("");
    const [toast, setToast]                           = useState(null);
    const [historiqueOpen, setHistoriqueOpen]         = useState(false);
    const [historiqueEtudiant, setHistoriqueEtudiant] = useState(null);
    const [reservations, setReservations]             = useState([]);
    const [historiqueLoading, setHistoriqueLoading]   = useState(false);
    const [form, setForm] = useState({
        nomEt: "", prenomEt: "", cin: "", ecole: "", dateNaissance: ""
    });

    const showToast = useCallback((msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const loadEtudiants = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/etudiant/findAll`);
            setEtudiants(Array.isArray(res.data) ? res.data : []);
        } catch {
            showToast("Impossible de charger les étudiants", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadEtudiants();
    }, [loadEtudiants]);

    const openAdd = () => {
        setEditData(null);
        setForm({ nomEt: "", prenomEt: "", cin: "", ecole: "", dateNaissance: "" });
        setModal("etudiant");
    };

    const openEdit = (e) => {
        setEditData(e);
        setForm({
            nomEt: e.nomEt,
            prenomEt: e.prenomEt,
            cin: e.cin,
            ecole: e.ecole,
            dateNaissance: e.dateNaissance ? e.dateNaissance.substring(0, 10) : ""
        });
        setModal("etudiant");
    };

    // ✅ CORRIGÉ : on envoie debutAnnee et finAnnee obligatoires
    const voirHistorique = async (etudiant) => {
        setHistoriqueEtudiant(etudiant);
        setHistoriqueOpen(true);
        setReservations([]);
        setHistoriqueLoading(true);
        try {
            const annee = new Date().getFullYear();
            const debutAnnee = `${annee - 1}-09-01`; // ex: 2024-09-01
            const finAnnee   = `${annee}-06-30`;      // ex: 2025-06-30

            const res = await axios.get(
                `${API}/reservation/getReservationParAnneeUniversitaire`,
                { params: { debutAnnee, finAnnee } }
            );

            const toutes = Array.isArray(res.data) ? res.data : [];

            // La réservation contient une liste d'étudiants → on cherche avec .some()
            const filtrees = toutes.filter(r =>
                Array.isArray(r.etudiants)
                    ? r.etudiants.some(e => e.idEtudiant === etudiant.idEtudiant)
                    : r.etudiant?.idEtudiant === etudiant.idEtudiant
            );

            setReservations(filtrees);
        } catch {
            setReservations([]);
        } finally {
            setHistoriqueLoading(false);
        }
    };

    const closeHistorique = () => {
        setHistoriqueOpen(false);
        setHistoriqueEtudiant(null);
        setReservations([]);
    };

    const save = async () => {
        const { nomEt, prenomEt, cin, ecole, dateNaissance } = form;
        if (!nomEt.trim() || !prenomEt.trim() || !cin || !ecole || !dateNaissance) {
            showToast("⚠️ Tous les champs sont obligatoires", "error");
            return;
        }
        if (!/^\d{8}$/.test(cin)) {
            showToast("❌ CIN doit contenir exactement 8 chiffres", "error");
            return;
        }
        if (new Date(dateNaissance) > new Date()) {
            showToast("❌ Date de naissance invalide", "error");
            return;
        }
        try {
            const payload = { ...form, cin: Number(cin) };
            if (editData) {
                await axios.post(`${API}/etudiant/addOrUpdate`, { ...payload, idEtudiant: editData.idEtudiant });
                showToast("Étudiant modifié");
            } else {
                await axios.post(`${API}/etudiant/addOrUpdate`, payload);
                showToast("Étudiant ajouté");
            }
            setModal(null);
            loadEtudiants();
        } catch (e) {
            showToast(e.response?.data?.message || "Erreur", "error");
        }
    };

    const deleteEtudiant = async (id) => {
        if (!window.confirm("Supprimer cet étudiant ?")) return;
        try {
            await axios.delete(`${API}/etudiant/deleteById?id=${id}`);
            showToast("Étudiant supprimé");
            loadEtudiants();
        } catch {
            showToast("Impossible de supprimer", "error");
        }
    };

    const filtered = etudiants.filter(e =>
        `${e.nomEt} ${e.prenomEt} ${e.ecole}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

            {/* TopBar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f2d52" }}>Gestion des étudiants</div>
                    <div style={{ fontSize: 11, color: "#8a9ab5", marginTop: 1 }}>Module · Étudiants</div>
                </div>
                <button
                    onClick={openAdd}
                    style={{ background: "#1a6bc4", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
                >
                    <IconPlus /> Nouvel étudiant
                </button>
            </div>

            {/* Stats */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "16px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, maxWidth: 400 }}>
                    <StatCard label="Total étudiants" value={etudiants.length} accent="#1a6bc4" hint="inscrits" />
                    <StatCard label="Résultats" value={filtered.length} hint="affichés" />
                </div>
            </div>

            {/* Contenu */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                {/* Recherche */}
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
                        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#adb8cc", display: "flex" }}>
                            <IconSearch />
                        </span>
                        <input
                            placeholder="Rechercher un étudiant..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: "100%", paddingLeft: 34 }}
                        />
                    </div>
                </div>

                {/* Liste */}
                {loading ? (
                    <Spinner />
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#adb8cc", fontSize: 14 }}>
                        Aucun étudiant trouvé
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                        {filtered.map(e => (
                            <EtudiantCard
                                key={e.idEtudiant}
                                e={e}
                                onEdit={openEdit}
                                onDelete={deleteEtudiant}
                                onHistorique={voirHistorique}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Étudiant */}
            {modal === "etudiant" && (
                <Modal
                    title={editData ? "Modifier l'étudiant" : "Nouvel étudiant"}
                    onClose={() => setModal(null)}
                    onSave={save}
                >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Nom">
                            <input style={{ width: "100%" }} value={form.nomEt} onChange={e => setForm(f => ({ ...f, nomEt: e.target.value }))} placeholder="Nom" autoFocus />
                        </Field>
                        <Field label="Prénom">
                            <input style={{ width: "100%" }} value={form.prenomEt} onChange={e => setForm(f => ({ ...f, prenomEt: e.target.value }))} placeholder="Prénom" />
                        </Field>
                    </div>
                    <Field label="CIN">
                        <input style={{ width: "100%" }} type="number" value={form.cin} onChange={e => setForm(f => ({ ...f, cin: e.target.value }))} placeholder="Ex : 12345678" />
                    </Field>
                    <Field label="École">
                        <input style={{ width: "100%" }} value={form.ecole} onChange={e => setForm(f => ({ ...f, ecole: e.target.value }))} placeholder="Ex : ESPRIT" />
                    </Field>
                    <Field label="Date de naissance">
                        <input style={{ width: "100%" }} type="date" value={form.dateNaissance} onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))} />
                    </Field>
                </Modal>
            )}

            {/* Modal Historique */}
            <HistoriqueModal
                open={historiqueOpen}
                onClose={closeHistorique}
                etudiant={historiqueEtudiant}
                reservations={reservations}
                loading={historiqueLoading}
            />

            <Toast msg={toast?.msg} type={toast?.type} />
        </div>
    );
}