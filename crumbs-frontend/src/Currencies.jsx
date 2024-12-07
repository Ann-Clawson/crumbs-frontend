/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

// eslint-disable-next-line react/prop-types
export function Currencies({ currentUser }) {
  const [paymentSummary, setPaymentSummary] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const { actual_balance, projected_balance } = currentUser;

      // Combine actual and projected balances into a unified array
      const summaryArray = Object.keys(actual_balance).map((paymentType) => ({
        id: paymentType,
        paymentType,
        actualBalance: `$${actual_balance[paymentType].toFixed(2)}`,
        projectedBalance: `$${(projected_balance[paymentType] || 0).toFixed(2)}`,
      }));

      setPaymentSummary(summaryArray);
    }
  }, [currentUser]);

  const columns = [
    { field: "paymentType", headerName: "Payment Type", width: 150 },
    { field: "actualBalance", headerName: "Actual Balance", width: 150 },
    // { field: "projectedBalance", headerName: "Projected Balance", width: 150 },
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
        rows={paymentSummary}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
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
        }}
      />
    </Box>
  );
}
