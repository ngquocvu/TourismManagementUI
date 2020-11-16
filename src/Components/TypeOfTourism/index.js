import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import TableIcon from "../utilities/TableIcons";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";

async function Delete(id) {
  fetch("http://localhost:5000/api/TypesOfTourism/DeleteTypesOfTourism/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(location) {
  fetch("http://localhost:5000/api/TypesOfTourism/CreateTypesOfTourism/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });
  console.log(JSON.stringify(location));
}

async function Edit(id, destination) {
  fetch("http://localhost:5000/api/TypesOfTourism/UpdateTypesOfTourism/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destination),
  });
}

function TypeOfTourism() {
  const [types, setTypes] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    fetchData().then(() => {
      console.log(types);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/TypesOfTourism/getall"
    );
    setIsLoad(true);
    setTypes(result.data);
  }

  return (
    <div>
      <MaterialTable
        data={types}
        columns={[
          {
            field: "typeName",
            title: "Name",
          },
          {
            field: "description",
            title: "Description",
          },
        ]}
        icons={TableIcon}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              var last =
                types[Object.keys(types)[Object.keys(types).length - 1]];
              if (last === undefined) {
                newData.typesOfTourismId = 1;
              } else {
                newData.typesOfTourismId = last.typesOfTourismId + 1;
              }

              setTypes([...types, newData]);
              Add(newData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...types];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                const Sender = {};
                setTypes([...dataUpdate]);
                console.log("new Data");
                console.log(newData);
                Edit(oldData.typesOfTourismId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Delete(oldData.typesOfTourismId);
                setTypes(
                  types.filter(
                    (item) => item.typesOfTourismId !== oldData.typesOfTourismId
                  )
                );
                resolve();
              }, 100);
            }),
        }}
        localization={{
          header: {
            actions: "",
          },
        }}
        options={{
          actionsColumnIndex: -1,
        }}
      ></MaterialTable>
    </div>
  );
}
export default TypeOfTourism;
