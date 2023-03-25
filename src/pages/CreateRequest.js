import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import utils from "../utils";
import routes from "../routes";
import Message from "../components/Message";

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
    setNewRequest((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    if (event.target.name == "bankAccountId") {
      accounts.map((account) => {
        if (account.id == event.target.value)
          setSelectedAccount({ ...account });
      });
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

    if (newRequest.exchangeId.length == 0 || newRequest.amount == 0) return;

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
    <div>
      amount {overview.amount}
      bank account {overview.account}
      target currency {overview.currency}
      rate {overview.rate}
      provider {overview.provider}
      <button onClick={() => setStep((prev) => prev - 1)}>back</button>
      <button onClick={handleSubmit}>submit</button>
    </div>
  );

  const displayExchanges =
    exchanges.length > 0 ? (
      <div>
        offers for ${newRequest.targetCurrency}
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Rate</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange) => (
              <tr
                key={exchange.id}
                onClick={() => onSelectExchange(exchange)}
                value={exchange.id}
                className={`cursor-pointer ${
                  newRequest.exchangeId == exchange.id ? "selected" : ""
                }`}
              >
                <td>{exchange.provider.name}</td>
                <td>{exchange.rate}</td>
                <td>
                  {newRequest.exchangeId == exchange.id ? <i>selected</i> : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      `no offer for ${newRequest.targetCurrency}`
    );

  const createRequest =
    accounts.length > 0 ? (
      <div>
        <form>
          <label htmlFor="targetCurrency">
            Target Currency:
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
          <br />

          <label htmlFor="exchange">
            {newRequest.targetCurrency.length == 0
              ? "select currency to view offers"
              : displayExchanges}
          </label>
          <br />

          <label htmlFor="amount">
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
          <br />

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
          <br />
          <button onClick={onProceed}>proceed</button>
        </form>
      </div>
    ) : (
      <div>
        You currently have no bank account to trade into. Visit your{" "}
        <Link to={routes.BANK_ACCOUNTS}>bank accounts page</Link> to connect
        one.
      </div>
    );

  const Stepper = () => {
    switch (step) {
      case 0:
        return createRequest;
      case 1:
        return checkoutStep;
      case 2:
        return <Message status={response.status} text={response.message} />;
      default:
        return "This page isn't working";
    }
  };

  return (
    <Wrapper
      header={{
        nav: backButton,
        title: "Create Request",
      }}
    >
      {<Stepper />}
    </Wrapper>
  );
};

export default CreateRequest;
