import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "/api";
const CAP = { SIMPLE: 1, DOUBLE: 2, TRIPLE: 3 };
const isLibre = (c) => (c.placesOccupees || 0) < CAP[c.typeChambre];

const Ico = {
  plus:  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>,
  edit:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  search:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  x:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  bloc:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
};

function Modal({ title, onClose, onSave, children }) {
  return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,45,82,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", width: 420, maxWidth: "94vw", boxShadow: "0 24px 64px rgba(15,45,82,0.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f2d52" }}>{title}</span>
            <button onClick={onClose} style={{ background: "#f0f4f8", border: "none", borderRadius: 8, padding: "5px 7px", color: "#8a9ab5", display: "flex", cursor: "pointer" }}>{Ico.x}</button>
          </div>
          {children}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "1.5rem" }}>
            <button onClick={onClose} style={{ background: "#fff", border: "1px solid #dde3ec", borderRadius: 9, padding: "8px 18px", fontSize: 13, color: "#4a5a72", fontWeight: 500, cursor: "pointer" }}>Annuler</button>
            <button onClick={onSave} style={{ background: "#1a6bc4", border: "none", borderRadius: 9, padding: "8px 22px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Enregistrer</button>
          </div>
        </div>
      </div>
  );
}

function Field({ label, children }) {
  return (
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4a5a72", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
        {children}
      </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const ok = type !== "error";
  return (
      <div style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 2000,
        background: ok ? "#0f2d52" : "#7f1d1d",
        color: "#fff", borderRadius: 10, padding: "11px 20px",
        fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: ok ? "#4ade80" : "#f87171", flexShrink: 0 }} />
        {msg}
      </div>
  );
}

function Spinner() {
  return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", border: "3px solid #e8edf4", borderTopColor: "#1a6bc4", animation: "spin .7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
  );
}

