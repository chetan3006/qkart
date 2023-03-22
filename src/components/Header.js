import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextField,Avatar, Stack,Button} from "@mui/material";
//import {Button} from "@mui/material-next/Button";

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
      <Stack direction="row" spacing={2}>
        <Link to="/login"><Button variant="outlined">Login</Button></Link>
        <Link to="/register"><Button variant="outlined">Register</Button></Link>
      </Stack>
      
    );
  }
   else if(localStorage.getItem("username") === null && hasHiddenAuthButtons){
    
    button = (<Stack><Link to="/"><Button
      className="explore-button"
      startIcon={<ArrowBackIcon />}
      variant="outlined">
      Back to explore
    </Button></Link></Stack>);
  } else {
    console.log(window.localStorage);
    button = (
    <Stack direction="row" spacing={2}>
      <Avatar src="avatar.png" alt={localStorage.getItem("username")}/>
         <p>{localStorage.getItem("username")}</p>
         <Button variant="outlined" onClick={()=>logout()}>Logout</Button>
       </Stack>
      
    );
  }
    

  return (
    
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {button}
    </Box>
    
  );
};

export default Header;
