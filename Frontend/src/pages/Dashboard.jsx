import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div style={styles.content}>
        <h2>Welcome to ProcureX</h2>
        <p style={{ color: "#666" }}>
          Select a module from the navbar to get started.
        </p>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: "2rem",
  },
};

export default Dashboard;
