import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/StockSearch.css";

function StockSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/stocks/${searchQuery}/`);
      // If stock exists, navigate to the StockDetail page
      navigate(`/stocks/${response.data.ticker}`);
    } catch (error) {
      setError("Stock not found");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    setError(null);
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="stock-search-container">
      <input
        type="text"
        placeholder="Search for a stock..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}

export default StockSearch;
