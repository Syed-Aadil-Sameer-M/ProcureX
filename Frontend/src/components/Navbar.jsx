import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <span style={styles.logo}>ProcureX</span>
      <div style={styles.links}>
        <span style={styles.link}>Dashboard</span>
        <span style={styles.link}>Requests</span>
        <span style={styles.link}>Inventory</span>
        <span style={styles.link}>Logs</span>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    height: "60px",
    backgroundColor: "#1a73e8",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    cursor: "pointer",
    fontSize: "14px",
  },
  logout: {
    padding: "6px 14px",
    backgroundColor: "white",
    color: "#1a73e8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Navbar;
