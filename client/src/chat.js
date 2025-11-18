import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // fix path as needed
import { doc, getDoc } from "firebase/firestore";

// Use your local asset paths (public/assets or src/assets)
const userAvatar = "/assets/avatar.png";
const botAvatar = "/assets/robo3.png";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });

  useEffect(() => {
    async function fetchUserDetails() {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails({
          name: docSnap.data().name || "No name",
          email: user.email || ""
        });
      } else {
        setUserDetails({ name: "Unknown user", email: user.email || "" });
      }
    }
    fetchUserDetails();
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: "user", content: input }]);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages(msgs => [...msgs, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages(msgs => [...msgs, { role: "assistant", content: "Error: " + error.message }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: "#f0f4fa", padding: "30px 24px", boxShadow: "0 0 4px #ddd"
      }}>
        <img src={userAvatar} alt="User" style={{ width: 64, borderRadius: "50%", marginBottom: 15 }} />
        <div style={{ fontWeight: "bold", fontSize: 18 }}>{userDetails.name}</div>
        <div style={{ fontSize: 14, color: "#466" }}>{userDetails.email}</div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: "32px 0 0 0", display: "flex", flexDirection: "column" }}>
        <h2 style={{textAlign: "center", color: "#2076fa", marginBottom: 12}}>Chat with MedBot</h2>
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: isUser ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  width: "100%",
                  margin: 0,
                }}
              >
                {/* Avatar */}
                <img
                  src={isUser ? userAvatar : botAvatar}
                  alt={msg.role}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    margin: isUser ? "0 0 0 12px" : "0 12px 0 0",
                  }}
                />
                {/* Message Bubble */}
                <div
                  style={{
                    background: isUser ? "#2076fa" : "#ececec",
                    color: isUser ? "#fff" : "#222",
                    padding: "11px 16px",
                    borderRadius: 22,
                    minWidth: 48,
                    maxWidth: "68%",
                    whiteSpace: "pre-line",
                    marginLeft: isUser ? 0 : 8,
                    marginRight: isUser ? 8 : 0,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{textAlign: "center", marginTop: 18}}>
              <i>MedBot is thinking...</i>
            </div>
          )}
        </div>
        {/* Input area */}
        <div style={{
          display: "flex", padding: "18px 22px", borderTop: "1px solid #ddd", gap: 11,
          background: "#f9fbff"
        }}>
          <input
            type="text"
            style={{ flex: 1, padding: 10, fontSize: 16, borderRadius: 20, border: "1px solid #2076fa" }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
            padding: "0 23px", fontSize: 17, background: "#2076fa", color: "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer"
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}
