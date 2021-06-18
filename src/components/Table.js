import React, { Fragment } from "react";

import MaterialTable from "material-table";
import { addClickCount } from "../api/Table";
import { Link } from "@material-ui/core";

const DataTable = ({ links, setLinks }) => {
  const handleTagClick = (evt) => {
    evt.preventDefault();
  };

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
              <Link
                onClick={() => clickHandler(rowData.id, rowData.count)}
                href={rowData.url}
              >
                {rowData.url}
              </Link>
            ),
          },
          { title: "Comments", field: "comments" },
          {
            title: "Tags",
            field: "tags",

            render: (rowData) =>
              rowData.tags.map((tag) => {
                return (
                  <Fragment key={tag.tagname}>
                    <Link href={tag.tagname} onClick={handleTagClick}>
                      #{tag.tagname}
                    </Link>
                    <br></br>
                  </Fragment>
                );
              }),
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
