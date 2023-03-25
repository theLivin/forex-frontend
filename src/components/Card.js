import React from "react";

const Card = ({ title, body }) => {
  return (
    <div
      style={{
        border: "1px solid gray",
        borderRadius: "5px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div>{title}</div>
      <div style={{ fontWeight: "bold", fontSize: "30px" }}>{body}</div>
    </div>
  );
};

export default Card;
