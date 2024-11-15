// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Orders } from "./Orders";
import {
  Button,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [inventory, setInventory] = useState({});
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [open, setOpen] = useState(false);
  const [cookieNames, setCookieNames] = useState([]);
  const [selectedCookie, setSelectedCookie] = useState("");
  const [quantity, setQuantity] = useState("");
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [cookieToAdjust, setCookieToAdjust] = useState(null);
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Retrieve Current User
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

  // Retrieve Current Users' Inventory
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

  // Retrieve Current Users' Orders
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
  // console.log(orders);

  const updateOrder = (updatedOrder) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
  };

  // Check if Data is Still Loading
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

  // Add Cookies to Current Inventory Dashboard if unpopulated
  const fetchCookieNames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cookies");
      const data = response.data;
      setCookieNames(data.cookies);
    } catch (error) {
      console.error("Error fetching cookie names:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchCookieNames();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddCookie = async () => {
    try {
      const formData = new FormData();
      formData.append("cookie_name", selectedCookie);
      formData.append("inventory", quantity);

      const response = await axios.post("http://localhost:5000/users/inventory", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 || response.status === 201) {
        fetchUserInventory();
        handleClose();
      } else {
        alert("Error adding cookie");
      }
    } catch (error) {
      console.error("Error adding cookie:", error);
    }
  };

  // Adjust Actual Inventory Manually
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

  // Define Current Inventory DataGrid
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
          // padding: "2vh",
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
            <h1>Howdy, {currentUser.first_name}!</h1>
          </Box>
          {/* BOTTOM LEFT */}
          {/* <Box
            sx={{
              height: "50%",
              minHeight: "40vh",
              maxHeight: "40vh",
            }}
          > */}
          <Orders orders={orders} updateOrder={updateOrder} />
          {/* <DataGrid
              rows={rows}
              columns={columns}
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
            /> */}
          {/* </Box> */}
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
              minHeight: "40vh",
              maxHeight: "40vh",
            }}
          >
            <h2>Currencies</h2>
            {/* <DataGrid
              rows={rows}
              columns={columns}
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
            /> */}
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
                onClick={handleOpen}
              >
                Add Cookies
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Cookies to Inventory</DialogTitle>
                <DialogContent>
                  <div style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}>
                    <Select
                      value={selectedCookie || ""}
                      onChange={(e) => setSelectedCookie(e.target.value)}
                      displayEmpty
                      sx={{ marginRight: "10px", minWidth: "150px" }}
                    >
                      <MenuItem value="" disabled>
                        Select a cookie
                      </MenuItem>
                      {cookieNames.map((cookie, index) => (
                        <MenuItem key={index} value={cookie.name}>
                          {cookie.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      type="number"
                      label="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      sx={{ marginRight: "10px", width: "80px" }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddCookie}>
                      Add
                    </Button>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <>
              {Object.keys(inventory).length > 0 ? (
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
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <h3>Let&apos;s dough this!</h3>
                </div>
              )}
            </>
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
                {/* Modal Header with Close Button */}
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

                {/* Modal Content */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                    sx={{ marginRight: "10px", width: "100px" }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAdjustTotal}>
                    Adjust Actual Total
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
