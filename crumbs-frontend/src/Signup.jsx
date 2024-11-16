// eslint-disable-next-line no-unused-vars
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Dialog, DialogTitle, DialogContent, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useState } from "react";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        cat lady & rance man
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export function SignUp() {
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");

  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
  const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const validateInputs = () => {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordConfirmation = document.getElementById("passwordConfirm");

    let isValid = true;

    if (!firstName.value || firstName.value.trim() === "") {
      setFirstNameError(true);
      setFirstNameErrorMessage("Please enter your first name.");
      isValid = false;
    } else {
      setFirstNameError(false);
      setFirstNameErrorMessage("");
    }

    if (!lastName.value || lastName.value.trim() === "") {
      setLastNameError(true);
      setLastNameErrorMessage("Please enter your last name.");
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage("");
    }

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    let errorMessage = "";

    if (!password.value || password.value.length < 8 || password.value.length > 20) {
      errorMessage = "Password must be between 8 and 20 characters long.";
      isValid = false;
    } else if (!/\d/.test(password.value)) {
      errorMessage = "Password must include at least one number.";
      isValid = false;
    } else if (!/[!@#$%^&*_?]/.test(password.value)) {
      errorMessage = "Password must include at least one special character (!@#$%^&*_?).";
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!isValid) {
      setPasswordError(true);
      setPasswordErrorMessage(errorMessage);
    }

    if (!passwordConfirmation.value) {
      setPasswordConfirmationError(true);
      setPasswordConfirmationErrorMessage("Please confirm your password.");
      isValid = false;
    } else if (password.value !== passwordConfirmation.value) {
      setPasswordConfirmationError(true);
      setPasswordConfirmationErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setPasswordConfirmationError(false);
      setPasswordConfirmationErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setEmailError(false);
    setEmailErrorMessage("");

    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    const params = new FormData(event.currentTarget);

    try {
      const response = await axios.post("http://localhost:5000/register", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200 && response.data.status === "success") {
        event.target.reset();
        handleOpenSuccessModal();
      } else if (response.data.status === "error") {
        setEmailError(true);
        setEmailErrorMessage(response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "An error occurred. Please try again.";
        setEmailError(true);
        setEmailErrorMessage(errorMessage);
      } else {
        setEmailError(true);
        setEmailErrorMessage("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleOpenSuccessModal = () => {
    setOpenSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <div className="signup-background">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              // marginTop: 8,
              paddingTop: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={firstNameError}
                    helperText={firstNameErrorMessage || ""}
                    color={passwordError ? "error" : "primary"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    error={lastNameError}
                    helperText={lastNameErrorMessage || ""}
                    color={passwordError ? "error" : "primary"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={emailError}
                    helperText={emailErrorMessage || ""}
                    color={passwordError ? "error" : "primary"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={passwordError}
                    helperText={passwordErrorMessage || ""}
                    color={passwordError ? "error" : "primary"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password_confirm"
                    label="Confirm Password"
                    type="password"
                    id="passwordConfirm"
                    autoComplete="new-password"
                    error={passwordConfirmationError}
                    helperText={passwordConfirmationErrorMessage || ""}
                    color={passwordError ? "error" : "primary"}
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={validateInputs}>
                Sign Up
              </Button>
              <Dialog open={openSuccessModal} onClose={handleCloseSuccessModal}>
                <DialogTitle>Your account has been created!</DialogTitle>
                <DialogContent>
                  <Typography>
                    Return{" "}
                    <Link component={RouterLink} to="/" onClick={handleCloseSuccessModal}>
                      here
                    </Link>{" "}
                    to log in and start tracking your dough.
                  </Typography>
                </DialogContent>
              </Dialog>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
