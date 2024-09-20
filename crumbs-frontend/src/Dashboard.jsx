// eslint-disable-next-line no-unused-vars
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
// import axios from "axios";
// import { useState, useEffect } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
];

const inventory_rows = [
  { id: 1, cookieName: "Adventurefuls", qty: 42, adjust: "" },
  { id: 2, cookieName: "Caramel Chocolate Chip", qty: 13, adjust: "" },
  { id: 3, cookieName: "Samoas", qty: 36, adjust: "" },
  { id: 4, cookieName: "Do-si-dos", qty: 14, adjust: "" },
  { id: 5, cookieName: "Girl Scout S'mores", qty: 27, adjust: "" },
  { id: 6, cookieName: "Lemonades", qty: 53, adjust: "" },
  { id: 7, cookieName: "Lemon-Ups", qty: 16, adjust: "" },
  { id: 8, cookieName: "Tagalongs", qty: 8, adjust: "" },
  { id: 9, cookieName: "Thin Mints", qty: 32, adjust: "" },
  { id: 10, cookieName: "Toast-Yay!", qty: 38, adjust: "" },
  { id: 11, cookieName: "Toffee-tastic", qty: 23, adjust: "" },
  { id: 12, cookieName: "Trefoils", qty: 19, adjust: "" },
];

const inventory_columns = [
  // { field: "id", headerName: "ID", width: 90 },
  {
    field: "cookieName",
    headerName: "Cookie Name",
    width: 150,
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
    // type: "number",
    width: 185,
    // editable: true,
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

// const handleAdjustClick = (id) => {
//   alert(`Adjust clicked for cookie ID: ${id}`);
//   // You can perform any operation here, like opening a dialog to adjust quantity
// };

export function Dashboard() {
  // const [thisUser, setThisUser] = useState({});

  // const getThisUser = () => {
  //   axios
  //     .get("http://localhost:5000/users", { withCredentials: true })
  //     .then((usersResponse) => {
  //       setThisUser(usersResponse.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user:", error);
  //     });
  // };

  // useEffect(getThisUser, []);

  let current_user = {
    email: "Tina@gmail.com",
    id: 5,
    password: "$2b$12$KbvGaEDGUY9532A70P/tl.FecWC5B34KeowtLDz2O3tpendBwCCW2",
  };
  console.log(current_user.email);

  return (
    <div>
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
            <h1>{current_user.email}</h1>
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
            <DataGrid
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
            />
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
            <DataGrid
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
            />
          </Box>
          {/* BOTTOM RIGHT */}
          <Box
            sx={{
              minHeight: "40vh",
              maxHeight: "40vh",
            }}
          >
            <h2>Cookie Inventory</h2>
            <DataGrid
              rows={inventory_rows}
              columns={inventory_columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
