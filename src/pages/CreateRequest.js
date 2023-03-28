import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import utils from "../utils";
import routes from "../routes";
import Message from "../components/Message";
import "./CreateRequest.css";

const CreateRequest = () => {
  const [user, setUser] = useState({});
  const [step, setStep] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [wallet, setWallet] = useState({});
  const [accounts, setAccounts] = useState([]);

  const [response, setResponse] = useState({ status: "", message: "" });

  const [selectedExchange, setSelectedExchange] = useState({});
  const [selectedAccount, setSelectedAccount] = useState({});
  const [overview, setOverview] = useState({
    amount: 0,
    currency: "",
    provider: "",
    rate: 0,
    account: "",
  });

  const [newRequest, setNewRequest] = useState({
    targetCurrency: "",
    exchangeId: "",
    amount: 0,
    bankAccountId: "",
    walletId: "",
    traderId: "",
    sourceCurrency: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser({ ...u });

    getWallet(u.id).catch(console.log);
    getAccounts(u.id).catch(console.log);

    getCurrencies();
  }, []);

  const backButton = (
    <button
      onClick={() => {
        navigate(-1);
      }}
    >
      <i className="fa-solid fa-caret-left"></i> Go back
    </button>
  );

  const getCurrencies = useCallback(async () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/currencies`)
      .then((res) => {
        const currencies = res.data.data;
        setCurrencies([...currencies]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setNewRequest((prev) => ({ ...prev, exchangeId: "" }));
  }, [exchanges]);

  const getWallet = useCallback(async (userId) => {
    const credential = localStorage.getItem("credential");

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

  const getExchanges = async (currency) => {
    const credential = localStorage.getItem("credential");

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/exchanges/${currency}`, {
        headers: utils.buildHeaders(credential),
      })
      .then((res) => {
        const exchanges = res.data.data;
        setExchanges([...exchanges]);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "bankAccountId") {
      const found = accounts.filter((account) => account.id == value);
      setSelectedAccount({ ...found[0] });
    }
  };

  const onSelectExchange = (value) => {
    setNewRequest((prev) => ({
      ...prev,
      exchangeId: value.id,
    }));
    setSelectedExchange({ ...value });
  };

  const handleCurrencyChange = (event) => {
    handleChange(event);
    getExchanges(event.target.value);
  };

  const onProceed = (event) => {
    event.preventDefault();

    if (newRequest.exchangeId.length === 0 || newRequest.amount === 0) return;

    setNewRequest((prev) => ({
      ...prev,
      walletId: wallet.id,
      traderId: user.id,
      sourceCurrency: wallet.currency.code,
    }));

    setOverview(() => ({
      amount: newRequest.amount,
      currency: newRequest.targetCurrency,
      provider: selectedExchange.provider.name,
      rate: selectedExchange.rate,
      account: selectedAccount.name,
    }));

    setStep((prev) => prev + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const credential = localStorage.getItem("credential");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/requests`,
        { ...newRequest },
        {
          headers: utils.buildHeaders(credential),
        }
      )
      .then((res) => {
        const request = res.data.data;
        setResponse({ ...request });
        setStep((prev) => prev + 1);
      })
      .catch((err) => console.log(err));
  };

  const checkoutStep = (
    <div className="Overview">
      <h4 style={{ margin: 0 }}>OVERVIEW</h4>
      <span className="text-muted" style={{ margin: "5px 0 20px" }}>
        Please confirm your purchase
      </span>
      <ul>
        <li>
          <span className="text-muted">currency:</span>{" "}
          <b>{overview.currency}</b>{" "}
        </li>
        <li>
          <span className="text-muted">amount:</span> <b>{overview.amount}</b>{" "}
        </li>
        <li>
          <span className="text-muted">rate:</span> <b>{overview.rate}</b>{" "}
        </li>
        <li>
          <span className="text-muted">bank account:</span>{" "}
          <b>{overview.account}</b>{" "}
        </li>
        <li>
          <span className="text-muted">provider:</span>{" "}
          <b>{overview.provider}</b>{" "}
        </li>
      </ul>
      <div className="footer">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          style={{ marginRight: "20px" }}
          className="btn-outline"
        >
          <i className="fa-solid fa-pen"></i> Edit
        </button>
        <button onClick={handleSubmit}>Confirm and submit</button>
      </div>
    </div>
  );

  const displayExchanges =
    exchanges.length > 0 ? (
      <div style={{ marginBottom: "30px" }}>
        <p
          style={{
            color: "blue",
            margin: "20px 0",
          }}
        >
          Available offers for {newRequest.targetCurrency}
        </p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => (
              <tr
                key={exchange.id}
                onClick={() => onSelectExchange(exchange)}
                value={exchange.id}
                className={`cursor-pointer ${
                  newRequest.exchangeId === exchange.id ? "selected" : ""
                }`}
              >
                <td>{exchange.provider.name}</td>
                <td
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {exchange.rate}
                  {newRequest.exchangeId === exchange.id ? (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: "white" }}
                    ></i>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p style={{ color: "red", margin: "20px 0", fontWeight: "bold" }}>
        No offers available for {newRequest.targetCurrency}..
      </p>
    );

  const createRequest =
    accounts.length > 0 ? (
      <>
        <p className="text-muted" style={{ marginBottom: "50px" }}>
          Fill in the required fields to create a new transaction. Be sure to
          provide accurate information to ensure timely and efficient processing
          of your transaction.
        </p>
        <form>
          <label htmlFor="targetCurrency">
            Currency{" "}
            <span className="text-muted">
              (what currency do you want to purchase?)
            </span>
            <select
              id="targetCurrency"
              name="targetCurrency"
              value={newRequest.targetCurrency}
              onChange={handleCurrencyChange}
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
          </label>

          {newRequest.targetCurrency.length > 0 ? (
            <div style={{ margin: "20px 0" }}>
              <label htmlFor="exchange">{displayExchanges}</label>

              <label>
                Amount:{" "}
                <input
                  id="amount"
                  type="number"
                  value={newRequest.amount}
                  name="amount"
                  onChange={handleChange}
                  step=".01"
                  min={0}
                />
              </label>

              <div style={{ margin: "20px 0 40px" }}>
                <label htmlFor="bankAccountId">
                  Bank Account:
                  <select
                    id="bankAccountId"
                    name="bankAccountId"
                    value={newRequest.bankAccountId}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">
                      -- select bank account --{" "}
                    </option>

                    {accounts.length > 0
                      ? accounts.map((account) => (
                          <option value={account.id} key={account.id}>
                            {`${account.name} (${account.currency.code})`}
                          </option>
                        ))
                      : ""}
                  </select>
                </label>
              </div>

              <button className="btn-secondary" onClick={onProceed}>
                Proceed
              </button>
            </div>
          ) : (
            <p
              style={{
                color: "red",
                margin: "20px 0",
                fontWeight: "bold",
              }}
            >
              Select a currency to see available offers...
            </p>
          )}
        </form>
      </>
    ) : (
      <div>
        You currently have no bank account to trade into. Visit your{" "}
        <Link to={routes.BANK_ACCOUNTS}>bank accounts page</Link> to connect
        one.
      </div>
    );

  return (
    <Wrapper
      header={{
        nav: backButton,
        title: "Create Transaction",
      }}
    >
      {step === 0 ? (
        createRequest
      ) : step === 1 ? (
        checkoutStep
      ) : step === 2 ? (
        <Message status={response.status} text={response.message} />
      ) : (
        "This page isn't working"
      )}
    </Wrapper>
  );
};

export default CreateRequest;
