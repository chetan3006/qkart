import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom";

import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history=useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const [val, setval] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setLoading] = useState(false);
  const handle = (e) => {
    const login = { ...val };
    login[e.target.id] = e.target.value;
    setval(login);
  };
  const register = async (formData) => {
    
    if (validateInput(val)) {
      try {
        setLoading(true);
        let response = await axios.post(config.endpoint + `/auth/register`, {
          username: formData.username,
          password: formData.password,
          /* confirmPassword:val.confirmPassword*/
        });
        console.log(response.status);
        if (response.status === 201) {
          console.log("registered succesfully");
          enqueueSnackbar("Registered successfully", {
            variant: "success",
          });
          history.push('/login')
        }
      } catch (err) {
        //console.log(err.response.status);
        //console.log(err.response.data.message);
        //console.log("error", err.message);
        if (err.response.status === 400) {
          enqueueSnackbar(err.response.data.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      }
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username.length == 0) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password.length == 0) {
      /*else{
        setfullfilled((prevState) => ({
          ...prevState,
          username: true,
        }));
      }*/
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.confirmPassword !== data.password) {
      /*else{
        setfullfilled((prevState) => ({
          ...prevState,
          password: true,
        }));
      }*/
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
      /* setfullfilled((prevState) => ({
        ...prevState,
        confirmPassword: true,
      }));*/
    } else {
      return true;
    }
  };
  let button = isLoading ? (
    <CircularProgress />
  ) : (
    <Button
      className="button"
      id=""
      variant="contained"
      onClick={() => {
        register(val);
      }}
    >
      Register Now
    </Button>
  );

  /*console.log(fullfilled.username);
  console.log(fullfilled.password);
  console.log(fullfilled.confirmPassword);*/
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true}  children={false}/>
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={val.username}
            onChange={handle}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={val.password}
            onChange={handle}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={val.confirmPassword}
            onChange={handle}
            fullWidth
          />
          {button}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
              </Link>
          
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
