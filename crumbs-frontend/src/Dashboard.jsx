import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
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
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

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
      <h1>{current_user.email}</h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          height: "100vh",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            width: "45%",
            minHeight: "40vh",
            maxHeight: "40vh",
            // flexGrow: 1,
          }}
        >
          <h2>Cookie Calculator</h2>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            minHeight: "40vh",
            maxHeight: "100vh",
            // flexGrow: 1,
          }}
        >
          <Box
            sx={{
              height: "50%",
              marginBottom: "10%",
              // minHeight: "20vh",
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
          <Box
            sx={{
              height: "50%",
              minHeight: "40vh",
              maxHeight: "40vh",
            }}
          >
            <h2>Cookie Inventory</h2>
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
      </Box>
    </div>
  );
}
