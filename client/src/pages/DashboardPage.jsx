import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userData);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {}
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <div>No user information found. Please login.</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(90deg, #e6f4ff 70%, #cddcf8 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          width: "900px",
          background: "#fff",
          boxShadow: "0 8px 32px #a7bff422",
          borderRadius: 24,
          padding: "44px 44px",
          alignItems: "center",
          position: "relative"
        }}
      >
        <div style={{ display: "flex", gap: "40px", width: "100%" }}>
          {/* LEFT SIDE: Greeting + Details Table */}
          <div style={{ flex: 1, minWidth: 275 }}>
            <h2 style={{ fontWeight: "bold", color: "#2076fa", marginBottom: 8 }}>
              Hello, {user.name ? user.name : "User"}!
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#f5faff",
                borderRadius: 10,
                fontSize: "1.08rem",
                boxShadow: "0 2px 8px #b7d3fb22",
                overflow: "hidden"
              }}
            >
              <tbody>
                <TableRow label="Email" value={user.email} />
                <TableRow label="Age" value={user.age} />
                <TableRow label="Weight" value={user.weight} />
                <TableRow label="Height" value={user.height} />
                <TableRow label="Phone" value={user.phone} />
                <TableRow label="Allergies" value={user.allergies} />
                <TableRow label="Medications" value={user.medications} />
                <TableRow label="Chronic Conditions" value={user.chronicConditions} />
              </tbody>
            </table>
          </div>

          {/* RIGHT SIDE: Cards for Chat and Reminder */}
          <div
            style={{
              flex: "0 0 320px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              alignItems: "center",
              marginLeft: 15,
              marginTop: 10,
            }}
          >
            <DashboardCard
              title="Chat with MedBot"
              description="24/7 medical Q&A—get instant help and info."
              btnText="Start Chat"
              onClick={() => navigate("/chat")}
            />

            <DashboardCard
              title="Medication Reminder"
              description="Set, view, and manage your medicine schedule."
              btnText="Go to Reminders"
              onClick={() => navigate("/reminders")}
            />
          </div>
        </div>

        {/* LOGOUT BUTTON CENTERED AT BOTTOM */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "44px",
            marginBottom: "-20px"
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#f75050",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "13px 44px",
              fontWeight: "bold",
              fontSize: "1.15rem",
              cursor: "pointer",
              boxShadow: "0 2px 7px #f7505011",
              transition: "background 0.18s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#d12020")}
            onMouseOut={e => (e.currentTarget.style.background = "#f75050")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const TableRow = ({ label, value }) => (
  <tr style={{ borderBottom: "1px solid #e5ecfc" }}>
    <td style={{ fontWeight: "bold", padding: "11px 18px", color: "#2976fd", width: "42%" }}>{label}</td>
    <td style={{ padding: "11px 18px", color: "#333" }}>{value ? value : <span style={{ color: "#bbb" }}>-</span>}</td>
  </tr>
);

const DashboardCard = ({ title, description, btnText, onClick }) => (
  <div
    style={{
      width: "100%",
      minHeight: 112,
      background: "linear-gradient(98deg, #e6f4ff 70%, #dbe8fc 100%)",
      borderRadius: 18,
      boxShadow: "0 2px 12px #b7d3fb13",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "24px 24px",
      position: "relative"
    }}
  >
    <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "#2076fa", marginBottom: 7 }}>
      {title}
    </div>
    <div style={{ fontSize: "1.06rem", color: "#444", marginBottom: 15 }}>{description}</div>
    <button
      style={{
        background: "#2076fa",
        color: "#fff",
        padding: "11px 25px",
        borderRadius: 9,
        fontWeight: "bold",
        fontSize: "1.05rem",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px #2076fa18",
        transition: "background 0.18s"
      }}
      onClick={onClick}
      onMouseOver={e => (e.currentTarget.style.background = "#0a53be")}
      onMouseOut={e => (e.currentTarget.style.background = "#2076fa")}
    >
      {btnText}
    </button>
  </div>
);

export default DashboardPage;
