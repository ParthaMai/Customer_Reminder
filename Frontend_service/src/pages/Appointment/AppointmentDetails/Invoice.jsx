import React from "react";
import "./Invoice.css";
import { useContext } from "react";
import { StoreContext } from "../../../context/StoreContext";

const Invoice = ({ customerInfo, items }) => {

  const { user} = useContext(StoreContext);
  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="invoice-container">
      {/* --- HEADER --- */}
      <div className="invoice-header">
        <h1>{user?.storeName}</h1>
        <p className="invoice-subtitle">Invoice / Bill of Supply</p>
      </div>

      <hr className="divider" />

      {/* --- CUSTOMER & INVOICE DETAILS --- */}
      <div className="invoice-details-row">
        {/* Left Side: Bill To */}
        <div className="info-box left-box">
          <h3>Bill To:</h3>
          <p><strong>Customer Name:</strong> {customerInfo.name}</p>
          <p><strong>Address:</strong> {customerInfo.address || "N/A"}</p>
          <p><strong>Contact No:</strong> {customerInfo.contact || "N/A"}</p>
        </div>

        {/* Right Side: Invoice Details */}
        <div className="info-box right-box">
          <h3>Invoice Details:</h3>
          <p><strong>Invoice No:</strong>{user?.billPasscode}{user?.totalBill}</p>
          <p><strong>Date:</strong> {customerInfo.serviceDate || "N/A"}</p>
          <p><strong>Shop Contact No:</strong> {user?.mobile}</p>
        </div>
      </div>

      {/* --- ITEMS TABLE --- */}
      <div className="invoice-table-wrapper">
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th className="col-sno">#</th>
              <th className="col-desc">Service / Parts Description</th>
              <th className="col-price">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="col-sno">{index + 1}</td>
                <td className="col-desc">{item.name}</td>
                <td className="col-price">₹{Number(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="total-label">Grand Total</td>
              <td className="total-amount">₹{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* --- FOOTER --- */}
      <div className="invoice-footer">
        <p><strong>Thank you for choosing our Service!</strong></p>
        <p className="small-text">This is a computer-generated invoice and does not require a physical signature.</p>
      </div>
    </div>
  );
};

export default Invoice;