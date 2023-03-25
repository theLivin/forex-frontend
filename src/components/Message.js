import React from "react";
import { Link } from "react-router-dom";
import routes from "../routes";

const Message = ({ status, text }) => {
  const Content = () => {
    switch (status) {
      case "COMPLETED":
        return (
          <>
            <i
              className="fa-solid fa-thumbs-up"
              style={{ color: "green", fontSize: "30px", marginRight: "10px" }}
            ></i>
            COMPLETED!
            <p>Your request was successfully completed.</p>
          </>
        );
      case "FAILED":
        return (
          <>
            <i
              className="fa-solid fa-thumbs-down"
              style={{ color: "red", fontSize: "30px", marginRight: "10px" }}
            ></i>
            FAILED!
            <p>{text}</p>
          </>
        );
      default:
        break;
    }
  };

  return (
    <div style={{ fontSize: "18px" }}>
      {<Content />}
      <div style={{ marginTop: "10px" }}>
        <Link to={routes.REQUESTS}>View all requests</Link>
      </div>
    </div>
  );
};

export default Message;
