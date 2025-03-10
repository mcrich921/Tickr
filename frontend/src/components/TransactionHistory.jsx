import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/TransactionHistory.css";

function TransactionHistory({ userProfile }) {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // For sorting transactions
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }

    setSortConfig({ key: key, direction: direction });
  };

  // sort transactions by parameters, rerenders whenever sortConfig updated
  const sortedTransactions = [...transactionHistory].sort((a, b) => {
    // Get keys at places a & b
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "timestamp") {
      // turn values into date objects
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (typeof aVal == "string") {
      // turn values to lowercase for case-insensitive sorting
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    // Compare values and return proper value for asc or desc
    if (aVal < bVal) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (bVal < aVal) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0; // Return 0 if equal
  });

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

  const currentTransactions = sortedTransactions.slice(
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
                <th
                  onClick={() => {
                    handleSort("stock_name");
                  }}
                >
                  Stock
                  {sortConfig.key === "stock_name" && (
                    <img
                      src={`/src/assets/sort_asc_transparent.png`}
                      alt="Sort"
                      className={`sort-icon ${sortConfig.direction}`}
                    />
                  )}
                </th>
                <th
                  onClick={() => {
                    handleSort("transaction_type");
                  }}
                >
                  Type
                  {sortConfig.key === "transaction_type" && (
                    <img
                      src={`/src/assets/sort_asc_transparent.png`}
                      alt="Sort"
                      className={`sort-icon ${sortConfig.direction}`}
                    />
                  )}
                </th>
                <th
                  onClick={() => {
                    handleSort("quantity");
                  }}
                >
                  Quantity
                  {sortConfig.key === "quantity" && (
                    <img
                      src={`/src/assets/sort_asc_transparent.png`}
                      alt="Sort"
                      className={`sort-icon ${sortConfig.direction}`}
                    />
                  )}
                </th>
                <th
                  onClick={() => {
                    handleSort("price");
                  }}
                >
                  Price
                  {sortConfig.key === "price" && (
                    <img
                      src={`/src/assets/sort_asc_transparent.png`}
                      alt="Sort"
                      className={`sort-icon ${sortConfig.direction}`}
                    />
                  )}
                </th>
                <th
                  onClick={() => {
                    handleSort("timestamp");
                  }}
                >
                  Date
                  {sortConfig.key === "timestamp" && (
                    <img
                      src={`/src/assets/sort_asc_transparent.png`}
                      alt="Sort"
                      className={`sort-icon ${sortConfig.direction}`}
                    />
                  )}
                </th>
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
