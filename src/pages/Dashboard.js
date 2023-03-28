import React, { useEffect, useState, useCallback } from "react";
import Wrapper from "./Wrapper";
import utils from "../utils";
import axios from "axios";
import NoRequest from "../components/NoRequest";
import Card from "../components/Card";

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser({ ...user });

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
        setRequests([...requests]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const data = {};

    requests.map((request) => {
      const { status } = request;
      const prev = data[status] || 0;
      data[status] = prev + 1;
    });

    setCount(data);
  }, [requests]);

  const displayRequests = (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "30px",
      }}
    >
      <Card title="ALL" body={requests.length} />
      <Card title="COMPLETED" body={count["COMPLETED"] || 0} />
      <Card title="PENDING" body={count["PENDING"] || 0} />
      <Card title="FAILED" body={count["FAILED"] || 0} />
    </div>
  );

  return (
    <Wrapper
      header={{
        title: `Hello, ${user.name} 👋`,
        subtitle: user.email,
      }}
    >
      <h4>TRANSACTIONS OVERVIEW</h4>
      {requests.length > 0 ? displayRequests : <NoRequest />}
    </Wrapper>
  );
};

export default Dashboard;
