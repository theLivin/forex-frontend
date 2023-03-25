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
      <div style={{ marginBottom: "30px" }}>Requests data not available...</div>
      {createRequestButton}
    </>
  );
};

export default NoRequest;
