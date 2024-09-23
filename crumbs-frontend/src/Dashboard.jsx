// eslint-disable-next-line no-unused-vars
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

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

  useEffect(() => {
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
  }, [currentUser]);

  if (loadingUser || loadingInventory) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  console.log(currentUser);
  console.log(inventory);

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

  const inventoryRows = Object.entries(inventory).map(([cookieName, quantity], index) => ({
    id: index,
    cookieName: cookieName,
    qty: quantity,
  }));

  // const inventoryRows = Object.keys(inventory).length > 0
  // ? Object.entries(inventory).map(([cookieName, quantity], index) => ({
  //     id: index,
  //     cookieName: cookieName,
  //     qty: quantity,
  //   }))
  // : [{ id: 0, cookieName: "please add something", qty: "" }];

  const inventoryColumns = [
    {
      field: "cookieName",
      headerName: "Cookie Name",
      width: 185,
      editable: true,
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 150,
      editable: true,
    },
    {
      field: "adjust",
      headerName: "Update Totals",
      width: 185,
      // eslint-disable-next-line no-unused-vars
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          // onClick={() => handleAdjustClick(params.row.id)}
        >
          Click to Adjust
        </Button>
      ),
    },
  ];

  return (
    <div>
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
          padding: "2vh",
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
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>{currentUser.email}</h1>
          </Box>
          {/* BOTTOM LEFT */}
          <Box
            sx={{
              height: "50%",
              minHeight: "40vh",
              maxHeight: "40vh",
            }}
          >
            <h2>Orders</h2>
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
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Cookie Inventory</h2>
              <Button
                sx={{
                  margin: "10px",
                }}
                variant="contained"
                color="primary"
                onClick={() => handleAddCookies()}
              >
                Add Cookies
              </Button>
            </div>
            <DataGrid
              rows={inventoryRows}
              columns={inventoryColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
