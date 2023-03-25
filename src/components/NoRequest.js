import React from "react";
import routes from "../routes";
import { useNavigate } from "react-router-dom";

const NoRequest = () => {
  const navigate = useNavigate();

  const createRequestButton = (
    <button onClick={() => navigate(routes.CREATE_REQUEST)}>
      Create request
    </button>
  );

  return (
    <>
      <div>you have no requests</div>
      <br />
      {createRequestButton}
    </>
  );
};

export default NoRequest;
