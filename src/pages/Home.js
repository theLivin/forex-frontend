import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import routes from "../routes";

const Home = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: routes.DASHBOARD, icon: "fa-solid fa-house" },
    {
      name: "Requests",
      path: routes.REQUESTS,
      icon: "fa-solid fa-money-bill-transfer",
    },
    { name: "Dashboard", path: routes.WALLET, icon: "fa-solid fa-wallet" },
    {
      name: "Bank Accouts",
      path: routes.BANK_ACCOUNTS,
      icon: "fa-solid fa-vault",
    },
  ];

  return (
    <div className="Home">
      <nav className="Home__topBar">
        <div className="container nav-h">
          <Link to="/" className="brand">
            Forex
          </Link>
          <button onClick={() => (window.location.href = routes.HOME)}>
            Logout
          </button>
        </div>
      </nav>

      <div className="Home__main container">
        <div className="sideBar">
          <ul>
            {links.map((link) => (
              <li>
                <Link
                  to={link.path}
                  className={`Home__link  ${
                    location.pathname.includes(link.path) ? "active" : ""
                  }`}
                >
                  <i className={link.icon}></i> {link.name}
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
