// import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./components/Home";
import Create from "./components/Create";
import Job from "./components/jobCreate";
// import Status from "./components/Status";

function App() {
   return(
     <>
     <Navbar/>
     <Route exact path="/">
   <Home/>
   </Route>

   <Route path="/create">
   <Create/>
   </Route>

   <Route path="/Job">
   <Job/>
   </Route>
     
   
     </>
   )
  
  
}

export default App;
