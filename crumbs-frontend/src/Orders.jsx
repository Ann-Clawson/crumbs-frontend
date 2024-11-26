/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
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
  const [notes, setNotes] = useState("");
  const [originalQuantities, setOriginalQuantities] = useState({});
  const [originalTotalCost, setOriginalTotalCost] = useState(0);
  const [availableCookies, setAvailableCookies] = useState([]);
  const [selectedCookieToAdd, setSelectedCookieToAdd] = useState(null);

  // define the dashboard
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

  const handleOpenOrderDetails = async (orderId) => {
    const order = orders.find((order) => order.id === orderId);
    if (order) {
      const filteredOrderCookies = order.order_cookies.filter((cookie) => cookie.quantity > 0);

      setSelectedOrder(order);
      setPaymentStatus(order.payment_status);
      setDeliveryStatus(order.delivery_status);
      setPaymentType(order.payment_type);
      setOrderCookies(filteredOrderCookies);

      // save original quantities for reverting changes if needed
      const quantities = {};
      filteredOrderCookies.forEach((cookie) => {
        quantities[cookie.cookie_id] = cookie.quantity;
      });
      setOriginalQuantities(quantities);

      const initialTotalCost = filteredOrderCookies.reduce((total, cookie) => total + cookie.quantity * 6, 0);
      setTotalCost(initialTotalCost);
      setOriginalTotalCost(initialTotalCost);

      try {
        const allCookiesResponse = await axios.get(`http://localhost:5000/cookies`, { withCredentials: true });
        // console.log("All Cookies Full Response:", allCookiesResponse);

        const allCookies = allCookiesResponse.data.cookies;

        // console.log("Filtered Order Cookies:", filteredOrderCookies);
        // console.log("All Cookies:", allCookies);

        // filter out cookies that are already in the current order
        const filteredAvailableCookies = allCookies.filter((cookie) => {
          const isAlreadyInOrder = filteredOrderCookies.some((orderCookie) => orderCookie.cookie_id === cookie.id);

          // Log the comparison details
          // console.log(`Checking if "${cookie.name}" (cookie id: ${cookie.id}) is in the order.`);
          // filteredOrderCookies.forEach((orderCookie) => {
          //   console.log(
          //     `Comparing against order cookie "${orderCookie.cookie_name}" (cookie_id: ${orderCookie.cookie_id})`
          //   );
          // });

          // if (isAlreadyInOrder) {
          //   console.log(`Cookie "${cookie.name}" is already in the order and will be filtered out.`);
          // } else {
          //   console.log(`Cookie "${cookie.name}" is NOT in the order and will be available to add.`);
          // }

          return !isAlreadyInOrder;
        });

        // console.log("Filtered Available Cookies:", filteredAvailableCookies);

        setAvailableCookies(filteredAvailableCookies);
      } catch (error) {
        console.error("Failed to fetch available cookies or unexpected response:", error);
        alert("Unable to fetch available cookies. Please try again later.");
      }

      setOrderDetailsOpen(true);
    }
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
    setIsEditing(false);
    setEditingCookieId(null);
  };

  // enable property editing in modal
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // cancel editing, revert changes
  const handleCancelEdit = () => {
    setOrderCookies((prevOrderCookies) =>
      prevOrderCookies.map((cookie) => ({
        ...cookie,
        quantity: originalQuantities[cookie.cookie_id] || cookie.quantity,
      }))
    );

    setTotalCost(originalTotalCost);
    setEditingCookieId(null);
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
  };

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
  };

  const handleEditQuantity = (cookieId) => {
    setEditingCookieId(cookieId);
  };

  // delete cookie from order
  const handleDeleteCookie = async (cookieId) => {
    try {
      await axios.delete(`http://localhost:5000/order_cookies/${selectedOrder.id}/${cookieId}`, {
        withCredentials: true,
      });

      // update local order cookies state by removing the deleted cookie
      setOrderCookies((prevOrderCookies) => {
        const updatedCookies = prevOrderCookies.filter((cookie) => cookie.cookie_id !== cookieId);

        // update total cost after deletion
        const updatedTotalCost = updatedCookies.reduce((total, cookie) => total + cookie.quantity * 6, 0);
        setTotalCost(updatedTotalCost);

        return updatedCookies;
      });

      // update the order state so parent component state gets updated too
      setSelectedOrder((prevOrder) => {
        const updatedOrder = {
          ...prevOrder,
          order_cookies: prevOrder.order_cookies.filter((cookie) => cookie.cookie_id !== cookieId),
        };
        return updatedOrder;
      });

      // update dashboard total cost
      if (typeof updateOrder === "function") {
        const updatedOrderResponse = await axios.get(`http://localhost:5000/orders/${selectedOrder.id}`, {
          withCredentials: true,
        });

        const updatedOrder = updatedOrderResponse.data;

        updateOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Failed to delete cookie from the order:", error);
      alert("Failed to delete the cookie. Please try again.");
    }
  };

  const handleQuantityChange = (cookieId, newValue) => {
    const quantity = parseInt(newValue) || 0;

    setOrderCookies((prevOrderCookies) =>
      prevOrderCookies.map((cookie) => (cookie.cookie_id === cookieId ? { ...cookie, quantity } : cookie))
    );

    // update total cost based on new quantity
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

      // dynamically update projected inventory
      fetchUserInventory();

      const updatedOrderResponse = await axios.get(`http://localhost:5000/orders/${selectedOrder.id}`, {
        withCredentials: true,
      });

      const updatedOrder = updatedOrderResponse.data;

      if (typeof updateOrder === "function") {
        updateOrder(updatedOrder);
      }

      setEditingCookieId(null);
    } catch (error) {
      console.error("Failed to update cookie quantity:", error);
    }
  };

  const handleAddCookieToOrder = async () => {
    if (!selectedCookieToAdd) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/order_cookies/${selectedOrder.id}`,
        {
          cookie_id: selectedCookieToAdd.cookie_id,
          quantity: 1, // default qty
        },
        { withCredentials: true }
      );

      const addedCookie = response.data;

      setOrderCookies((prevOrderCookies) => [...prevOrderCookies, addedCookie]);

      setTotalCost((prevTotalCost) => prevTotalCost + addedCookie.quantity * 6);

      // remove the newly added cookie from the available cookies
      setAvailableCookies((prevAvailableCookies) =>
        prevAvailableCookies.filter((cookie) => cookie.cookie_id !== selectedCookieToAdd.cookie_id)
      );

      // clear the selected cookie state
      setSelectedCookieToAdd(null);
    } catch (error) {
      console.error("Failed to add cookie to the order:", error);
      alert("Failed to add the cookie. Please try again.");
    }
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
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
          notes: notes,
        },
        { withCredentials: true }
      );

      setSelectedOrder(response.data);
      setIsEditing(false);
      // dynamically update projected inventory
      fetchUserInventory();

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
                <h4>Notes:</h4>
                <TextField value={notes} onChange={handleNotesChange} fullWidth multiline rows={4} variant="outlined" />
              </>
            ) : (
              <>
                <h4>Payment Status: {selectedOrder.payment_status}</h4>
                <h4>Payment Method: {selectedOrder.payment_type}</h4>
                <h4>Delivery Status: {selectedOrder.delivery_status}</h4>
                <h4>Notes: {selectedOrder.notes}</h4>
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
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSaveQuantity(cookie.cookie_id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleCancelEdit}
                        style={{ marginLeft: "10px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteCookie(cookie.cookie_id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
                    </>
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

            <div style={{ marginTop: "20px" }}>
              <h4>Add Cookie to Order:</h4>
              <select
                value={selectedCookieToAdd ? selectedCookieToAdd.cookie_id : ""}
                onChange={(e) => {
                  const cookie = availableCookies.find((cookie) => cookie.cookie_id === parseInt(e.target.value));
                  setSelectedCookieToAdd(cookie);
                }}
                style={{ marginRight: "10px" }}
              >
                <option value="">Select a cookie</option>
                {availableCookies.map((cookie) => (
                  <option key={cookie.cookie_id} value={cookie.cookie_id}>
                    {cookie.name} - Price: ${cookie.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddCookieToOrder}
                disabled={!selectedCookieToAdd}
              >
                Add Cookie
              </Button>
            </div>

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
