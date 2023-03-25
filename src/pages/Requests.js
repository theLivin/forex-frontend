import React, { useState, useEffect, useCallback } from "react";
import routes from "../routes";
import Wrapper from "./Wrapper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import utils from "../utils";
import NoRequest from "../components/NoRequest";

const Requests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getRequests(user.id).catch(console.log);
  }, []);

  const getRequests = useCallback(async (userId) => {
    const credential = await localStorage.getItem("credential");

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/traders/${userId}/requests`, {
        headers: utils.buildHeaders(credential),
      })
      .then((res) => {
        const requests = res.data.data.content;
        requests.reverse();
        setRequests([...requests]);
      })
      .catch((err) => console.log(err));
  }, []);

  const button = (
    <button onClick={() => navigate(routes.CREATE_REQUEST)}>
      Create request
    </button>
  );

  const displayRequests = (
    <table style={{ marginTop: "30px" }}>
      <thead>
        <tr>
          <th>Source Currency</th>
          <th>Target Currency</th>
          <th>Amount</th>
          <th>Bank Account</th>
          <th>Rate</th>
          <th>Provider</th>
          <th>Status</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>{request.sourceCurrency.code}</td>
            <td>{request.targetCurrency.code}</td>
            <td>{request.amount ? request.amount.toFixed(2) : "0.00"}</td>
            <td>{request.bankAccount.name}</td>
            <td>{request.exchange.rate}</td>
            <td>{request.exchange.provider.name}</td>
            <td>{request.status}</td>
            <td>{request.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Wrapper
      header={{
        title: "Requests",
        action: button,
      }}
    >
      {requests.length > 0 ? displayRequests : <NoRequest />}
    </Wrapper>
  );
};

export default Requests;
