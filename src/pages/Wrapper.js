import React from "react";
import "./Wrapper.css";

const Wrapper = ({ header, children }) => {
  return (
    <>
      <nav className="nav-h">
        <div>
          <div className="Wrapper-headerNav">{header.nav}</div>
          <h1>{header.title}</h1>
          <p>{header.subtitle}</p>
        </div>
        <div>{header.action}</div>
      </nav>

      <div className="Wrapper__body">{children}</div>
    </>
  );
};

export default Wrapper;
