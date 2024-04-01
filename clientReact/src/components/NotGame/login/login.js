import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import HttpLoginService from "../../../services/HttpLoginService";
import Validations from "./Validation";
import { Link, useNavigate } from "react-router-dom";
import { useGameInformation } from "../../../context/gameInformation";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

//const { ipcRenderer } = window.require("electron"); // Import ipcRenderer for Electron

function Login() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const httpLoginService = new HttpLoginService();
  const {
    user,
    setUser,
    token,
    setToken,
    opponent,
    setOpponent,
    icon,
    setIcon,
  } = useGameInformation();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const homepage = () => {
    navigate("/homePage", { state: { list: list } });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = Validations.Validations(values);
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length === 0 &&
      values.username !== "" &&
      values.password !== ""
    ) {
      try {
        const response = await httpLoginService.login(
          values.username,
          values.password
        );
        const token = response.data.token;
        const user = response.data.username;
        const icon = response.data.icon;
        localStorage.setItem("user", user);
        localStorage.setItem("token", token);
        localStorage.setItem("icon", icon);
        setUser(user);
        setToken(token);
        setIcon(icon);
        homepage();
        //ipcRenderer.send("store-token", token);
      } catch (error) {
        if (error.response) {
          if(error.response.status==401){
            toast.error('user aleady connected from another place', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
          }else{
          const httpErrors = Validations.ValidationHttp(error.response.status);
          setErrors(httpErrors);}
        } else {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpLoginService.get();
        setList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); 
  }, []); 

  return (
    <form onSubmit={handleLogin}>
      <ToastContainer />
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                <p className="text-white-50 mb-5">
                  Please enter User Name and password
                </p>

                <MDBInput
                  value={values.username}
                  name="username"
                  onChange={handleChange}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="UserName"
                  id="username"
                  type="text"
                  size="lg"
                  style={{ color: "white" }}
                />
                {errors.username && (
                  <p style={{ color: "red" }}> {errors.username}</p>
                )}
                <MDBInput
                  value={values.password} // Set input value
                  name="password"
                  onChange={handleChange}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Password"
                  id="password"
                  type="password"
                  size="lg"
                  style={{ color: "white" }}
                />
                {errors.password && (
                  <p style={{ color: "red" }}> {errors.password}</p>
                )}
                <MDBBtn type="submit" className="mb-4 w-100">
                  Login
                </MDBBtn>
                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link className="link" to="/registration">
                      {" "}
                      Sign Up
                    </Link>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </form>
  );
}

export default Login;
