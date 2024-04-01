import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import Validations from "./Validation";
import HttpLoginService from "../../../services/HttpLoginService";
import IconPicker from "../iconPicker/IconPicker";
import { Link, useNavigate } from "react-router-dom";
import { useGameInformation } from "../../../context/gameInformation";
function Registration() {
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
  const iconContext = require.context(
    "../../../../public/icons",
    false,
    /\.(png|jpe?g|svg)$/
  );
  const iconsKeys = iconContext.keys();
  const icons = iconsKeys.map((key) => key.match(/\/([^/]+)$/)[1]);

  const [list, setList] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("ducky.png");
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    blevel: 1,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: parseInt(value),
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();

  const homepage = () => {
    navigate("/homePage", { state: { list: list } });
  };

  const handleSelectIcon = (icon) => {
    setSelectedIcon(icon);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const validationErrors = Validations.Validations(values);
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length === 0 &&
      values.username !== "" &&
      values.password !== "" &&
      values.email !== ""
    ) {
      try {
        const response = await httpLoginService.signIn(
          values.username,
          values.password,
          values.email,
          values.blevel,
          selectedIcon
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
        const httpErrors = Validations.ValidationHttp(error.response.status);
        setErrors(httpErrors);

        console.error("An error occurred:", error);
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
    <form onSubmit={handleRegistration}>
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Registration</h2>
                <p className="text-white-50 mb-5">Please enter sign In</p>

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
                <MDBInput
                  value={values.email} // Set input value
                  name="email"
                  onChange={handleChange}
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Email"
                  id="email"
                  type="email"
                  size="lg"
                  style={{ color: "white" }}
                />
                <p style={{ color: "red" }}> {errors.email}</p>
                <div className="mb-4 mx-5 w-100">
                  <label className="text-white">Beckgammon level:</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <label key={level} className="mx-2">
                        <input
                          type="radio"
                          name="blevel"
                          value={level}
                          checked={values.blevel === level || level == 1}
                          onChange={handleChange}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-4 mx-5 w-100">
                  <label className="text-white">Select an image:</label>
                  <IconPicker
                    icons={icons}
                    selectedIcon={selectedIcon}
                    onSelectIcon={handleSelectIcon}
                  />
                </div>

                <MDBBtn type="submit" className="mb-4 w-100">
                  Create a new Account
                </MDBBtn>
                <div>
                  <p className="mb-0">
                    already have an account?{" "}
                    <Link className="link" to="/">
                      {" "}
                      log in
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

export default Registration;
