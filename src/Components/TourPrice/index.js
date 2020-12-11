import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TableIcons from "../utilities/TableIcons";

async function Delete(id) {
  fetch("http://localhost:5000/api/tourPrice/Deletetourprice/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(tourPrice) {
  fetch("http://localhost:5000/api/tourPrice/Createtourprice/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourPrice),
  });
  console.log(JSON.stringify(tourPrice));
}

async function Edit(id, tourPrice) {
  fetch("http://localhost:5000/api/tourPrice/Updatetourprice/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tourPrice),
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
  const [tour, setTour] = useState([]);
  const [tourPrices, setTourPrices] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  function getTourName(tourId) {
    let name;
    tour.forEach((ele) => {
      if (ele.tourId === tourId) {
        console.log(ele.tourName);
        name = ele.tourName;
      }
    });
    return name;
  }

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(tourPrices);
    });
    fetchTourData();
  }, []);
  async function fetchTourData() {
    const result = await axios("http://localhost:5000/api/tour/getalltour");
    return setTour(result.data);
  }

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/tourPrice/getalltourprice"
    );
    setIsLoad(true);
    setTourPrices(result.data);
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
        data={tourPrices.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTourPrices([...tourPrices, newData]);
              Add(newData).then(fetchData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tourPrices];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setTourPrices([...dataUpdate]);
                const sender = {
                  tourPriceId: oldData.tourPriceId,
                  tourId: newData.tourId,
                  startDate: newData.startDate,
                  endDate: newData.endDate,
                  price: newData.price,
                };
                console.log(sender);
                Edit(oldData.tourPriceId, sender);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.tourPriceId);
                setTourPrices(
                  tourPrices.filter(
                    (item) => item.tourPriceId !== oldData.tourPriceId
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
            title: "Tour Name",
            field: "tourId",
            type: "numeric",
            editComponent: (t) => (
              <Select
                value={t.value}
                onChange={(e) => {
                  t.onChange(e.target.value);
                  console.group(e.target.value);
                }}
              >
                {tour.map((each) => (
                  <MenuItem value={each.tourId}>{each.tourName}</MenuItem>
                ))}
              </Select>
            ),
            render: (rowData) => {
              return getTourName(rowData.tourId);
            },
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
            initialEditValue: () => {
              var d = new Date();
              d.setHours(0, 0, 0, 0);
              return d.toISOString();
            },
            type: "datetime",
            render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
          {
            title: "End date",
            field: "endDate",
            initialEditValue: () => {
              var d = new Date();
              d.setHours(1, 1, 1, 1);
              return d.toISOString();
            },
            type: "datetime",
            render: (rowData) => new Date(rowData.endDate).toDateString(),
            validate: (rowData) =>
              new Date(rowData.endDate) < new Date(rowData.startDate)
                ? "Start date must be after end date!"
                : true,
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
export default TourPricesTable;
