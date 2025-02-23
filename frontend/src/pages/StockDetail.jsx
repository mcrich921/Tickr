import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // Assuming you have an API helper

const StockDetail = () => {
  const { ticker } = useParams(); // Get ticker from URL
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="stock-detail">
      <h1>
        {stock.name} ({stock.ticker})
      </h1>
      <p>Price: ${stock.price}</p>
    </div>
  );
};

export default StockDetail;
