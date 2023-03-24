import React from "react";
import routes from "../routes";
import Wrapper from "./Wrapper";

const Requests = () => {
  const button = (
    <button onClick={() => (window.location.href = routes.CREATE_REQUEST)}>
      Create request
    </button>
  );
  return (
    <Wrapper
      header={{
        title: "Requests",
        button,
      }}
    >
      Page Content
    </Wrapper>
  );
};

export default Requests;
