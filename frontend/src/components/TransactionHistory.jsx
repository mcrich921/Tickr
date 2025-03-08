import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/TransactionHistory.css";

function TransactionHistory({ userProfile }) {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (userProfile) {
        try {
          const response = await api.get("/api/transactions/");
          // Sort transactions by date in descending order (newest first)
          const sortedTransactions = response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setTransactionHistory(sortedTransactions);
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

  // Get the transactions for the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactionHistory.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Pagination controls
  const totalPages = Math.ceil(transactionHistory.length / transactionsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="transaction-container">
      <h2>Transaction History</h2>
      {transactionHistory.length > 0 ? (
        <>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((tx, index) => {
                const formattedDate = new Date(tx.timestamp).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  }
                );

                return (
                  <tr
                    key={index}
                    className={tx.transaction_type === "BUY" ? "buy" : "sell"}
                  >
                    <td>
                      {tx.stock_ticker} ({tx.stock_name})
                    </td>
                    <td>{tx.transaction_type}</td>
                    <td>{tx.quantity}</td>
                    <td>${tx.price}</td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              ← Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}

export default TransactionHistory;
