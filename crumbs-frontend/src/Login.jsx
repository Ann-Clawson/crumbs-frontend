// eslint-disable-next-line no-unused-vars
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import { Link as MuiLink } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <MuiLink component={RouterLink} color="inherit" href="https://mui.com/">
        cat lady & rance man
      </MuiLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LogIn() {
  const [errors, setErrors] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.currentTarget);

    const email = params.get("email");
    params.set("email", email.toLowerCase());
    const password = params.get("password");

    if (!password || password.trim() === "") {
      setErrors(["Please enter your password."]);
      return; // Exit the function to prevent the API call
    }

    axios
      .post("http://localhost:5000/login", params, { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          event.target.reset();
          window.location.href = "/dashboard";
        } else {
          setErrors(["Login failed. Please try again."]);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setErrors([error.response.data.message]);
        } else {
          setErrors(["An error occurred. Please try again."]);
        }
        console.error("Login error: ", error);
      });
  };

  const handleLinkClick = () => {
    setEmailInput(""); // Clear the email input when navigating to the signup page
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={emailInput} // Use the renamed state variable
              onChange={(e) => setEmailInput(e.target.value)} // Update the state on input change
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {errors.map((error, index) => (
                  <Typography key={index} color="error" variant="body2">
                    {error}
                  </Typography>
                ))}
              </Box>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <MuiLink component={RouterLink} to="#" variant="body2">
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={RouterLink} to="/signup" variant="body2" onClick={handleLinkClick}>
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
