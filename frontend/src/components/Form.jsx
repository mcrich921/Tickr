import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter a username and password.");
      setLoading(false);
      return;
    }

    try {
      // register before logging in
      if (method === "register") {
        await api.post(route, { username, password });
      }

      const res = await api.post("/api/token/", { username, password });

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{method === "login" ? "Login" : "Register"}</h1>
      {/* Error message */}
      {error && <p className="error-message">{error}</p>}
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {method === "login" ? (
        <Link className="alternate" to="/register">
          Don't have an account? Create one here
        </Link>
      ) : (
        <Link className="alternate" to="/login">
          Already have an account? Sign in here
        </Link>
      )}
      <button className="form-button" type="submit">
        {method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
