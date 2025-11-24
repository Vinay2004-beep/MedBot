import React, { useState } from "react";
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import botIcon from "../assets/robo3.png";

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Signup state fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [phone, setPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const navigate = useNavigate();

  const clearSignupFields = () => {
    setName('');
    setAge('');
    setWeight('');
    setHeight('');
    setPhone('');
    setAllergies('');
    setMedications('');
    setChronicConditions('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Sign up logic
  const handleSignup = async () => {
    setError('');
    setSuccessMsg('');
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        name, age, weight, height, phone, allergies, medications, chronicConditions, email
      });
      localStorage.setItem("userDetails", JSON.stringify({
        name, age, weight, height, phone, allergies, medications, chronicConditions, email
      }));

      setSuccessMsg("Successfully registered!");
      clearSignupFields();
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  // Login logic
  const handleLogin = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      let userObj = {
        name: user.displayName || "",
        email: user.email,
        age: "",
        weight: "",
        height: "",
        phone: "",
        allergies: "",
        medications: "",
        chronicConditions: ""
      };
      if (docSnap.exists()) {
        userObj = { ...userObj, ...docSnap.data() };
      }
      localStorage.setItem("userDetails", JSON.stringify(userObj));

      setSuccessMsg("Login successful!");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e6f4ff 0%, #d8ebfd 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px #2974fd22",
        width: "100%",
        maxWidth: 410,
        padding: "38px 32px 34px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Success message bar */}
        {successMsg && (
          <div style={{
            backgroundColor: "#eafbe5",
            color: "#25b031",
            padding: "12px",
            borderRadius: 7,
            width: "100%",
            marginBottom: 20,
            marginTop: 5,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.07rem"
          }}>
            {successMsg}
          </div>
        )}
        {/* Mascot and headline */}
        <img src={botIcon} alt="MedBot" style={{ width: 58, marginBottom: 8 }} />
        <h2 style={{
          color: "#2076fa", fontWeight: "bold", margin: 0, fontSize: "2rem", textAlign: "center"
        }}>{isSignup ? "Sign Up" : "Login"}</h2>
        <div style={{
          color: "#2976fd",
          textAlign: "center",
          marginBottom: 18,
          marginTop: 6,
          fontWeight: "600"
        }}>
          Your health, just a tap away
        </div>
        {error && <div style={{ color: "#d11a1a", marginBottom: 12, textAlign: "center" }}>{error}</div>}
        <form
          onSubmit={e => { e.preventDefault(); isSignup ? handleSignup() : handleLogin(); }}
          autoComplete="off"
          style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inputStyle} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={inputStyle} required />
          {isSignup && (
            <>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" style={inputStyle} required />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={inputStyle} required />
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" style={inputStyle} required />
              <div style={{
                background: "#eaf6ff", padding: "12px 8px", borderRadius: 8, margin: "8px 0"
              }}>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (kg)" style={inputStyle} required />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height (cm)" style={inputStyle} required />
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number (optional)" style={inputStyle} />
                <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Any Allergies" style={inputStyle} required />
                <input type="text" value={medications} onChange={e => setMedications(e.target.value)} placeholder="Current Medication" style={inputStyle} required />
                <input type="text" value={chronicConditions} onChange={e => setChronicConditions(e.target.value)} placeholder="Chronic Conditions" style={inputStyle} required />
              </div>
            </>
          )}
          <button type="submit"
            style={{
              width: "100%",
              background: "#2076fa",
              color: "#fff",
              padding: "12px 0",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: "1.15rem",
              marginTop: 16,
              boxShadow: "0 2px 9px #2976fd13",
              cursor: "pointer"
            }}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 22, textAlign: "center", fontSize: "1rem" }}>
          {isSignup ? (
            <>Already registered?{" "}
              <span
                style={{
                  color: "#2976fd",
                  marginLeft: 6,
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
                onClick={() => setIsSignup(false)}
              >Login here</span>
            </>
          ) : (
            <>Not registered?{" "}
              <span
                style={{
                  color: "#2976fd",
                  marginLeft: 6,
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
                onClick={() => setIsSignup(true)}
              >Sign up here</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 7,
  border: "1.5px solid #b7d3fb",
  fontSize: "1.07rem",
  marginBottom: "12px",
  background: "#f8fdff",
  boxSizing: "border-box"
};

export default AuthPage;
