import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import axios from "axios";
import utils from "../utils";
import Card from "../components/Card";

const Wallet = () => {
  const [wallet, setWallet] = useState({});
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getWallet(user.id).catch(console.log);
  }, []);

  const getWallet = useCallback(async (userId) => {
    const credential = await localStorage.getItem("credential");

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/traders/${userId}/wallet`, {
        headers: utils.buildHeaders(credential),
      })
      .then((res) => {
        const wallet = res.data.data;
        setWallet({ ...wallet });
      })
      .catch((err) => console.log(err));
  }, []);

  const displayBalance = (
    <Card
      title="BALANCE"
      body={`${wallet.currency ? wallet.currency.code : "?"} ${
        wallet.balance ? wallet.balance.toFixed(2) : "0.00"
      }`}
    />
  );

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const credential = localStorage.getItem("credential");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/traders/${user.id}/wallet`,
        { amount },
        {
          headers: utils.buildHeaders(credential),
        }
      )
      .then((res) => {
        const wallet = res.data.data;
        setWallet({ ...wallet });
      })
      .catch((err) => console.log(err));
  };

  const depositForm = (
    <div style={{ width: "50%" }}>
      <h4 style={{ margin: "0", marginBottom: "15px" }}>DEPOSIT</h4>
      <form onSubmit={handleSubmit}>
        <input
          id="amount"
          type="number"
          value={amount}
          name="amount"
          onChange={handleChange}
          step=".01"
          min={0}
        />
        <button
          style={{ marginTop: "20px" }}
          className="btn-secondary"
          type="submit"
        >
          Deposit
        </button>
      </form>
    </div>
  );

  return (
    <Wrapper header={{ title: "Wallet" }}>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "0.8fr auto",
        }}
      >
        {depositForm}
        {wallet.id ? displayBalance : "No data available..."}
      </div>
    </Wrapper>
  );
};

export default Wallet;
