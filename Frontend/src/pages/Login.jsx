import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "admin@test.com" && password === "admin123") {
        localStorage.setItem("token", "mock-token-admin");
        localStorage.setItem("role", "ADMIN");
        navigate("/dashboard");
      } else if (email === "receiver@test.com" && password === "receiver123") {
        localStorage.setItem("token", "mock-token-receiver");
        localStorage.setItem("role", "RECEIVER");
        navigate("/dashboard");
      } else if (
        email === "procurement@test.com" &&
        password === "procurement123"
      ) {
        localStorage.setItem("token", "mock-token-procurement");
        localStorage.setItem("role", "PROCUREMENT");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ProcureX</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    margin: 0,
    color: "#666",
    textAlign: "center",
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fdecea",
    color: "#c62828",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    border: "1px solid #f5c6c6",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default Login;
