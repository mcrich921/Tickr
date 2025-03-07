import React, { useState, useEffect } from "react";
import api from "../api"; // Ensure correct import

function TransactionHistory({ userProfile }) {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (userProfile) {
        // Ensure userProfile exists and has an ID
        try {
          const response = await api.get(`/api/transactions/`);
          setTransactionHistory(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Could not fetch transactions.");
          setLoading(false);
        }
      }
    };

    fetchUserTransactions();
  }, [userProfile]);

  useEffect(() => {
    console.log(transactionHistory);
  }, [transactionHistory]);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Transaction History</h2>
      {transactionHistory.length > 0 ? (
        <ul>
          {transactionHistory.map((tx, index) => {
            const formattedDate = new Date(tx.timestamp).toLocaleString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true, // Ensures AM/PM format
              }
            );

            return (
              <li key={index}>
                {tx.stock_ticker} ({tx.stock_name}) - {tx.transaction_type}{" "}
                {tx.quantity} shares @ ${tx.price} <br />
                <small>{formattedDate}</small>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default TransactionHistory;
