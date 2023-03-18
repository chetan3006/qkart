import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import {Link} from "react-router-dom";
import {useState} from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // const[login,setlogin]=useState(false);
  // if(localStorage.getItem("username")!== null){
  //   setlogin(true);
  // }
  let logout=()=>{
    localStorage.clear();
    window.location.reload();
    //setlogin(false);
  }


  let button;
  if (localStorage.getItem("username")==null && !hasHiddenAuthButtons) {
    button = (
      <Stack direction="row">
        <Link to="/login"><Button variant="text">Login</Button></Link>
        <Link to="/register"><Button variant="text">Register</Button></Link>
      </Stack>
    );
  }
   else if(localStorage.getItem("username") === null && hasHiddenAuthButtons){
    button=(<Link to="/"><Button
      className="explore-button"
      startIcon={<ArrowBackIcon />}
      variant="text">
      Back to explore
    </Button></Link>)
  } else {
    console.log(window.localStorage);
    button = (
    <Stack direction="row">
      <Avatar src="avatar.png" alt={localStorage.getItem("username")}/>
         <p>{localStorage.getItem("username")}</p>
         <Button variant="text" onClick={()=>logout()}>Logout</Button>
       </Stack>
      
    );
  }
    

  return (
    
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {button}
    </Box>
  );
};

export default Header;
