import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "/api";
const CAP = { SIMPLE: 1, DOUBLE: 2, TRIPLE: 3 };

// ✅ Helper unifié : le backend retourne `id` (via getId())
const getId = (c) => c?.id ?? c?.idChambre;

const isLibre  = (c) => (c.placesOccupees || 0) < CAP[c.typeChambre];
const pct      = (c) => Math.round(((c.placesOccupees || 0) / CAP[c.typeChambre]) * 100);
const barColor = (p) => p >= 100 ? "#dc2626" : p >= 50 ? "#d97706" : "#16a34a";

const Ico = {
  plus:   <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>,
  edit:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  link:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  search: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  grid:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  list:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

function TypeBadge({ type }) {
  const m = {
    SIMPLE: { bg: "#e0f2fe", color: "#075985", label: "Simple" },
    DOUBLE: { bg: "#ede9fe", color: "#4c1d95", label: "Double" },
    TRIPLE: { bg: "#fef3c7", color: "#92400e", label: "Triple" },
  };
  const s = m[type] || m.SIMPLE;
  return <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>;
}

function StatusPill({ chambre }) {
  const p = pct(chambre);
  const cap = CAP[chambre.typeChambre];
  const occ = chambre.placesOccupees || 0;
  const dispo = cap - occ;
  if (p >= 100) return <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Complète</span>;
  if (p === 0)  return <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Libre</span>;
  return <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{dispo} libre{dispo > 1 ? "s" : ""}</span>;
}

function CapCell({ chambre }) {
  const p = pct(chambre);
  const cap = CAP[chambre.typeChambre];
  return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 64, height: 5, background: "#e8edf4", borderRadius: 99, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ height: "100%", width: `${p}%`, background: barColor(p), borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 11, color: "#8a9ab5", whiteSpace: "nowrap" }}>{chambre.placesOccupees || 0}/{cap}</span>
      </div>
  );
}

function ChambreCard({ chambre, onEdit, onDelete }) {
  const p = pct(chambre);
  const cap = CAP[chambre.typeChambre];
  const occ = chambre.placesOccupees || 0;
  return (
      <div
          style={{ background: "#fff", border: "1px solid #e8edf4", borderRadius: 14, overflow: "hidden", transition: "border-color .15s, box-shadow .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a6bc4"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,107,196,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8edf4"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ height: 5, background: barColor(p) }} />
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f2d52", letterSpacing: "-0.02em", lineHeight: 1 }}>{chambre.numeroChambre}</div>
              <div style={{ marginTop: 6 }}><TypeBadge type={chambre.typeChambre} /></div>
            </div>
            <StatusPill chambre={chambre} />
          </div>
          <div style={{ fontSize: 11, marginBottom: 12 }}>
            {chambre.bloc
                ? <span style={{ fontWeight: 600, color: "#1a6bc4" }}>{chambre.bloc.nomBloc}</span>
                : <span style={{ color: "#c0cadb", fontStyle: "italic" }}>Non assignée</span>
            }
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
            {Array.from({ length: cap }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 28, borderRadius: 6,
                  background: i < occ ? (p >= 100 ? "#fee2e2" : "#fef3c7") : "#f0f9f4",
                  border: `1px solid ${i < occ ? (p >= 100 ? "#fecaca" : "#fde68a") : "#bbf7d0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={i < occ ? (p >= 100 ? "#dc2626" : "#d97706") : "#16a34a"} strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 4, background: "#e8edf4", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${p}%`, background: barColor(p), borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 10, color: "#8a9ab5", fontWeight: 500 }}>{occ}/{cap}</span>
            {/* ✅ Utilise getId() */}
            <button onClick={() => onEdit(chambre)} style={{ background: "#f0f4f8", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", display: "flex", color: "#0f2d52" }}>{Ico.edit}</button>
            <button onClick={() => onDelete(getId(chambre))} style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 6, padding: "4px 6px", cursor: "pointer", display: "flex", color: "#dc2626" }}>{Ico.trash}</button>
          </div>
        </div>
      </div>
  );
}

function ChambreRow({ chambre, onEdit, onDelete }) {
  return (
      <div
          style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 140px 120px 100px", padding: "11px 18px", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background .1s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f2d52" }}>{chambre.numeroChambre}</div>
        <div>
          {chambre.bloc
              ? <span style={{ fontSize: 12, fontWeight: 500, color: "#1a6bc4", background: "#e0f0ff", padding: "2px 10px", borderRadius: 20 }}>{chambre.bloc.nomBloc}</span>
              : <span style={{ fontSize: 11, color: "#c0cadb", fontStyle: "italic" }}>—</span>
          }
        </div>
        <div><TypeBadge type={chambre.typeChambre} /></div>
        <div><CapCell chambre={chambre} /></div>
        <div><StatusPill chambre={chambre} /></div>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={() => onEdit(chambre)} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0f4f8", border: "none", borderRadius: 6, padding: "5px 9px", fontSize: 11, fontWeight: 500, color: "#0f2d52", cursor: "pointer" }}>
            {Ico.edit} Éditer
          </button>
          {/* ✅ Utilise getId() */}
          <button onClick={() => onDelete(getId(chambre))} style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 7px", cursor: "pointer", display: "flex", color: "#dc2626" }}>
            {Ico.trash}
          </button>
        </div>
      </div>
  );
}