export default function BlocModule() {
  const [blocs, setBlocs]       = useState([]);
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editData, setEditData] = useState(null);
  const [blocForm, setBlocForm] = useState({
    nomBloc: "",
    capaciteBloc: ""
  });  const [search, setSearch]     = useState("");
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [b, c] = await Promise.all([
        axios.get(`${API}/blocs`),
        axios.get(`${API}/chambres`),
      ]);
      setBlocs(b.data);
      setChambres(c.data);
    } catch {
      showToast("Impossible de joindre le serveur", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openAdd  = ()  => { setEditData(null); setBlocForm({ nomBloc: "", capaciteBloc: "" }); setModal(true); };
  const openEdit = (b) => {
    setEditData(b);
    setBlocForm({
      nomBloc: b.nomBloc,
      capaciteBloc: b.capaciteBloc ?? ""
    });
    setModal(true);
  };
  const saveBloc = async () => {
    if (!blocForm.nomBloc.trim()) return;

    const capacite = Number(blocForm.capaciteBloc);

    if (isNaN(capacite) || capacite <= 0) {
      showToast("Capacité invalide", "error");
      return;
    }

    try {
      const payload = {
        nomBloc: blocForm.nomBloc,
        capaciteBloc: capacite
      };

      console.log("blocForm envoyé :", payload);

      if (editData) {
        await axios.put(`${API}/blocs/${editData.idBloc}`, payload);
        showToast("Bloc modifié");
      } else {
        await axios.post(`${API}/blocs`, payload);
        showToast("Bloc ajouté");
      }

      setModal(false);
      loadAll();

    } catch (e) {
      console.log(e);
      showToast(e.response?.data?.message || "Erreur serveur", "error");
    }
  };
  const deleteBloc = async (idBloc) => {
    if (!idBloc) return;
    if (!window.confirm("Supprimer ce bloc ?")) return;
    try {
      await axios.delete(`${API}/blocs/${idBloc}`);
      showToast("Bloc supprimé");
      loadAll();
    } catch {
      showToast("Impossible de supprimer ce bloc", "error");
    }
  };

  const totalLibres  = chambres.filter(isLibre).length;
  const totalPleines = chambres.length - totalLibres;
  const filtered     = blocs.filter(b => b.nomBloc.toLowerCase().includes(search.toLowerCase()));

  const W = { width: "100%", display: "block", padding: "8px 12px", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
      <div style={{ background: "#f0f4f8", minHeight: "100vh", padding: "0" }}>

        {/* ── Header ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f2d52" }}>Gestion des blocs</div>
            <div style={{ fontSize: 11, color: "#8a9ab5" }}>Module · Blocs & Chambres</div>
          </div>
          <button onClick={openAdd} style={{ background: "#1a6bc4", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
            {Ico.plus} Nouveau bloc
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "14px 28px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Blocs",       value: blocs.length,   color: "#1a6bc4" },
            { label: "Chambres",    value: chambres.length, color: undefined },
            { label: "Disponibles", value: totalLibres,     color: "#15803d" },
            { label: "Pleines",     value: totalPleines,    color: "#b91c1c" },
          ].map(s => (
              <div key={s.label} style={{ background: "#f8fafc", border: "1px solid #e8edf4", borderRadius: 9, padding: "10px 16px", minWidth: 90 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#8a9ab5", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color || "#0f2d52", lineHeight: 1 }}>{s.value}</div>
              </div>
          ))}
        </div>

        {/* ── Contenu ── */}
        <div style={{ padding: "22px 28px" }}>
          {/* Recherche */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#adb8cc", display: "flex" }}>{Ico.search}</span>
              <input
                  placeholder="Rechercher un bloc..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 32, width: 260, padding: "8px 12px 8px 32px", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <span style={{ fontSize: 12, color: "#8a9ab5" }}>{filtered.length} bloc{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Liste */}
          {loading ? <Spinner /> : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#adb8cc", fontSize: 14 }}>Aucun bloc enregistré</div>
          ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {filtered.map(b => {
                  const bc = chambres.filter(c => c.bloc?.idBloc === b.idBloc);
                  const bl = bc.filter(isLibre);
                  return (
                      <div key={b.idBloc} style={{ background: "#fff", border: "1px solid #e8edf4", borderRadius: 14, overflow: "hidden" }}>
                        {/* En-tête bleu */}
                        <div style={{ background: "#1a6bc4", padding: "16px 18px", display: "flex", alignItems: "center", gap: 11 }}>
                          <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                            {Ico.bloc}
                          </div>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{b.nomBloc}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
                              {bc.length} chambre{bc.length !== 1 ? "s" : ""} · {bl.length} libre{bl.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        {/* Corps */}
                        <div style={{ padding: "14px 18px 16px" }}>
                          {bc.length > 0 ? (
                              <>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9ab5", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Chambres</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                                  {bc.map(c => (
                                      <span key={c.idChambre} style={{
                                        fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                                        background: isLibre(c) ? "#dcfce7" : "#fee2e2",
                                        color:      isLibre(c) ? "#166534" : "#991b1b",
                                        border:     `1px solid ${isLibre(c) ? "#bbf7d0" : "#fecaca"}`,
                                      }}>
                              {c.numeroChambre}
                            </span>
                                  ))}
                                </div>
                              </>
                          ) : (
                              <div style={{ fontSize: 12, color: "#c0cadb", fontStyle: "italic", marginBottom: 14 }}>Aucune chambre assignée</div>
                          )}
                          <div style={{ display: "flex", gap: 7 }}>
                            <button onClick={() => openEdit(b)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#f0f4f8", border: "none", borderRadius: 8, padding: "8px", fontSize: 12, color: "#0f2d52", fontWeight: 500, cursor: "pointer" }}>
                              {Ico.edit} Modifier
                            </button>
                            <button onClick={() => deleteBloc(b.idBloc)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px", fontSize: 12, color: "#dc2626", fontWeight: 500, cursor: "pointer" }}>
                              {Ico.trash} Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        {/* Modal */}
        {modal && (
            <Modal title={editData ? "Modifier le bloc" : "Nouveau bloc"} onClose={() => setModal(false)} onSave={saveBloc}>
              <Field label="Nom du bloc">
                <input
                    style={W}
                    value={blocForm.nomBloc}
                    onChange={e =>
                        setBlocForm({
                          ...blocForm,
                          nomBloc: e.target.value
                        })
                    }
                    placeholder="Ex : Bloc A"
                    autoFocus
                />

              </Field>
              <Field label="Capacité du bloc">
                <input
                    type="number"
                    style={W}
                    value={blocForm.capaciteBloc || ""}
                    onChange={e =>
                        setBlocForm({
                          ...blocForm,
                          capaciteBloc: e.target.value
                        })
                    }
                    placeholder="Ex : 30"
                />
              </Field>

            </Modal>
        )}

        <Toast msg={toast?.msg} type={toast?.type} />
      </div>
  );
}
