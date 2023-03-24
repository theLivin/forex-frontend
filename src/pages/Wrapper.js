import React from "react";

const Wrapper = ({ header, children }) => {
  return (
    <>
      <nav className="nav-h">
        <div>
          <div>{header.nav}</div>
          <h1>{header.title}</h1>
        </div>
        <div>{header.button}</div>
      </nav>

      {children}
    </>
  );
};

export default Wrapper;
