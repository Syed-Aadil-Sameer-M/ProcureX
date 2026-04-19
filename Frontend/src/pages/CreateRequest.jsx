import { useState } from "react";

function CreateRequest() {
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!material || !quantity || !location) {
      alert("Please fill in all required fields");
      return;
    }

    // Just log for now — API connection comes on Day 9
    console.log("Request data:", { material, quantity, location, reason });
    setSubmitted(true);
  };

  const handleReset = () => {
    setMaterial("");
    setQuantity("");
    setLocation("");
    setReason("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h3 style={styles.successTitle}>Request Submitted</h3>
          <p style={styles.successText}>
            Your request for <strong>{material}</strong> (Qty: {quantity}) has
            been recorded.
          </p>
          <button style={styles.button} onClick={handleReset}>
            Create Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Material Request</h2>
        <p style={styles.subtitle}>
          Fill in the details below to raise a new request
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Material Name *</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. CCTV Camera, Cable Wire"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Quantity *</label>
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 10"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Target Location *</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Site A, Warehouse B"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reason / Notes</label>
          <textarea
            style={styles.textarea}
            placeholder="Optional: why is this material needed?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          Submit Request
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 60px)",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    height: "fit-content",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
  },
  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#666",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  successIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "#e6f4ea",
    color: "#2e7d32",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  successTitle: {
    textAlign: "center",
    margin: 0,
    fontSize: "18px",
  },
  successText: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    margin: 0,
  },
};

export default CreateRequest;
