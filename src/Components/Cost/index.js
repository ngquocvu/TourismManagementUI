import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";

async function Delete(id) {
  fetch("http://localhost:5000/api/cost/Deletecost/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(cost) {
  fetch("http://localhost:5000/api/cost/Createcost/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cost),
  });
  console.log(JSON.stringify(cost));
}

async function Edit(id, cost) {
  fetch("http://localhost:5000/api/cost/Updatecost/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cost),
  });
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  header: {
    fontWeight: 900,
  },
  detailTable: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
    background: "#d4d4d4",
  },
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  },
}));

function CostsTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [costs, setcosts] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(costs);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios("http://localhost:5000/api/cost/getallcost");
    setIsLoad(true);
    setcosts(result.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Cost"
        icons={TableIcons}
        data={costs.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              const last =
                costs[Object.keys(costs)[Object.keys(costs).length - 1]];
              newData.costId = last.costId + 1;
              setcosts([...costs, newData]);
              Add(newData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...costs];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setcosts([...dataUpdate]);
                Edit(oldData.costId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.costId);
                setcosts(
                  costs.filter((item) => item.costId !== oldData.costId)
                );
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 100);
            }),
        }}
        columns={[
          {
            title: "ID",
            field: "costId",
            editable: "never",
          },
          { title: "Name", field: "costName" },

          {
            title: "Description",
            field: "description",
          },
        ]}
      />

      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
      />
    </div>
  );
}
export default CostsTable;
