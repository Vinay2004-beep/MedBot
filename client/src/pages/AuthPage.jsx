import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
    setName(''); setAge(''); setWeight(''); setHeight(''); setPhone('');
    setAllergies(''); setMedications(''); setChronicConditions('');
    setEmail(''); setPassword(''); setConfirmPassword('');
  };

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
        name,
        age,
        weight,
        height,
        phone,
        allergies,
        medications,
        chronicConditions,
        email
      });
      clearSignupFields();
      setSuccessMsg("Successfully registered! You may login now.");
      setIsSignup(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    setSuccessMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('user', email);
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "350px",
    padding: "10px 12px",
    borderRadius: 7,
    border: "1px solid #b7b7b7",
    fontSize: "1.07rem",
    marginBottom: "12px",
    background: "#f8fdff"
  };

  const buttonStyle = {
    width: "100%",
    maxWidth: "350px",
    background: "#2976fd",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginTop: "14px",
    cursor: "pointer"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fd", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 24px #2974fd25",
          padding: "32px 25px",
          width: "100%",
          maxWidth: "390px",
        }}>
          <h2 style={{ marginBottom: 10, color: "#2976fd", fontWeight: "bold", textAlign: "left" }}>
            {isSignup ? "Sign Up" : "Login"}
          </h2>
          <div style={{ margin: "0 0 16px 0", fontWeight: "bold", color: "#3b87ea", fontSize: "1.02rem" }}>
            Your health, just a tap away
          </div>

          {successMsg && !isSignup && (
            <div style={{
              backgroundColor: "#eafbe5",
              color: "#25b031",
              padding: 10,
              borderRadius: 6,
              marginBottom: 16,
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {successMsg}
            </div>
          )}

          <form
            onSubmit={e => { e.preventDefault(); isSignup ? handleSignup() : handleLogin(); }}
            autoComplete="off"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inputStyle} required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={inputStyle} required />

            {isSignup && (
              <>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" style={inputStyle} required />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={inputStyle} required />
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" style={inputStyle} required />
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight (kg)" style={inputStyle} required />
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height (cm)" style={inputStyle} required />
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number (optional)" style={inputStyle} />
                <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Any Allergies" style={inputStyle} required />
                <input type="text" value={medications} onChange={e => setMedications(e.target.value)} placeholder="Current Medication (e.g. sugar, BP, etc.)" style={inputStyle} required />
                <input type="text" value={chronicConditions} onChange={e => setChronicConditions(e.target.value)} placeholder="Chronic Conditions (e.g. diabetes, heart, kidney, etc.)" style={inputStyle} required />
              </>
            )}

            <button type="submit" style={buttonStyle}>{isSignup ? "Sign Up" : "Login"}</button>
          </form>

          <div style={{ fontSize: "1rem", margin: "18px 0 0 0", textAlign: "center" }}>
            {isSignup ? (
              <>Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError("");
                    setSuccessMsg("");
                  }}
                  style={{
                    color: "#2976fd",
                    marginLeft: 6,
                    textDecoration: "underline",
                    fontWeight: "bold",
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer"
                  }}>
                  Login here
                </button>
              </>
            ) : (
              <>Not registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError("");
                    setSuccessMsg("");
                  }}
                  style={{
                    color: "#2976fd",
                    marginLeft: 6,
                    textDecoration: "underline",
                    fontWeight: "bold",
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer"
                  }}>
                  Sign up here
                </button>
              </>
            )}
          </div>

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
