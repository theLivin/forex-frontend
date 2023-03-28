import React from "react";
import routes from "../routes";
import { useNavigate } from "react-router-dom";

const NoRequest = () => {
  const navigate = useNavigate();

  const createRequestButton = (
    <button onClick={() => navigate(routes.CREATE_REQUEST)}>Buy FX</button>
  );

  return (
    <>
      <div style={{ marginBottom: "30px" }}>No data available...</div>
      {createRequestButton}
    </>
  );
};

export default NoRequest;
