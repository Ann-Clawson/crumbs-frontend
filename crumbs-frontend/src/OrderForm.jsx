// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";

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
        { withCredentials: true } // Include credentials for authentication
      );

      const data = response.data;

      if (data.status === "success") {
        alert(data.message);
        setCustomerId(data.customer_id || ""); // Update customerId if it's returned
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
      <h3>Create Customer</h3>
      <div>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required={!customerId} />
        </label>
      </div>
      <div>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required={!customerId} />
        </label>
      </div>
      <div>
        <label>
          Email (Optional):
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <button type="button" onClick={createCustomer} disabled={!!customerId}>
        {customerId ? "Customer Created" : "Create Customer"}
      </button>

      <h3>Create or Update Order</h3>
      <div>
        <label>
          Payment Type:
          <select value={paymentTypeName} onChange={(e) => setPaymentTypeName(e.target.value)}>
            <option value="Unspecified">Unspecified</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="Venmo">Venmo</option>
            <option value="PayPal">PayPal</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for the order here..."
          />
        </label>
      </div>
      <button type="submit">{orderId ? "Update Order" : "Create Order"}</button>
    </form>
  );
}
