import React, { useState, useEffect } from "react";
import DataTable from "./Table";
import { getSomething } from "../api";
import Form from "./Form";

const App = () => {
  const [message, setMessage] = useState("");

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
      <h1>Hello, World!</h1>
      <h2>{message}</h2>
      <Form />
    
        <DataTable />
      
    </div>
  );
};

export default App;
