import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";

export function Orders({ orders }) {
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Define Orders DataGrid
  const orderRows = orders.map((order, index) => ({
    id: index,
    customerName: `${order.customer_first_name} ${order.customer_last_name}`,
    orderStatus: order.order_status,
    paymentStatus: order.payment_status,
    totalCost: order.total_cost,
    orderId: order.id,
  }));

  const orderColumns = [
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "orderStatus", headerName: "Order Status", width: 180 },
    { field: "paymentStatus", headerName: "Payment Status", width: 180 },
    { field: "totalCost", headerName: "Total Cost", width: 130 },
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
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Box
      sx={{
        height: "50%",
        minHeight: "40vh",
        maxHeight: "40vh",
      }}
    >
      <h2>Orders</h2>
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
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* Dialog to show order details */}
      {selectedOrder && (
        <Dialog open={orderDetailsOpen} onClose={handleCloseOrderDetails}>
          <DialogTitle>
            Order Details for {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}
          </DialogTitle>
          <DialogContent>
            <h4>Order Status: {selectedOrder.order_status}</h4>
            <h4>Payment Status: {selectedOrder.payment_status}</h4>
            <h4>Delivery Status: {selectedOrder.delivery_status}</h4>
            <h4>Total Cost: ${selectedOrder.total_cost.toFixed(2)}</h4>
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
            <Button onClick={handleCloseOrderDetails} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
