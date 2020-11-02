import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";

function CustomersTable(props) {
  const [data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const handleSnackBarOnClose = useCallback(() => {
    setIsSnackBarOpen(false);
  }, [false]);
  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 630,
    },
    header: {
      fontWeight: 900,
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
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      setIsLoad(false);
      const result = await axios(
        "http://localhost:5000/api/Customer/getallCustomer"
      );
      setIsLoad(true);
      setCustomers(result.data);
    }
    fetchData();
  }, customers);

  async function Delete(id) {
    fetch("http://localhost:5000/api/customer/deleteCustomer/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async function Add(customer) {
    fetch("http://localhost:5000/api/Customer/CreateCustomer/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });
    console.log(JSON.stringify(customer));
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Customers"
        icons={TableIcons}
        data={customers.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData([...data, newData]);
                newData.customerId = 1;
                Add(newData);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.customerId);
                setCustomers(
                  customers.filter(
                    (item) => item.customerId !== oldData.customerId
                  )
                );
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 10);
            }),
        }}
        columns={[
          {
            title: "ID",
            field: "customerId",
            editable: "never",
          },
          { title: "Fullname", field: "fullName" },
          {
            title: "Gender",
            field: "gender",
          },
          {
            title: "Date Of Birth",
            field: "dateOfBirhth",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.dateOfBirhth).toDateString(),
          },
          {
            title: "phone Number",
            field: "phoneNumber",
          },
          {
            title: "Email",
            field: "email",
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
export default CustomersTable;
