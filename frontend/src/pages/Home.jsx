import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StockSearch from "../components/StockSearch";
import TransactionHistory from "../components/TransactionHistory";
import api from "../api"; // Assuming you have an API helper

function Home() {
  const [userProfile, setUserProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
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

  // Fetch portfolio after user profile is fetched
  useEffect(() => {
    const fetchUserPortfolio = async () => {
      if (userProfile) {
        try {
          const response = await api.get("/api/profile/portfolio/");
          setPortfolio(response.data);
        } catch (err) {
          setError("Could not fetch portfolio");
        }
      }
    };

    fetchUserPortfolio();
  }, [userProfile]);

  // Check portfolio - for debugging
  // useEffect(() => {
  //   console.log(userProfile);
  // }, [userProfile]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <div className="user-info">
        <h1>Welcome, {userProfile.username}!</h1>
        <p>Balance: ${userProfile.balance}</p>
      </div>

      <h2>Your Portfolio</h2>
      <ul>
        {portfolio.length > 0 ? (
          portfolio.map((stock) => (
            <li key={stock.id}>
              {stock.stock_name} - {stock.quantity} shares @ $
              {stock.purchase_price}
            </li>
          ))
        ) : (
          <p>No stocks owned.</p>
        )}
      </ul>

      <StockSearch />
      <TransactionHistory userProfile={userProfile} />
      <Link to="/logout">Logout</Link>
    </div>
  );
}

export default Home;
