import React, { useState, useEffect } from "react";

import MaterialTable from "material-table";
import { getAllLinks } from "../api/Table";

const DataTable = () => {
  const [links, setLinks] = useState();

  useEffect(() => {
    async function fetchData() {
      const data = await getAllLinks("Activities");
      setLinks(data);
    }

    fetchData();
  }, []);
  const handleClick = () => {};
  return (
    <div>
      <MaterialTable
        title="Linkerator"
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Url",
            field: "url",
            render: (rowData) => (
              <a onClick={handleClick} href={rowData.url}>
                {rowData.url}
              </a>
            ),
          },
          { title: "Comments", field: "comments" },
          {
            title: "Tags",
            field: "tags",
            render: (rowData) => <button>{rowData.tags}</button>,
          },
          { title: "Click Count", field: "count" },
        ]}
        data={links}
        options={{
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
};

export default DataTable;
