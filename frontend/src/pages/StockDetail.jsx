import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api"; // Assuming you have an API helper
import "../styles/StockDetail.css";

const StockDetail = () => {
  const { ticker } = useParams(); // Get ticker from URL
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyError, setBuyError] = useState(null);
  const [sellError, setSellError] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await api.get(`/api/stocks/${ticker}/`);
        setStock(response.data);
        setLoading(false);
      } catch (err) {
        setBuyError("Could not fetch stock details");
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [ticker]);

  const handleBuyStock = async (e) => {
    e.preventDefault();
    setBuyError(null);
    // Implement buy stock logic here
    try {
      const response = await api.post("/api/buy/", {
        stock_id: stock.id,
        quantity: buyQuantity,
      });

      if (response.status === 201) {
        alert("Stock purchased successfully!");
      }
    } catch (error) {
      setBuyError("Error purchasing stock");
    }
  };

  const handleSellStock = async (e) => {
    e.preventDefault();
    setBuyError(null);
    // Implement buy stock logic here
    try {
      const response = await api.post("/api/sell/", {
        stock_id: stock.id,
        quantity: sellQuantity,
      });

      if (response.status === 201) {
        alert("Stock sold successfully!");
      }
    } catch (error) {
      setSellError("Error selling stock");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Link to="/">Home</Link>
      <div className="stock-detail">
        <h1>
          {stock.name} ({stock.ticker})
        </h1>
        <p>Price: ${stock.price}</p>
        {buyError && <p className="error">Insufficient balance</p>}
        {sellError && <p className="error">Not enough stocks</p>}
        <div id="buttons">
          <form onSubmit={handleBuyStock}>
            <input
              type="number"
              id="quantity"
              min="1"
              value={buyQuantity}
              onChange={(e) => setBuyQuantity(e.target.value)}
              required
              placeholder="Enter quantity..."
            />

            <button type="submit">Buy Stock</button>
          </form>
          <form onSubmit={handleSellStock}>
            <input
              type="number"
              id="quantity"
              min="1"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(e.target.value)}
              required
              placeholder="Enter quantity..."
            />

            <button type="submit" id="sell-button">
              Sell Stock
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StockDetail;
