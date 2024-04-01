import React from "react";
import { MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import Login from "./components/NotGame/login/login";
import { Link, Route, Routes } from "react-router-dom";
import Registration from "./components/NotGame/registration/registration";
import HomePage from "./components/NotGame/homePage/homePage";
import UsersList from "./components/NotGame/usersList/usersList";
import { useEffect } from "react";
import { useBoardContext } from "./context/boardContext";
import { useGameInformation } from "./context/gameInformation";
import Layout from "./components/NotGame/layout/Layout";

function App() {
   
  
  return (
    <div >
    <Layout>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="/homePage" element={<HomePage />}></Route>
      <Route path="/usersList" element={<UsersList />}></Route>
    </Routes>
    </Layout>
    </div>
  );
}

export default App;
