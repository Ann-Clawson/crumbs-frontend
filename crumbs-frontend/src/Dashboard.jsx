// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Orders } from "./Orders";
import { Currencies } from "./Currencies";
import { OrderForm } from "./OrderForm";
import { Button, Modal, Box, TextField, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [inventory, setInventory] = useState({});
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [cookieToAdjust, setCookieToAdjust] = useState(null);
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [paymentSummary, setPaymentSummary] = useState(true);
  const [orderId, setOrderId] = useState(null);
  // const [customerId, setCustomerId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // define the dashboard
  const inventoryRows = Object.keys(inventory).map((cookieName, index) => ({
    id: index,
    cookieName: cookieName,
    inventory: inventory[cookieName].inventory,
    projectedInventory: inventory[cookieName].projected_inventory,
  }));

  const inventoryColumns = [
    {
      field: "cookieName",
      headerName: "Cookie Name",
      width: 200,
      editable: false,
    },
    {
      field: "inventory",
      headerName: "Actual",
      width: 100,
      editable: false,
    },
    {
      field: "projectedInventory",
      headerName: "Projected",
      width: 100,
      editable: false,
    },
    {
      field: "adjust",
      headerName: "Update Actual",
      width: 180,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenAdjustModal(params.row)}>
          Adjust
        </Button>
      ),
    },
  ];

  // retrieve current user
  useEffect(() => {
    axios
      .get("http://localhost:5000/current-user", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setCurrentUser(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  // retrieve current users' inventory
  useEffect(() => {
    if (currentUser) {
      fetchUserInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchUserInventory = () => {
    if (currentUser) {
      axios
        .get("http://localhost:5000/users/inventory", { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            setInventory(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching inventory:", error);
        })
        .finally(() => {
          setLoadingInventory(false);
        });
    }
  };

  // retrieve current users' orders
  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchUserOrders = () => {
    if (currentUser) {
      axios
        .get("http://localhost:5000/orders", { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            setOrders(response.data.orders);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  };

  // retrieve current users' completed order payment type balances
  useEffect(() => {
    if (currentUser) {
      fetchUserBalances();
    }
  }, [currentUser]);

  const fetchUserBalances = async () => {
    try {
      const response = await axios.get("http://localhost:5000/current-user", {
        withCredentials: true,
      });

      if (response.status === 200) {
        const refreshedUser = response.data;

        const { actual_balance, projected_balance } = refreshedUser;

        const summaryArray = Object.keys(actual_balance).map((paymentType) => ({
          id: paymentType,
          paymentType,
          actualBalance: `$${actual_balance[paymentType].toFixed(2)}`,
          projectedBalance: `$${(projected_balance[paymentType] || 0).toFixed(2)}`,
        }));

        setPaymentSummary(summaryArray);
      }
    } catch (error) {
      console.error("Error refreshing current user or fetching balances:", error);
    }
  };

  const updateOrder = (updatedOrder) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  };

  // check if data is still loading
  if (loadingUser || loadingInventory || loadingOrders) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const removeOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  // adjust actual inventory manually
  const handleOpenAdjustModal = (cookie) => {
    setCookieToAdjust(cookie);
    setAdjustmentValue("");
    setAdjustModalOpen(true);
  };

  const handleCloseAdjustModal = () => {
    setAdjustModalOpen(false);
    setCookieToAdjust(null);
  };

  const handleAdjustTotal = async () => {
    try {
      const currentInventory = parseInt(inventory[cookieToAdjust.cookieName].inventory, 10);
      const adjustment = parseInt(adjustmentValue, 10);

      if (isNaN(adjustment)) {
        alert("Please enter a valid number for adjustment.");
        return;
      }

      const newInventory = currentInventory + adjustment;

      if (newInventory < 0) {
        alert("Error: Inventory cannot be negative.");
        return;
      }

      const formData = new FormData();
      formData.append("cookie_name", cookieToAdjust.cookieName);
      formData.append("inventory", newInventory);

      const response = await axios.post("http://localhost:5000/users/inventory", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        fetchUserInventory();
        handleCloseAdjustModal();
      } else {
        alert("Error adjusting quantity");
      }
    } catch (error) {
      console.error("Error adjusting quantity:", error);
    }
  };

  const handleCreateOrderClick = () => {
    setOrderId(null); // Reset order ID for new order
    setShowModal(true); // Open the modal
  };

  const handleFormSubmit = (order) => {
    console.log("Order submitted:", order);
    setShowModal(false); // Close the modal
  };

  const handleLogOut = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="dashboard-background">
      <Button
        sx={{
          margin: "10px",
        }}
        variant="contained"
        color="primary"
        onClick={() => handleLogOut()}
      >
        Log Out
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          height: "100vh",
        }}
      >
        {/* LEFT CONTAINER */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            minHeight: "40vh",
            maxHeight: "100vh",
          }}
        >
          {/* TOP LEFT */}
          <Box
            sx={{
              marginBottom: "10%",
              minHeight: "40vh",
              maxHeight: "40vh",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrderClick}
                sx={{
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                Create New Order
              </Button>
              <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "90%",
                    maxWidth: 400,
                    maxHeight: "90vh", // Set maximum height for the modal
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    boxShadow: 24,
                    overflowY: "auto", // Enable scrolling within the modal
                    p: 4,
                  }}
                >
                  {/* MODAL HEADER WITH CLOSE BUTTON */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h2 style={{ margin: 0 }}>Create New Order</h2>
                    <IconButton onClick={() => setShowModal(false)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </div>

                  {/* ORDER FORM CONTENT */}
                  <OrderForm onSubmit={handleFormSubmit} orderId={orderId} setOrderId={setOrderId} />
                </Box>
              </Modal>
            </Box>
          </Box>
          {/* BOTTOM LEFT */}
          <Orders
            orders={orders}
            updateOrder={updateOrder}
            fetchUserInventory={fetchUserInventory}
            inventory={inventory}
            removeOrder={removeOrder}
            fetchUserBalances={fetchUserBalances}
          />
        </Box>
        {/* RIGHT CONTAINER */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            minHeight: "40vh",
            maxHeight: "100vh",
          }}
        >
          {/* TOP RIGHT */}
          <Box
            sx={{
              marginBottom: "10%",
            }}
          >
            <Currencies key={JSON.stringify(paymentSummary)} paymentSummary={paymentSummary} />
          </Box>
          {/* BOTTOM RIGHT */}
          <Box
            sx={{
              minHeight: "40vh",
              maxHeight: "40vh",
              backgroundColor: "white",
              opacity: 0.9,
              margin: 0,
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="current-inventory">Current Inventory</h2>
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
              rows={inventoryRows}
              columns={inventoryColumns}
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
            <Modal open={adjustModalOpen} onClose={handleCloseAdjustModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                {/* MODAL HEADER WITH CLOSE BUTTON*/}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{cookieToAdjust?.cookieName}</h3>
                  <IconButton onClick={handleCloseAdjustModal} size="small">
                    <CloseIcon />
                  </IconButton>
                </div>

                {/* MODAL CONTENT */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                    sx={{ marginRight: "10px", width: "100px" }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAdjustTotal}>
                    ADD/DELETE QUANTITY
                  </Button>
                </div>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
