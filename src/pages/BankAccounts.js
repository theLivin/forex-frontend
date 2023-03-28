import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import axios from "axios";
import utils from "../utils";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: "", currency: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getAccounts(user.id).catch(console.log);
    getCurrencies();
  }, []);

  const getAccounts = useCallback(async (userId) => {
    const credential = await localStorage.getItem("credential");

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/traders/${userId}/bank-accounts`,
        {
          headers: utils.buildHeaders(credential),
        }
      )
      .then((res) => {
        const accounts = res.data.data;
        accounts.reverse();
        setAccounts([...accounts]);
      })
      .catch((err) => console.log(err));
  }, []);

  const getCurrencies = useCallback(async () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/currencies`)
      .then((res) => {
        const currencies = res.data.data;
        setCurrencies([...currencies]);
      })
      .catch((err) => console.log(err));
  }, []);

  const displayAccounts = (
    <table style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Currency</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.name}</td>
            <td>{account.currency.code}</td>
            <td>{account.balance ? account.balance.toFixed(2) : "0.00"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const credential = localStorage.getItem("credential");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/traders/${user.id}/bank-accounts`,
        { ...newAccount },
        {
          headers: utils.buildHeaders(credential),
        }
      )
      .then((res) => {
        const account = res.data.data;
        setAccounts((prev) => [account, ...prev]);
        setNewAccount({ name: "", currency: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    setNewAccount((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const connectAccount = (
    <div style={{ width: "40%", marginTop: "50px" }}>
      <h4 style={{ margin: "0", marginBottom: "15px" }}>ADD ACCOUNT</h4>
      <form onSubmit={handleSubmit}>
        <input
          id="name"
          type="text"
          value={newAccount.name}
          name="name"
          placeholder="account name"
          onChange={handleChange}
          required
        />

        <select
          id="currency"
          name="currency"
          value={newAccount.currency}
          onChange={handleChange}
          required
        >
          <option disabled value="">
            {" "}
            -- select a currency --{" "}
          </option>
          {currencies.length > 0 ? (
            currencies.map((currency) => (
              <option value={currency.code} key={currency.code}>
                {`${currency.name} (${currency.country})`}
              </option>
            ))
          ) : (
            <option value="GHS">Ghana Cedi (Ghana)</option>
          )}
        </select>
        <button
          style={{ marginTop: "20px" }}
          className="btn-secondary"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );

  return (
    <Wrapper header={{ title: "Bank Accounts" }}>
      {accounts.length > 0 ? displayAccounts : "No data available..."}
      {connectAccount}
    </Wrapper>
  );
};

export default BankAccounts;
