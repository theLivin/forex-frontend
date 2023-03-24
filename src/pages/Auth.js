import React, { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import utils from "../utilities";

const Auth = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(() => ({ ...JSON.parse(localStorage.getItem("user")) }));
  }, []);

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
  };

  const handleSuccess = (response) => {
    const { credential } = response;
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/traders/auth`, {
        headers: utils.buildHeaders(credential),
      })
      .then((res) => {
        const user = res.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("credential", credential);
        setUser(user);
      })
      .catch((err) => console.log(err));
  };

  const handleError = (error) => {
    console.log(error);
  };

  return (
    <div className="Auth">
      <header className="Auth-header">
        <h1 className="brand">Forex</h1>
        <h3>Log in to your account</h3>

        <div className="GoogleLogin">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </header>
    </div>
  );
};

export default Auth;
