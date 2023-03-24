import React from "react";
import Wrapper from "./Wrapper";
import { useNavigate } from "react-router-dom";

const CreateRequest = () => {
  const navigate = useNavigate();

  const backButton = (
    <button
      onClick={() => {
        navigate(-1);
      }}
    >
      <i className="fa-solid fa-caret-left"></i> Go back
    </button>
  );
  return (
    <Wrapper
      header={{
        nav: backButton,
        title: "Create Request",
      }}
    >
      Page Content
    </Wrapper>
  );
};

export default CreateRequest;
