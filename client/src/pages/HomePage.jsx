import React from 'react';
import robotImg from '../assets/robot.png';
import logoImg from '../assets/logo1.png';


function HomePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#c9f5fcff",
      color: "#222",
      fontFamily: "sans-serif"
    }}>
      <nav style={{
        display: "flex",
        flexdirection: "column",
        alignItems: "flex-start",
        padding: "1.5rem 3rem",
        background: "#053eb0ff",
        borderBottom: "1px solid #1454d7",
        minHeight: "55px",
        position: "relative"
      }}>
        <span style={{ fontWeight: "bold", fontSize: "1.8rem", color: "#f8f8f8ff",marginTop: "10px" }}>
          <img src={logoImg}
               alt="MedBot" style={{ verticalAlign: "middle", width: 40, marginRight: 8 }} />
          MedBot
        </span>
        <div style={{ position: "absolute", right: "3rem", top: "2.2rem" }}>
          <a
            href="/auth"
            style={{
              background: "#2976fd",
              color: "#fff",
              borderRadius: 20,
              padding: "0.5rem 1.2rem",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.12rem",
              boxShadow: "0 1px 7px #1457d744",
            }}
          >
            Login / Register
          </a>
        </div>
      </nav>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1100,
        margin: "4rem auto"
      }}>
        <div style={{ maxWidth: 500 }}>
          <h1 style={{ fontWeight: "bold", fontSize: "3.1rem" }}>Welcome to MedBot</h1>
          <div style={{
            fontSize: "1.5rem",
            margin: "1.5rem 0",
            fontWeight: "bold",
            color: "#3b8edc"
          }}>
            "Your health, just a tap away"
          </div>
          <ul style={{ fontSize: "1.12rem", lineHeight: "2.2" }}>
            <li>24/7 Health Consultation</li>
            <li>Secure Patient Data Management</li>
            <li>AI-Powered Symptom Checker</li>
          </ul>
        </div>
        <div>
          <img
            src={robotImg}
            alt="MedBot Robot"
            style={{ width: "340px", borderRadius: "15px", boxShadow: "0 0 48px #2976fd22" }}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
