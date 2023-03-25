import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";
import utils from "../utils";
import routes from "../routes";
import { Navigate } from "react-router-dom";

const Auth = ({ isAuthenticated }) => {
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
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleError = (error) => {
    console.log(error);
  };

  return !isAuthenticated ? (
    <div className="Auth">
      <header className="Auth-header">
        <div style={{ marginBottom: "30px" }}>
          <i
            className="fa-solid fa-droplet fa-2xl"
            style={{ fontSize: "59px", marginBottom: "35px" }}
          ></i>
          <h1 className="brand">{process.env.REACT_APP_NAME}</h1>
          <p className="text-muted" style={{ marginTop: "10px" }}>
            Trade with confidence, profit with ease - with{" "}
            {process.env.REACT_APP_NAME}!
          </p>
        </div>

        <h3>continue with google</h3>

        <div className="GoogleLogin">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </header>
    </div>
  ) : (
    <Navigate to={routes.HOME} replace />
  );
};

export default Auth;
