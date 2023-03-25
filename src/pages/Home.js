import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import routes from "../routes";
import { googleLogout } from "@react-oauth/google";

const Home = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: routes.DASHBOARD, icon: "fa-solid fa-house" },
    {
      name: "Requests",
      path: routes.REQUESTS,
      icon: "fa-solid fa-money-bill-transfer",
    },
    { name: "Wallet", path: routes.WALLET, icon: "fa-solid fa-wallet" },
    {
      name: "Bank Accouts",
      path: routes.BANK_ACCOUNTS,
      icon: "fa-solid fa-vault",
    },
  ];

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="Home">
      <nav className="Home__topBar">
        <div className="container nav-h">
          <Link to="/" className="brand">
            <i
              className="fa-solid fa-droplet"
              style={{ fontSize: "inherit" }}
            ></i>{" "}
            {process.env.REACT_APP_NAME}
          </Link>
          <button className="btn-danger" onClick={logOut}>
            Logout
          </button>
        </div>
      </nav>

      <div className="Home__main container">
        <div className="sideBar">
          <h4>HOME</h4>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`Home__link  ${
                    location.pathname.includes(link.path) ? "active" : ""
                  }`}
                >
                  <i
                    className={link.icon}
                    style={{
                      color: `${
                        location.pathname.includes(link.path)
                          ? "inherit"
                          : "blue"
                      }`,
                      marginRight: "8px",
                    }}
                  ></i>{" "}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
