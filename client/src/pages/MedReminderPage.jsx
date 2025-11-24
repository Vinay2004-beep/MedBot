import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Mascot image: adjust path to your assets folder!
import botAvatar from "../assets/robo3.png";

function requestNotifPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

function MedReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    medicine: "",
    dose: "",
    time: "",
    frequency: "daily"
  });
  const [editIdx, setEditIdx] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    requestNotifPermission();
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userData);

    async function loadReminders() {
      if (userData && userData.email) {
        const docSnap = await getDoc(doc(db, "reminders", userData.email));
        if (docSnap.exists()) {
          setReminders(docSnap.data().reminders || []);
        } else {
          setReminders([]);
        }
      }
    }
    loadReminders();
  }, []);

  useEffect(() => {
    if (user && user.email) {
      const save = async () => {
        const cleanedReminders = reminders.map(rem => {
          const cleaned = {};
          Object.keys(rem).forEach(key => {
            cleaned[key] = rem[key] === undefined ? null : rem[key];
          });
          return cleaned;
        });
        await setDoc(doc(db, "reminders", user.email), { reminders: cleanedReminders });
      };
      save();
    }
    localStorage.setItem("medReminders", JSON.stringify(reminders));
  }, [reminders, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      reminders.forEach(rem => {
        if (rem.enabled && rem.time) {
          const [hour, minute] = rem.time.split(":").map(Number);
          if (
            now.getHours() === hour &&
            now.getMinutes() === minute
          ) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(`Medicine Reminder: ${rem.medicine}`,
                { body: `Dose: ${rem.dose} (${rem.frequency})` });
            } else {
              alert(`Medicine Reminder!\n${rem.medicine} (${rem.dose})`);
            }
          }
        }
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [reminders]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.medicine || !form.dose || !form.time) return;
    const reminder = {
      medicine: form.medicine || "",
      dose: form.dose || "",
      time: form.time || "",
      frequency: form.frequency || "",
      enabled: true,
      id: Date.now(),
      jobId: null
    };
    if (editIdx !== null) {
      setReminders(reminders.map((r, idx) =>
        idx === editIdx ? { ...reminder } : r
      ));
      setEditIdx(null);
    } else {
      setReminders([...reminders, reminder]);
    }
    setForm({ medicine: "", dose: "", time: "", frequency: "daily" });
  }

  function handleEdit(idx) {
    setEditIdx(idx);
    setForm({ ...reminders[idx] });
  }

  function handleDelete(idx) {
    setReminders(reminders.filter((_, i) => i !== idx));
    setEditIdx(null);
    setForm({ medicine: "", dose: "", time: "", frequency: "daily" });
  }

  function toggleEnable(idx) {
    setReminders(reminders.map((r, i) =>
      i === idx ? { ...r, enabled: !r.enabled } : r
    ));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #eaf6ff 0%, #d8ebfd 90%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 26,
          boxShadow: "0 8px 32px #2076fa22",
          width: "100%",
          maxWidth: 500,
          padding: "55px 38px 32px",
          minHeight: 660,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {/* Mascot top-left */}
        <img
          src={botAvatar}
          alt="MedBot"
          style={{
            width: 75,
            height: 75,
            borderRadius: "50%",
            background: "#eaf6ff",
            position: "absolute",
            left: 28,
            top: 22,
            boxShadow: "0 2px 15px #2976fd22",
            objectFit: "contain",
            zIndex: 2
          }}
        />
        <h2
          style={{
            color: "#2076fa",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 35,
            letterSpacing: "1px"
          }}
        >
          Medication Reminder
        </h2>
        <form onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", marginBottom: 32 }}>
          <input
            type="text"
            name="medicine"
            value={form.medicine}
            onChange={handleChange}
            placeholder="Medicine Name"
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="Dose (e.g. 1 tablet)"
            style={inputStyle}
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="daily">Daily</option>
            <option value="once">Once</option>
            <option value="twice daily">Twice Daily</option>
            <option value="every other day">Every Other Day</option>
            <option value="weekly">Weekly</option>
          </select>
          <button type="submit" style={addBtnStyle}>
            {editIdx !== null ? "Update Reminder" : "Add Reminder"}
          </button>
        </form>
        <div style={{ marginTop: 32, width: "100%" }}>
          <h4 style={{ marginBottom: 14, color: "#2976fd" }}>Scheduled Reminders:</h4>
          {reminders.length === 0 && <div style={{ color: "#aaa" }}>No reminders set.</div>}
          {reminders.map((rem, idx) => (
            <div key={rem.id} style={{
              background: rem.enabled ? "#e5f3ff" : "#f6f6f6",
              marginBottom: 10,
              borderRadius: 12,
              padding: "13px 18px",
              position: "relative",
              boxShadow: "0 1px 6px #2076fa18"
            }}>
              <div style={{ fontWeight: "bold", fontSize: 18, color: "#184" }}>
                {rem.medicine}
                <span style={{
                  fontWeight: "normal",
                  color: "#444",
                  fontSize: 13,
                  marginLeft: 6
                }}>({rem.frequency})</span>
              </div>
              <div style={{ fontSize: 15, color: "#334", marginTop: 2 }}>
                Dose: {rem.dose} | Time: {rem.time ? rem.time : 'N/A'}
              </div>
              <div style={{
                position: "absolute", right: 10, top: 14,
                display: "flex", gap: 7
              }}>
                <button onClick={() => handleEdit(idx)} style={miniBtn}>Edit</button>
                <button onClick={() => handleDelete(idx)} style={miniBtn}>Delete</button>
                <button onClick={() => toggleEnable(idx)} style={miniBtn}>
                  {rem.enabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, color: "#495", marginTop: 26, marginBottom: 82 }}>
          Notifications will appear in your browser and mobile!
        </div>
        {/* Dashboard button */}
        <div style={{
          position: "absolute",
          bottom: 27,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#2076fa",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "17px 70px",
              fontWeight: "bold",
              fontSize: "1.12rem",
              boxShadow: "0 2px 13px #2076fa32",
              letterSpacing: "0.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <img src={botAvatar} alt="Dashboard" style={{
              width: 30, height: 30, borderRadius: "50%", background: "#fff", objectFit: "cover"
            }} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}


const inputStyle = {
  width: "100%",
  padding: "13px 12px",
  borderRadius: 10,
  border: "1.4px solid #b7d3fb",
  fontSize: "1.08rem",
  background: "#f8fdff"
};
const addBtnStyle = {
  width: "100%",
  background: "#2076fa",
  color: "#fff",
  padding: "13px 0",
  border: "none",
  borderRadius: 12,
  fontWeight: "bold",
  fontSize: "1.15rem",
  marginTop: 3,
  boxShadow: "0 2px 9px #2976fd13",
  cursor: "pointer"
};
const miniBtn = {
  fontSize: 13,
  padding: "2px 9px",
  border: "none",
  borderRadius: 6,
  marginLeft: 3,
  background: "#b8eaff",
  color: "#284",
  fontWeight: "bold",
  cursor: "pointer"
};

export default MedReminderPage;
