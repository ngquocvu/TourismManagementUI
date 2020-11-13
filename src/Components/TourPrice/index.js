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
  fetch("http://localhost:5000/api/tourprice/Deletetourprice/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(tourprice) {
  fetch("http://localhost:5000/api/tourprice/Createtourprice/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourprice),
  });
  console.log(JSON.stringify(tourprice));
}

async function Edit(id, tourprice) {
  fetch("http://localhost:5000/api/tourprice/Updatetourprice/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourprice),
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

function TourPricesTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [tourprices, settourprices] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(tourprices);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/tourprice/getalltourprice"
    );
    setIsLoad(true);
    settourprices(result.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Tour Price"
        icons={TableIcons}
        data={tourprices.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              const last =
                tourprices[
                  Object.keys(tourprices)[Object.keys(tourprices).length - 1]
                ];
              newData.tourpriceId = last.tourpriceId + 1;
              settourprices([...tourprices, newData]);
              Add(newData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tourprices];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                settourprices([...dataUpdate]);
                Edit(oldData.tourpriceId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.tourpriceId);
                settourprices(
                  tourprices.filter(
                    (item) => item.tourpriceId !== oldData.tourpriceId
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
            title: "ID",
            field: "tourPriceId",
            editable: "never",
          },
          {
            title: "Price",
            field: "price",
            type: "currency",
            currencySetting: {
              locale: "vn",
              currencyCode: "vnd",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
          },
          {
            title: "Start date",
            field: "startDate",
            initialEditValue: new Date().toISOString(),
            type: "date",
            render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
          {
            title: "End date",
            field: "endDate",
            initialEditValue: new Date().toISOString(),
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.endDate).toDateString(),
            validate: (rowData) =>
              new Date(rowData.endDate) < new Date(rowData.startDate)
                ? "Start date must be after end date!"
                : true,
            render: (rowData) => new Date(rowData.endDate).toDateString(),
          },
        ]}
      />
      <Fab
        aria-label="Add"
        className={classes.fab}
        color={props.isDarkMode ? "dark" : "secondary"}
      >
        <AddIcon />
      </Fab>
      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
      />
    </div>
  );
}
export default TourPricesTable;
