import { Route, Routes, Navigate } from "react-router-dom";
import {
  Auth,
  BankAccounts,
  CreateRequest,
  Dashboard,
  Requests,
  Wallet,
  Home,
  Request,
  NotFound,
} from "./pages";
import routes from "./routes";

function App() {
  return (
    <div>
      <Routes>
        <Route path={routes.AUTH} element={<Auth />} />

        <Route
          path={routes.HOME}
          element={<Navigate to={routes.DASHBOARD} />}
        />

        <Route path={routes.HOME} element={<Home />}>
          <Route path={routes.DASHBOARD} index element={<Dashboard />} />
          <Route path={routes.REQUESTS} element={<Request />}>
            <Route path={routes.REQUESTS} element={<Requests />} />
            <Route path={routes.CREATE_REQUEST} element={<CreateRequest />} />
          </Route>

          <Route path={routes.WALLET} element={<Wallet />} />

          <Route path={routes.BANK_ACCOUNTS} element={<BankAccounts />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
