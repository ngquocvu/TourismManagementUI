import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TableIcons from "../utilities/TableIcons";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import MaterialTable from "material-table";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import axios from "axios";
import { StarRate } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  main: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  grid: {
    margin: theme.spacing(2),
  },
}));

function PriceList({ tourId, groupName, onUpdate }) {
  const classes = useStyles();
  const [costs, setCosts] = useState([]);
  const [allPrice, setAllPrice] = useState([]);

  const priceValidate = (date, tourPriceId) => {
    let isValidate = true;
    let formatedDate = new Date(date);
    formatedDate.setHours(0, 0, 0, 0);

    costs.forEach((c) => {
      var startDate = new Date(c.startDate);
      startDate.setHours(0, 0, 0, 0);
      var endDate = new Date(c.endDate);
      startDate.setHours(0, 0, 0, 0);

      if (
        formatedDate <= endDate &&
        formatedDate >= startDate &&
        tourPriceId !== c.tourPriceId
      ) {
        isValidate = false;
      }
    });
    return isValidate;
  };

  const endDateValidate = (sDate, date, tourPriceId) => {
    let isValidate = true;
    let formatedDate = new Date(date);
    let formatedStartDate = new Date(sDate);
    formatedDate.setHours(0, 0, 0, 0);
    formatedStartDate.setHours(0, 0, 0, 0);

    costs.forEach((c) => {
      var startDate = new Date(c.startDate);
      startDate.setHours(0, 0, 0, 0);
      var endDate = new Date(c.endDate);
      endDate.setHours(23, 0, 0, 0);
      if (
        formatedDate <= endDate &&
        formatedDate >= startDate &&
        tourPriceId !== c.tourPriceId
      ) {
        isValidate = false;
      }
      if (
        formatedStartDate < startDate &&
        formatedDate >= endDate &&
        tourPriceId !== c.tourPriceId
      ) {
        isValidate = false;
      }
    });
    return isValidate;
  };

  async function Delete(id) {
    fetch("http://localhost:5000/api/tourPrice/DeleteTourPrice/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async function Edit(id, cost) {
    fetch("http://localhost:5000/api/TourPrice/UpdateTourPrice/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cost),
    });
  }

  const handleBtnClick = () => {
    //mở form thêm cost vào !!
  };

  useEffect(() => {
    fetchAllPrice();
    fetchTourGroupPriceList();
  }, []);

  const fetchAllPrice = async () => {
    const result = await axios(
      "http://localhost:5000/api/TourPrice/GetAllTourPrice"
    );
    setAllPrice(result.data);
    //console.log(result.data);
  };

  async function fetchTourGroupPriceList() {
    const result = await axios(
      "http://localhost:5000/api/tour/gettour/" + tourId
    );
    console.log(result.data.tourPriceList);
    setCosts(result.data.tourPriceList);
  }

  async function Add(tour) {
    fetch("http://localhost:5000/api/tourPrice/CreateTourPrice/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tour),
    });
  }

  return (
    <Paper variant="outlined" className={classes.main}>
      <MaterialTable
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        title={"Price List of " + groupName}
        icons={TableIcons}
        //data=costs.map((d) => ({ ...d }))
        data={costs}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              newData.tourId = tourId;
              var dataUpdate = { ...newData };

              var date = new Date(newData.startDate);
              date.setUTCHours(0, 0, 0, 0);
              dataUpdate.startDate = date;

              var endDate = new Date(newData.startDate);
              endDate.setUTCHours(23, 59, 59, 0);
              dataUpdate.endDate = endDate;

              console.log(dataUpdate.startDate);

              Add(dataUpdate).then(() =>
                setTimeout(function () {
                  fetchTourGroupPriceList();
                }, 1500)
              );
              resolve();
            }, 1500),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...costs];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setCosts([...dataUpdate]);
                const sender = {
                  tourId: newData.tourId,
                  tourPriceId: oldData.tourPriceId,
                  price: newData.price,
                  startDate: newData.startDate,
                  endDate: newData.endDate,
                };

                Edit(oldData.tourPriceId, sender);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Delete(oldData.tourPriceId);
                setCosts(
                  costs.filter(
                    (item) => item.tourPriceId !== oldData.tourPriceId
                  )
                );
                resolve();
              }, 1000);
            }),
        }}
        columns={[
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
            //initialEditValue: new Date().toISOString(),
            //render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
          {
            title: "Start Date",
            field: "startDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.startDate).toDateString(),
            validate: (rowData) =>
              priceValidate(rowData.startDate, rowData.tourPriceId)
                ? true
                : "Duplicate",
          },
          {
            title: "End date",
            field: "endDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.endDate).toDateString(),
            validate: (rowData) =>
              new Date(rowData.endDate) >= new Date(rowData.startDate) &&
              endDateValidate(
                rowData.startDate,
                rowData.endDate,
                rowData.tourPriceId
              )
                ? true
                : "Start date must be after end date and not duplicate!",
          },
        ]}
        localization={{
          header: {
            actions: "",
          },
        }}
      />
    </Paper>
  );
}
export default PriceList;
