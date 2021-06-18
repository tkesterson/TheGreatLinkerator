import React, { useState, useEffect } from "react";
import DataTable from "./Table";
import { getSomething } from "../api";
import Form from "./Form";
import { getAllLinks } from "../api/Table";

const App = () => {
  const [message, setMessage] = useState("");

  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllLinks();
      setLinks(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    getSomething()
      .then((response) => {
        setMessage(response.message);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  });

  return (
    <div className="App">
      <h2>{message}</h2>
      <Form {...{ links, setLinks }} />

      <DataTable {...{ links, setLinks }} />
    </div>
  );
};

export default App;
