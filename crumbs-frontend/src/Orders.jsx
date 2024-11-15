/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export function Orders({ orders, updateOrder, fetchUserInventory, inventory }) {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [orderCookies, setOrderCookies] = useState([]);
  const [editingCookieId, setEditingCookieId] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

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
    { field: "orderStatus", headerName: "Order Status", width: 150 },
    // { field: "paymentStatus", headerName: "Payment Status", width: 180 },
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
      setDeliveryStatus(order.delivery_status);
      setPaymentType(order.payment_type);
      setOrderCookies(order.order_cookies);

      const initialTotalCost = order.order_cookies.reduce((total, cookie) => total + cookie.quantity * 6, 0);
      setTotalCost(initialTotalCost);

      setOrderDetailsOpen(true);
    }
  };

  // useEffect(() => {
  //   console.log("order cookies:", orderCookies);
  // }, [orderCookies]);

  // useEffect(() => {
  //   if (selectedOrder) {
  //     console.log("Selected Order:", selectedOrder);
  //   }
  // }, [selectedOrder]);

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
    setIsEditing(false);
    setEditingCookieId(null);
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

  const handlePaymentTypeChange = (event) => {
    const newValue = event.target.value;
    setPaymentType(newValue);

    if (selectedOrder) {
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        payment_type_name: newValue,
      }));
    }
  };

  const handleDeliveryStatusChange = (event) => {
    const newValue = event.target.value;
    setDeliveryStatus(newValue);

    if (selectedOrder) {
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        delivery_status: newValue,
      }));
    }

    console.log("Delivery Status Changed to:", newValue);
  };

  const handleEditQuantity = (cookieId) => {
    setEditingCookieId(cookieId);
  };

  const handleQuantityChange = (cookieId, newValue) => {
    // console.log(newValue);
    // setOrderCookies((prevOrderCookies) =>
    //   prevOrderCookies.map((cookie) =>
    //     cookie.cookie_id === cookieId ? { ...cookie, quantity: parseInt(newValue) || 0 } : cookie
    //   )
    // );

    const quantity = parseInt(newValue) || 0;

    // Update the orderCookies state
    setOrderCookies((prevOrderCookies) =>
      prevOrderCookies.map((cookie) => (cookie.cookie_id === cookieId ? { ...cookie, quantity } : cookie))
    );

    // Update the total cost based on the new quantity
    setTotalCost((prevTotalCost) => {
      const cookie = orderCookies.find((cookie) => cookie.cookie_id === cookieId);
      if (cookie) {
        const oldQuantity = cookie.quantity;
        const difference = quantity - oldQuantity;
        return prevTotalCost + difference * 6;
      }
      return prevTotalCost;
    });
  };

  const handleSaveQuantity = async (cookieId) => {
    const cookieToUpdate = orderCookies.find((cookie) => cookie.cookie_id === cookieId);
    if (!cookieToUpdate) return;

    try {
      const response = await axios.patch(
        `http://localhost:5000/order_cookies/${selectedOrder.id}/${cookieId}`,
        { quantity: cookieToUpdate.quantity },
        { withCredentials: true }
      );

      setOrderCookies((prevOrderCookies) =>
        prevOrderCookies.map((cookie) => (cookie.cookie_id === cookieId ? { ...cookie, ...response.data } : cookie))
      );

      // console.log(orderCookies);
      // console.log(selectedOrder);

      fetchUserInventory();

      const updatedOrderResponse = await axios.get(`http://localhost:5000/orders/${selectedOrder.id}`, {
        withCredentials: true,
      });

      const updatedOrder = updatedOrderResponse.data;

      console.log(updatedOrderResponse.data);

      if (typeof updateOrder === "function") {
        updateOrder(updatedOrder);
      }

      setEditingCookieId(null);
    } catch (error) {
      console.error("Failed to update cookie quantity:", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;

    // order cannot be saved if actual inventory would become negative
    const negativeInventory = orderCookies.some((orderCookie) => {
      const cookieInventoryData = inventory[orderCookie.cookie_name];
      if (!cookieInventoryData) {
        return true;
      }
      const newInventory = cookieInventoryData.inventory - orderCookie.quantity;
      return newInventory < 0;
    });

    if (negativeInventory) {
      console.error("Cannot save changes: One or more cookies would have negative inventory.");
      alert("Cannot save changes: One or more cookies would have negative inventory.");
      return;
    }

    console.log(selectedOrder);

    // change order status to complete if payment and delivery status are finalized values
    let orderStatus = selectedOrder.order_status;
    if (
      selectedOrder.payment_status === "Complete" &&
      selectedOrder.delivery_status !== "Not Sent" &&
      selectedOrder.delivery_status !== "Delayed"
    ) {
      orderStatus = "Complete";
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/orders/${selectedOrder.id}`,
        {
          payment_status: selectedOrder.payment_status,
          delivery_status: selectedOrder.delivery_status,
          payment_type_name: selectedOrder.payment_type_name,
          order_status: orderStatus,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setSelectedOrder(response.data);
      // fetchUserInventory();
      setIsEditing(false);

      if (typeof updateOrder === "function") {
        updateOrder(response.data);
      }

      setOrderDetailsOpen(false);
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
                <h4>Payment Method:</h4>
                <Select value={paymentType} onChange={handlePaymentTypeChange} fullWidth>
                  <MenuItem value={"Unspecified"}>Unspecified</MenuItem>
                  <MenuItem value={"Cash"}>Cash</MenuItem>
                  <MenuItem value={"Credit"}>Credit</MenuItem>
                  <MenuItem value={"Venmo"}>Venmo</MenuItem>
                  <MenuItem value={"PayPal"}>PayPal</MenuItem>
                </Select>
                <h4>Delivery Status:</h4>
                <Select value={deliveryStatus} onChange={handleDeliveryStatusChange} fullWidth>
                  <MenuItem value="Not Sent">Not Sent</MenuItem>
                  <MenuItem value="Mailed">Mailed</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Delayed">Delayed</MenuItem>
                  <MenuItem value="Picked Up">Picked Up</MenuItem>
                </Select>
              </>
            ) : (
              <>
                <h4>Payment Status: {selectedOrder.payment_status}</h4>
                <h4>Payment Method: {selectedOrder.payment_type}</h4>
                <h4>Delivery Status: {selectedOrder.delivery_status}</h4>
              </>
            )}
            <h4>Order Cookies:</h4>
            <ul>
              {orderCookies.map((cookie) => (
                <li key={cookie.cookie_id}>
                  {cookie.cookie_name} - Quantity:{" "}
                  {editingCookieId === cookie.cookie_id ? (
                    <input
                      type="number"
                      value={cookie.quantity}
                      onChange={(e) => handleQuantityChange(cookie.cookie_id, e.target.value)}
                      style={{ width: "50px", marginLeft: "10px", marginRight: "10px" }}
                    />
                  ) : (
                    <span>{cookie.quantity}</span>
                  )}
                  , Price: ${cookie.price.toFixed(2)}
                  {editingCookieId === cookie.cookie_id ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleSaveQuantity(cookie.cookie_id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditQuantity(cookie.cookie_id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit Qty
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            <h4>Total Cost: ${totalCost.toFixed(2)}</h4>
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
