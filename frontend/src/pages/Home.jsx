import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StockSearch from "../components/StockSearch";
import api from "../api"; // Assuming you have an API helper

function Home() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/profile/"); // Update to your profile endpoint
        setUserProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch user profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <StockSearch />
      <div className="user-info">
        <h1>Welcome, {userProfile.username}!</h1>
        <p>Balance: ${userProfile.balance}</p>
      </div>
      <Link to="/logout">Logout</Link>
    </div>
  );
}

export default Home;
