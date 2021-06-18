import React, { useState, useEffect } from "react";
import DataTable from "./Table";

import Form from "./Form";
import { getAllLinks } from "../api/Table";

const App = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllLinks();
      setLinks(data);
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <Form {...{ links, setLinks }} />

      <DataTable {...{ links, setLinks }} />
    </div>
  );
};

export default App;
