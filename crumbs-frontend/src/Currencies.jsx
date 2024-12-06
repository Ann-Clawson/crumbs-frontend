/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // MenuItem,
  // Select,
  // TextField,
} from "@mui/material";
// import { useState } from "react";
// import axios from "axios";

export function Currencies({ orders }) {
  // define the dashboard
  const orderRows = orders.map((order, index) => ({
    id: index,
    firstName: `${order.customer_first_name}`,
    lastName: `${order.customer_last_name}`,
  }));

  const orderColumns = [
    {
      field: "firstName",
      headerName: "Currency Type",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Current Balance",
      width: 150,
    },
  ];
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
        <h2 className="current-inventory">Currencies</h2>
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
    </Box>
  );
}
