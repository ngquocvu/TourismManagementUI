import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import TableIcon from "../utilities/TableIcons";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";

async function Delete(id) {
  await fetch(
    "http://localhost:5000/api/TypesOfTourism/DeleteTypesOfTourism/" + id,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
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

  async function Add(location) {
    await fetch(
      "http://localhost:5000/api/TypesOfTourism/CreateTypesOfTourism/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      }
    );
    fetchData();
  }
  async function Edit(id, destination) {
    await fetch(
      "http://localhost:5000/api/TypesOfTourism/UpdateTypesOfTourism/" + id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(destination),
      }
    );
    fetchData();
  }

  return (
    <div>
      <MaterialTable
        title="Type"
        data={types.map((d) => ({ ...d }))}
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
              setTimeout(() => {
                console.log(types);
                setTypes([...types], newData);
                Add(newData).then(() =>
                  setTimeout(function () {
                    fetchData();
                    setIsLoad(false);
                  }, 1000)
                );

                resolve();
              }, 0);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                //const dataUpdate = [...types];
                // const index = oldData.tableData.id;
                // dataUpdate[index] = newData;
                //setTypes([...dataUpdate]);
                //console.log(newData);
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
