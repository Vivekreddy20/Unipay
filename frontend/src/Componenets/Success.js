import React from 'react';
import { useLocation } from 'react-router-dom';

const handlePrint = () => {
    window.print();
  };

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Extract transaction details from query parameters
  const transactionId = queryParams.get('transactionId');
  const razorpayOrderId = queryParams.get('razorpayOrderId');
  const feeType = queryParams.get('feeType');
  const feeYear = queryParams.get('feeYear');
  const feeSem = queryParams.get('feeSem');
  const roll = queryParams.get('roll');
  const name = queryParams.get('name');
  const phone = queryParams.get('phone');
  const amount = queryParams.get('amount');
  const date = queryParams.get('date');
  const time = queryParams.get('time');
  console.log(feeSem)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payment Successful!</h1>
      <p>Thank you, <b> {name}! </b> Your payment was processed successfully.</p>
      <div style={styles.details}>
        <p><strong>Transaction ID:</strong> {transactionId}</p>
        <p><strong>Order ID:</strong> {razorpayOrderId}</p>
        <p><strong>Amount Paid:</strong> ₹{amount}</p>
        <p><strong>Date :</strong> {date} {time}</p>
        <p><strong>Fee Type:</strong> {feeType}</p>
        <p><strong>Academic Year:</strong> {feeYear}</p>
        {feeSem && <p><strong>Semester:</strong> {feeSem}</p>}
        <p><strong>Roll Number:</strong> {roll}</p>
        <p><strong>Contact:</strong> {phone}</p>
        <button style={styles.printButton} onClick={handlePrint}>Print Receipt</button>
      </div>
    </div>
  );
};

const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
    },
    title: {
      color: '#4CAF50',
    },
    details: {
      marginTop: '20px',
      textAlign: 'left',
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '8px',
    },
    printButton: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  };
  
  // Print-specific CSS to hide elements during printing
  const printStyles = `
    @media print {
      button {
        display: none;
      }
    }
  `;
  
  // Inject print-specific styles into the document
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = printStyles;
  document.head.appendChild(styleSheet);
  
  export default Success;