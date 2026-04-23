import { useState } from "react";

function Chatbot() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [open, setOpen] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const res = await fetch("http://localhost:8080/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message })
            });
            const data = await res.text();
            setChat(prev => [
                ...prev,
                { sender: "user", text: message },
                { sender: "bot", text: data }
            ]);
            setMessage("");
        } catch (error) {
            setChat(prev => [...prev, { sender: "bot", text: "Erreur serveur ❌" }]);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    if (!open) return (
        <div onClick={() => setOpen(true)} style={{
            position: "fixed", bottom: 20, right: 20,
            background: "#0ea5e9", color: "white",
            borderRadius: "50%", width: 56, height: 56,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "1.5rem",
            boxShadow: "0 4px 12px rgba(14,165,233,0.4)"
        }}>🤖</div>
    );

    return (
        <div style={{
            position: "fixed", bottom: 20, right: 20,
            width: 320, background: "white",
            borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
            {/* Header */}
            <div style={{ background: "#0ea5e9", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "white", fontWeight: "700" }}>🤖 Assistant UniHéberg</div>
                <span onClick={() => setOpen(false)} style={{ color: "white", cursor: "pointer", fontSize: "1.2rem" }}>✕</span>
            </div>

            {/* Messages */}
            <div style={{ height: 250, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {chat.length === 0 && (
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center" }}>
                        Bonjour ! Comment puis-je vous aider ? 😊
                    </p>
                )}
                {chat.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        background: msg.sender === "user" ? "#0ea5e9" : "#f1f5f9",
                        color: msg.sender === "user" ? "white" : "#0f172a",
                        padding: "0.5rem 0.9rem", borderRadius: 12,
                        fontSize: "0.85rem", maxWidth: "80%"
                    }}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div style={{ padding: "0.75rem", borderTop: "1px solid #e2e8f0", display: "flex", gap: "0.5rem" }}>
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Tapez votre message..."
                    style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8, border: "1.5px solid #e2e8f0", outline: "none", fontSize: "0.85rem" }}
                />
                <button onClick={sendMessage} style={{
                    padding: "0.5rem 0.9rem", background: "#0ea5e9", color: "white",
                    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "700"
                }}>➤</button>
            </div>
        </div>
    );
}

export default Chatbot;