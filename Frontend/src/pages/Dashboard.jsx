import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div style={styles.content}>
        <h2>Welcome to ProcureX</h2>
        <p style={styles.subtitle}>
          Select a module from the navbar to get started.
        </p>

        <div style={styles.cardGrid}>
          <div
            style={styles.moduleCard}
            onClick={() => navigate("/create-request")}
          >
            <div style={styles.cardIcon}>📋</div>
            <h3 style={styles.cardTitle}>Create Request</h3>
            <p style={styles.cardDesc}>Raise a new material request</p>
          </div>

          <div style={styles.moduleCard}>
            <div style={styles.cardIcon}>📦</div>
            <h3 style={styles.cardTitle}>Inventory</h3>
            <p style={styles.cardDesc}>View current stock levels</p>
          </div>

          <div style={styles.moduleCard}>
            <div style={styles.cardIcon}>📜</div>
            <h3 style={styles.cardTitle}>Audit Logs</h3>
            <p style={styles.cardDesc}>Track all system activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 60px)",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "2rem",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    maxWidth: "700px",
  },
  moduleCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #eee",
    transition: "box-shadow 0.2s",
  },
  cardIcon: {
    fontSize: "28px",
    marginBottom: "0.75rem",
  },
  cardTitle: {
    margin: "0 0 6px",
    fontSize: "15px",
    fontWeight: "600",
  },
  cardDesc: {
    margin: 0,
    fontSize: "13px",
    color: "#666",
  },
};

export default Dashboard;
