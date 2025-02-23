import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // Assuming you have an API helper
import "../styles/StockDetail.css";

const StockDetail = () => {
  const { ticker } = useParams(); // Get ticker from URL
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(null); // Default quantity is 1

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await api.get(`/api/stocks/${ticker}/`);
        setStock(response.data);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch stock details");
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [ticker]);

  const handleBuyStock = async (e) => {
    e.preventDefault();
    setError(null);
    // Implement buy stock logic here
    try {
      const response = await api.post("/api/buy/", {
        stock_id: stock.id,
        quantity: quantity,
      });

      if (response.status === 201) {
        alert("Stock purchased successfully!");
      }
    } catch (error) {
      setError("Error purchasing stock");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="stock-detail">
      <h1>
        {stock.name} ({stock.ticker})
      </h1>
      <p>Price: ${stock.price}</p>
      {error && <p className="error">Insufficient balance</p>}
      <form onSubmit={handleBuyStock}>
        <label htmlFor="quantity">Quantity: </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          placeholder="Enter quantity..."
        />

        <button type="submit">Buy Stock</button>
      </form>
    </div>
  );
};

export default StockDetail;
