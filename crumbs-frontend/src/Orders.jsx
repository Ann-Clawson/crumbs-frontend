/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export function Orders({ orders }) {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const orderRows = orders.map((order, index) => ({
    id: index,
    firstName: `${order.customer_first_name}`,
    lastName: `${order.customer_last_name}`,
    orderStatus: order.order_status,
    paymentStatus: order.payment_status,
    totalCost: `$${order.total_cost.toFixed(2)}`,
    orderId: order.id,
  }));

  const orderColumns = [
    { field: "firstName", headerName: "First Name", width: 125 },
    { field: "lastName", headerName: "Last  Name", width: 125 },
    { field: "orderStatus", headerName: "Order Status", width: 180 },
    { field: "paymentStatus", headerName: "Payment Status", width: 180 },
    { field: "totalCost", headerName: "Total", width: 130 },
    {
      field: "viewDetails",
      headerName: "View Details",
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenOrderDetails(params.row.orderId)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleOpenOrderDetails = (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setPaymentStatus(order.payment_status);
      setOrderDetailsOpen(true);
    }
  };

  // useEffect(() => {
  //   if (selectedOrder) {
  //     console.log("Selected Order:", selectedOrder);
  //   }
  // }, [selectedOrder]);

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handlePaymentStatusChange = (event) => {
    const newValue = event.target.value;
    setPaymentStatus(newValue);

    if (selectedOrder) {
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        payment_status: newValue,
      }));
    }

    // console.log("Payment Status Changed to:", newValue);
  };

  // useEffect(() => {
  //   console.log("Updated Payment Status:", paymentStatus);
  //   console.log(selectedOrder);
  // }, [paymentStatus, selectedOrder]);

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    // console.log(selectedOrder);
    // console.log(selectedOrder.payment_status);
    try {
      const response = await axios.patch(
        `http://localhost:5000/orders/${selectedOrder.id}`,
        { payment_status: selectedOrder.payment_status },
        { withCredentials: true }
      );
      // console.log(response.data);
      setSelectedOrder(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "40vh",
        maxHeight: "40vh",
        backgroundColor: "white",
        opacity: 0.9,
        margin: 0,
        borderRadius: "10px",
        overflow: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="current-inventory">Orders</h2>
        <Button
          sx={{
            margin: "10px",
            visibility: "hidden",
          }}
          variant="contained"
          color="primary"
        >
          Add Cookies
        </Button>
      </div>
      <DataGrid
        rows={orderRows}
        columns={orderColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        sx={{
          "& .MuiDataGrid-root": {
            borderRadius: "0px",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "white",
            opacity: 0.9,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
        }}
      />

      {/* Dialog to show order details */}
      {selectedOrder && (
        <Dialog open={orderDetailsOpen} onClose={handleCloseOrderDetails}>
          <DialogTitle>
            Order Details for{" "}
            <strong>
              {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}
            </strong>
          </DialogTitle>
          <DialogContent>
            <h4>Order Status: {selectedOrder.order_status}</h4>
            {isEditing ? (
              <>
                <h4>Payment Status:</h4>
                <Select value={paymentStatus} onChange={handlePaymentStatusChange} fullWidth>
                  <MenuItem value="Unconfirmed">Unconfirmed</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                  <MenuItem value="Incomplete">Incomplete</MenuItem>
                  <MenuItem value="Invalid">Invalid</MenuItem>
                </Select>
              </>
            ) : (
              <h4>Payment Status: {selectedOrder.payment_status}</h4>
            )}
            <h4>Delivery Status: {selectedOrder.delivery_status}</h4>
            <h4>Total Cost: ${selectedOrder.total_cost.toFixed(2)}</h4>
            <h4>Payment Method: {selectedOrder.payment_type}</h4>
            <h4>Order Cookies:</h4>
            <ul>
              {selectedOrder.order_cookies.map((cookie, index) => (
                <li key={index}>
                  {cookie.cookie_name} - Quantity: {cookie.quantity}, Price: ${cookie.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <Button onClick={handleSaveChanges} color="primary">
                Save Changes
              </Button>
            ) : (
              <Button onClick={handleEditClick} color="primary">
                Edit Order
              </Button>
            )}
            <Button onClick={handleCloseOrderDetails} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
