// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { Button, Select, MenuItem, TextField } from "@mui/material";

// eslint-disable-next-line react/prop-types
export function OrderForm({ onSubmit, orderId, setOrderId }) {
  const [customerId, setCustomerId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentTypeName, setPaymentTypeName] = useState("Unspecified");
  const [notes, setNotes] = useState("");

  const createCustomer = async () => {
    if (!firstName || !lastName) {
      alert("Please provide both first and last names for the customer.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/customers/",
        {
          first_name: firstName,
          last_name: lastName,
          email: email ? email.trim().toLowerCase() : undefined,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.status === "success") {
        alert(data.message);
        setCustomerId(data.customer_id || "");
      } else {
        console.error("Error creating customer:", data.message);
        alert(data.message || "Failed to create customer.");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("An error occurred while creating the customer.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      alert("Customer ID is required. Please create a customer first.");
      return;
    }

    const endpoint = orderId ? `http://localhost:5000/orders/${orderId}` : "http://localhost:5000/orders";

    const method = orderId ? "PATCH" : "POST";
    const payload = {
      customer_id: customerId,
      payment_type_name: paymentTypeName,
      notes,
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (!orderId) setOrderId(data.id);
        onSubmit(data);
      } else {
        console.error("Error:", data.message);
        alert(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the order.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>1. Create Customer</h3>
      <div>
        <h4>First Name:</h4>
        <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} required={!customerId} />
      </div>
      <div>
        <h4>Last Name:</h4>
        <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} required={!customerId} />
      </div>
      <div>
        <h4>Email (Optional):</h4>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={createCustomer}
        disabled={!!customerId}
        sx={{
          marginTop: "10px",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        {customerId ? "Customer Created" : "Create Customer"}
      </Button>

      <h3>2. Create Order</h3>
      <div>
        <h4>Payment Type:</h4>
        <Select value={paymentTypeName} onChange={(e) => setPaymentTypeName(e.target.value)}>
          <MenuItem value="Unspecified">Unspecified</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Credit">Credit</MenuItem>
          <MenuItem value="Venmo">Venmo</MenuItem>
          <MenuItem value="PayPal">PayPal</MenuItem>
        </Select>
      </div>
      <div>
        <h4>Notes:</h4>
        <TextField value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: "10px",
        }}
      >
        {orderId ? "Update Order" : "Create Order"}
      </Button>
    </form>
  );
}
