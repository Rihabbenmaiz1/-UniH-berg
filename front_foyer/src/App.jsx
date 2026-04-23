import { useState } from "react";
import BlocModule from "./BlocModule";
import ChambreModule from "./ChambreModule";
import UniversiteModule from "./UniversiteModule";
import EtudiantModule from "./EtudiantModule";
import ReservationModule from "./ReservationModule";
import FoyerModule from "./FoyerModule"; // ✅ AJOUT
import Chatbot from "./Chatbot";

function Sidebar({ page, setPage }) {
    return (
        <div style={{
            width: 240,
            background: "#1e293b",
            color: "white",
            padding: "1.5rem 0",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            position: "fixed"
        }}>
            <div style={{ padding: "0 1.5rem 2rem" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#38bdf8" }}>
                    🏛️ UniHéberg
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                    Gestion universitaire
                </div>
            </div>

            {[
                { label: "Universités", icon: "🏛️", page: "universites" },
                { label: "Foyers", icon: "🏠", page: "foyers" }, // ✅ AJOUT
                { label: "Blocs", icon: "🏢", page: "blocs" },
                { label: "Chambres", icon: "🛏️", page: "chambres" },
                { label: "Étudiants", icon: "👤", page: "etudiants" },
                { label: "Réservations", icon: "📅", page: "reservations" },
            ].map(item => (
                <div
                    key={item.page}
                    onClick={() => setPage(item.page)}
                    style={{
                        padding: "0.75rem 1.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        background: page === item.page ? "#0f172a" : "transparent",
                        borderLeft: page === item.page ? "3px solid #38bdf8" : "3px solid transparent",
                        color: page === item.page ? "#38bdf8" : "#cbd5e1",
                        fontSize: "0.9rem",
                        fontWeight: page === item.page ? "600" : "400"
                    }}
                >
                    <span>{item.icon}</span> {item.label}
                </div>
            ))}
        </div>
    );
}

export default function App() {
    const [page, setPage] = useState("universites");

    return (
        <div style={{ display: "flex" }}>
            <Sidebar page={page} setPage={setPage} />

            <div style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
                {page === "universites" && <UniversiteModule setPage={setPage} />}

                {page === "foyers" && <FoyerModule />} {/* ✅ AJOUT */}

                {page === "blocs" && <BlocModule setPage={setPage} />}
                {page === "chambres" && <ChambreModule setPage={setPage} />}
                {page === "etudiants" && <EtudiantModule />}
                {page === "reservations" && <ReservationModule />}
            </div>
            <Chatbot />
        </div>
    );
}