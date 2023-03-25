import React from "react";
import { Link } from "react-router-dom";
import routes from "../routes";

const Message = ({ status, text }) => {
  return (
    <div>
      Message: {status} {text}
      <Link to={routes.REQUESTS}>View all requests</Link>
    </div>
  );
};

export default Message;
