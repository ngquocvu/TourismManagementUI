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
  fetch("http://localhost:5000/api/location/Deletelocation/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(location) {
  fetch("http://localhost:5000/api/location/CreateLocation/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });
  console.log(JSON.stringify(location));
}

async function Edit(id, location) {
  fetch("http://localhost:5000/api/location/Updatelocation/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
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

function LocationsTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [locations, setlocations] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(locations);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/location/getalllocation"
    );
    setIsLoad(true);
    setlocations(result.data);
  }

  async function Add(location) {
    fetch("http://localhost:5000/api/location/CreateLocation/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    fetchData();
    console.log(JSON.stringify(location));
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Location"
        icons={TableIcons}
        data={locations.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setIsLoad(true);
              //setlocations([...locations, newData]);
              Add(newData).then(() =>
                setTimeout(function () {
                  fetchData();
                  setIsLoad(false);
                }, 1000)
              );

              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...locations];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setlocations([...dataUpdate]);
                Edit(oldData.locationId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.locationId);
                setlocations(
                  locations.filter(
                    (item) => item.locationId !== oldData.locationId
                  )
                );
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 100);
            }),
        }}
        columns={[
          {
            title: "Name",
            field: "locationName",
            validate: (rowData) =>
              rowData.locationName < 1
                ? "Location Name must not be empty"
                : true,
          },
          {
            title: "City",
            field: "city",
            validate: (rowData) =>
              rowData.country < 1 ? "City Name must not be empty" : true,
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
export default LocationsTable;
