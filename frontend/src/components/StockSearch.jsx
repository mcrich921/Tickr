import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/StockSearch.css";

function StockSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/stocks/${searchQuery}/`);
      setStockData(response.data);
      // If stock exists, navigate to the StockDetail page
      navigate(`/stocks/${response.data.ticker}`);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setStockData(null); // If no stock found, set to null
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-search-container">
      <input
        type="text"
        placeholder="Search for a stock..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
    </div>
  );
}

export default StockSearch;
