import { React } from "react";
import routes from "../routes";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to={routes.AUTH} replace />;
};

export default RequireAuth;
