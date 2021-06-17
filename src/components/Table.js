import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "material-table";

const DataTable = ({ name, url, comments, tags }) => {
  const [data, setData] = useState([]);
  try {
    const data = axios.get("/api/links/").then(response => {

      return response.data;
    });

 
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <MaterialTable
        title="Linkerator"
        columns={[
          { title: "Name", field: "name" },
          { title: "Url", field: "url" },
          { title: "Comments", field: "comments" },
          { title: "Tags", field: "tags" },
        ]}
        data={[{ name: name, url: url, comments: comments, tags: tags }]}
      />
    </div>
  );
};

export default DataTable;
