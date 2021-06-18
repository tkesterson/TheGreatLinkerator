import React from "react";

import MaterialTable from "material-table";
import { addClickCount } from "../api/Table";

const DataTable = ({ links, setLinks }) => {
  const clickHandler = async (id, count) => {
    const response = await addClickCount(id, count);

    if (!response.error) {
      const newArray = [...links].map((l) => {
        if (l.id === id) {
          l.count++;
        }
        return l;
      });

      setLinks(newArray);
    } else {
      alert(response.message);
    }
  };
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
              <a
                onClick={() => clickHandler(rowData.id, rowData.count)}
                href={rowData.url}
              >
                {rowData.url}
              </a>
            ),
          },
          { title: "Comments", field: "comments" },
          {
            title: "Tags",
            field: "tags",
            render: (rowData) => rowData.tags.map((tag) => tag.tagname + " "),
          },
          { title: "Click Count", field: "count" },
        ]}
        data={links}
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        options={{
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
};

export default DataTable;
