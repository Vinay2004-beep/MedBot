import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

import userAvatar from '../assets/avatar.png';
import botAvatar from '../assets/robo3.png';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserDetails({ name: "Not logged in", email: "-" });
        return;
      }
      try {
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
      } catch (error) {
        setUserDetails({ name: "Error loading user", email: "" });
      }
    });
    return () => unsubscribe();
  }, []);

  function handleLogout() {
    signOut(auth).then(() => {
      navigate("/login"); // update this route if needed
    });
  }

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
        width: 220, background: "#f0f4fa", padding: "30px 24px", boxShadow: "0 0 4px #ddd", display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <img src={userAvatar} alt="User" style={{ width: 64, borderRadius: "50%", marginBottom: 15 }} />
        <div style={{ fontWeight: "bold", fontSize: 18, marginTop: 16 }}>{userDetails.name}</div>
        <div style={{ fontSize: 14, color: "#466", marginBottom: 30 }}>{userDetails.email}</div>
        <button
          onClick={handleLogout}
          style={{
            background: "#fff",
            color: "#d11a1a",
            border: "1px solid #d11a1a",
            borderRadius: 20,
            padding: "8px 24px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.2s",
            marginTop: "auto"
          }}
        >
          Log Out
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 0 0 0" }}>
        <h2 style={{textAlign: "center", color: "#2076fa", marginBottom: 12}}>Chat with MedBot</h2>
        <div style={{
          flex: 1,
          padding: "0 12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18
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
                  width: "100%"
                }}
              >
                <img
                  src={isUser ? userAvatar : botAvatar}
                  alt={msg.role}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    margin: isUser ? "0 0 0 12px" : "0 12px 0 0",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    background: isUser ? "#2076fa" : "#ececec",
                    color: isUser ? "#fff" : "#222",
                    padding: "11px 16px",
                    borderRadius: 22,
                    minWidth: 48,
                    maxWidth: "70%",
                    whiteSpace: "pre-line",
                    marginLeft: isUser ? 0 : 8,
                    marginRight: isUser ? 8 : 0,
                    wordBreak: "break-word",
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
