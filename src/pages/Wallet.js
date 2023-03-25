import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import axios from "axios";
import utils from "../utils";

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
    <div>
      Balance:{" "}
      {`${wallet.currency ? wallet.currency.code : "?"} ${
        wallet.balance ? wallet.balance.toFixed(2) : "??"
      }`}
    </div>
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
    <div>
      Deposit:{" "}
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
        <button type="submit">submit</button>
      </form>
    </div>
  );

  return (
    <Wrapper header={{ title: "Wallet" }}>
      {wallet.id ? displayBalance : "no data available"}

      {depositForm}
    </Wrapper>
  );
};

export default Wallet;