function Modal({ title, onClose, onSave, saveLabel = "Enregistrer", children }) {
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
            <button onClick={onSave} style={{ background: "#1a6bc4", border: "none", borderRadius: 9, padding: "8px 22px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>{saveLabel}</button>
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
        fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10,
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

const selectStyle = {
  fontSize: 12, padding: "8px 28px 8px 10px", border: "1px solid #dde3ec",
  borderRadius: 8, background: "#fff", color: "#1a2740", cursor: "pointer",
  outline: "none", appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%238a9ab5' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 9px center",
};

export default function ChambreModule() {
  const [chambres, setChambres]       = useState([]);
  const [blocs, setBlocs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [editData, setEditData]       = useState(null);
  const [toast, setToast]             = useState(null);
  const [chambreForm, setChambreForm] = useState({ numeroChambre: "", typeChambre: "SIMPLE", blocId: "" });
  const [affectForm, setAffectForm]   = useState({ chambreId: "", blocId: "" });
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState("");
  const [filterDispo, setFilterDispo] = useState("");
  const [filterBloc, setFilterBloc]   = useState("");
  const [viewMode, setViewMode]       = useState("liste");

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([
        axios.get(`${API}/chambres`),
        axios.get(`${API}/blocs`),
      ]);
      setChambres(c.data);
      setBlocs(b.data);
    } catch {
      showToast("Impossible de joindre le serveur", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openAdd = () => {
    setEditData(null);
    setChambreForm({ numeroChambre: "", typeChambre: "SIMPLE", blocId: "" });
    setModal("chambre");
  };

  const openEdit = (c) => {
    // ✅ On stocke l'id correct depuis getId()
    setEditData({ ...c, _resolvedId: getId(c) });
    setChambreForm({
      numeroChambre: c.numeroChambre,
      typeChambre:   c.typeChambre,
      blocId:        c.bloc?.idBloc ?? c.bloc?.id ?? "",
    });
    setModal("chambre");
  };

  const saveChambre = async () => {
    if (!chambreForm.numeroChambre.trim()) return;
    try {
      const payload = {
        numeroChambre: chambreForm.numeroChambre,
        typeChambre:   chambreForm.typeChambre,
      };

      if (editData) {
        // ✅ Utilise _resolvedId (= getId(c)) pour l'URL PUT
        const resolvedId = editData._resolvedId;
        await axios.put(`${API}/chambres/${resolvedId}`, payload);
        if (chambreForm.blocId) {
          await axios.put(`${API}/chambres/affecter-chambre`, null, {
            params: {
              chambreId: Number(resolvedId),
              blocId:    Number(chambreForm.blocId),
            },
          });
        }
        showToast("Chambre modifiée");
      } else {
        const res = await axios.post(`${API}/chambres`, payload);
        // ✅ Le backend retourne `id` via getId()
        const newId = res.data?.id ?? res.data?.idChambre;
        if (chambreForm.blocId && newId) {
          await axios.put(`${API}/chambres/affecter-chambre`, null, {
            params: {
              chambreId: Number(newId),
              blocId:    Number(chambreForm.blocId),
            },
          });
        }
        showToast("Chambre ajoutée");
      }

      setModal(null);
      loadAll();
    } catch (e) {
      showToast(e.response?.data?.message || "Erreur", "error");
    }
  };

  const deleteChambre = async (id) => {
    if (!id) return;
    if (!window.confirm("Supprimer cette chambre ?")) return;
    try {
      await axios.delete(`${API}/chambres/${id}`);
      showToast("Chambre supprimée");
      loadAll();
    } catch {
      showToast("Impossible de supprimer", "error");
    }
  };

  const saveAffecter = async () => {
    // ✅ parseInt avec garde isNaN
    const chambreId = parseInt(affectForm.chambreId, 10);
    const blocId    = parseInt(affectForm.blocId,    10);

    if (isNaN(chambreId) || isNaN(blocId)) {
      showToast("Chambre et bloc obligatoires", "error");
      return;
    }

    try {
      await axios.put(`${API}/chambres/affecter-chambre`, null, {
        params: { chambreId, blocId },
      });
      showToast("Chambre affectée");
      setModal(null);
      loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'affectation", "error");
    }
  };

  const filtered = chambres.filter(c => {
    if (search      && !c.numeroChambre.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType  && c.typeChambre !== filterType) return false;
    if (filterDispo === "libre"  && !isLibre(c)) return false;
    if (filterDispo === "pleine" &&  isLibre(c)) return false;
    if (filterBloc  && (!c.bloc || String(c.bloc.idBloc ?? c.bloc.id) !== filterBloc)) return false;
    return true;
  });

  const totalLibres  = chambres.filter(isLibre).length;
  const totalPleines = chambres.length - totalLibres;

  const btnVue = (mode) => ({
    border: "none", background: viewMode === mode ? "#fff" : "none",
    borderRadius: 7, padding: "6px 9px", cursor: "pointer",
    color: viewMode === mode ? "#0f2d52" : "#8a9ab5",
    display: "flex", alignItems: "center",
    boxShadow: viewMode === mode ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
  });

  const W = { width: "100%", display: "block", padding: "8px 12px", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
      <div style={{ background: "#f0f4f8", minHeight: "100vh" }}>

        {/* ── Header ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f2d52" }}>Gestion des chambres</div>
            <div style={{ fontSize: 11, color: "#8a9ab5" }}>Module · Blocs & Chambres</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
                onClick={() => { setAffectForm({ chambreId: "", blocId: "" }); setModal("affecter"); }}
                style={{ background: "#fff", border: "1px solid #1a6bc4", color: "#1a6bc4", padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
            >
              {Ico.link} Affecter
            </button>
            <button
                onClick={openAdd}
                style={{ background: "#1a6bc4", color: "#fff", border: "none", padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}
            >
              {Ico.plus} Nouvelle chambre
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e8edf4", padding: "14px 28px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total",   value: chambres.length,  color: undefined  },
            { label: "Libres",  value: totalLibres,       color: "#15803d"  },
            { label: "Pleines", value: totalPleines,      color: "#b91c1c"  },
            { label: "Simples", value: chambres.filter(c => c.typeChambre === "SIMPLE").length, color: "#075985" },
            { label: "Doubles", value: chambres.filter(c => c.typeChambre === "DOUBLE").length, color: "#4c1d95" },
            { label: "Triples", value: chambres.filter(c => c.typeChambre === "TRIPLE").length, color: "#92400e" },
          ].map(s => (
              <div key={s.label} style={{ background: "#f8fafc", border: "1px solid #e8edf4", borderRadius: 9, padding: "10px 16px", minWidth: 90 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#8a9ab5", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color || "#0f2d52", lineHeight: 1 }}>{s.value}</div>
              </div>
          ))}
        </div>

        {/* ── Contenu ── */}
        <div style={{ padding: "22px 28px" }}>
          {/* Toolbar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#adb8cc", display: "flex" }}>{Ico.search}</span>
              <input
                  placeholder="N° chambre..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 32, width: 160, padding: "8px 12px 8px 32px", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 12, outline: "none" }}
              />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
              <option value="">Tous les types</option>
              <option value="SIMPLE">Simple</option>
              <option value="DOUBLE">Double</option>
              <option value="TRIPLE">Triple</option>
            </select>
            <select value={filterDispo} onChange={e => setFilterDispo(e.target.value)} style={selectStyle}>
              <option value="">Disponibilité</option>
              <option value="libre">Libres</option>
              <option value="pleine">Pleines</option>
            </select>
            {/* ✅ Filtre bloc : utilise id ou idBloc */}
            <select value={filterBloc} onChange={e => setFilterBloc(e.target.value)} style={selectStyle}>
              <option value="">Tous les blocs</option>
              {blocs.map((b, i) => (
                  <option key={b.idBloc ?? b.id ?? `bloc-${i}`} value={String(b.idBloc ?? b.id)}>
                    {b.nomBloc}
                  </option>
              ))}
            </select>
            <span style={{ fontSize: 11, color: "#8a9ab5", fontWeight: 500 }}>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: "#f0f4f8", padding: 3, borderRadius: 9 }}>
              <button style={btnVue("grille")} onClick={() => setViewMode("grille")}>{Ico.grid}</button>
              <button style={btnVue("liste")}  onClick={() => setViewMode("liste")}>{Ico.list}</button>
            </div>
          </div>

          {loading && <Spinner />}
          {!loading && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem", color: "#adb8cc", fontSize: 14 }}>Aucune chambre trouvée</div>
          )}

          {/* Vue grille */}
          {!loading && viewMode === "grille" && filtered.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                {filtered.map((c, i) => (
                    // ✅ key stable avec getId()
                    <ChambreCard
                        key={getId(c) ?? `chambre-${i}`}
                        chambre={c}
                        onEdit={openEdit}
                        onDelete={deleteChambre}
                    />
                ))}
              </div>
          )}

          {/* Vue liste */}
          {!loading && viewMode === "liste" && filtered.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #e8edf4", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 140px 120px 100px", padding: "10px 18px", background: "#f8fafc", borderBottom: "1px solid #e8edf4" }}>
                  {["N° Chambre", "Bloc", "Type", "Capacité", "Statut", "Actions"].map(h => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#8a9ab5", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
                  ))}
                </div>
                {filtered.map((c, i) => (
                    // ✅ key stable avec getId()
                    <ChambreRow
                        key={getId(c) ?? `chambre-${i}`}
                        chambre={c}
                        onEdit={openEdit}
                        onDelete={deleteChambre}
                    />
                ))}
              </div>
          )}
        </div>

        {/* ── Modal Chambre (ajout / édition) ── */}
        {modal === "chambre" && (
            <Modal
                title={editData ? "Modifier la chambre" : "Nouvelle chambre"}
                onClose={() => setModal(null)}
                onSave={saveChambre}
            >
              <Field label="Numéro de chambre">
                <input
                    style={W}
                    value={chambreForm.numeroChambre}
                    onChange={e => setChambreForm({ ...chambreForm, numeroChambre: e.target.value })}
                    placeholder="Ex : 101"
                />
              </Field>
              <Field label="Type">
                <select style={W} value={chambreForm.typeChambre} onChange={e => setChambreForm({ ...chambreForm, typeChambre: e.target.value })}>
                  <option value="SIMPLE">Simple</option>
                  <option value="DOUBLE">Double</option>
                  <option value="TRIPLE">Triple</option>
                </select>
              </Field>
              {/* Bloc uniquement à la création */}
              {!editData && (
                  <Field label="Bloc (optionnel)">
                    <select style={W} value={chambreForm.blocId} onChange={e => setChambreForm({ ...chambreForm, blocId: e.target.value })}>
                      <option value="">— Aucun bloc —</option>
                      {blocs.map((b, i) => (
                          <option key={b.idBloc ?? b.id ?? `bloc-${i}`} value={String(b.idBloc ?? b.id)}>
                            {b.nomBloc}
                          </option>
                      ))}
                    </select>
                  </Field>
              )}
              {editData && (
                  <div style={{ background: '#f0f4f8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#4a5a72' }}>
                    💡 Pour changer le bloc, utilisez le bouton <strong>Affecter</strong> depuis la liste.
                  </div>
              )}
            </Modal>
        )}

        {/* ── Modal Affecter ── */}
        {modal === "affecter" && (
            <Modal
                title="Affecter une chambre à un bloc"
                onClose={() => setModal(null)}
                onSave={saveAffecter}
                saveLabel="Affecter"
            >
              <Field label="Chambre">
                <select
                    style={W}
                    value={affectForm.chambreId}
                    onChange={e => setAffectForm({ ...affectForm, chambreId: e.target.value })}
                >
                  <option value="">— Choisir une chambre —</option>
                  {chambres.map((c, i) => {
                    // ✅ value = getId(c) → champ `id` retourné par le backend
                    const cid = getId(c);
                    return (
                        <option key={cid ?? `chambre-${i}`} value={String(cid)}>
                          {c.numeroChambre} ({c.typeChambre}) — {c.bloc ? c.bloc.nomBloc : "Non assignée"}
                        </option>
                    );
                  })}
                </select>
              </Field>
              <Field label="Bloc de destination">
                <select
                    style={W}
                    value={affectForm.blocId}
                    onChange={e => setAffectForm({ ...affectForm, blocId: e.target.value })}
                >
                  <option value="">— Choisir un bloc —</option>
                  {blocs.map((b, i) => (
                      <option key={b.idBloc ?? b.id ?? `bloc-${i}`} value={String(b.idBloc ?? b.id)}>
                        {b.nomBloc}
                      </option>
                  ))}
                </select>
              </Field>
            </Modal>
        )}

        <Toast msg={toast?.msg} type={toast?.type} />
      </div>
  );
}