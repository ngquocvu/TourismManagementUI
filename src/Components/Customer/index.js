import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import { useRecoilState } from "recoil";
import { darkModeState } from "../../containers/state";

async function Delete(id) {
  fetch("http://localhost:5000/api/customer/deletecustomer/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(customer) {
  fetch("http://localhost:5000/api/customer/Createcustomer/1", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  console.log(JSON.stringify(customer));
}

async function Edit(id, customer) {
  fetch("http://localhost:5000/api/customer/Updatecustomer/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
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

function CustomersTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [customers, setcustomers] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [isDarkMode] = useRecoilState(darkModeState);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(customers);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/customer/getallcustomer"
    );
    setIsLoad(true);
    setcustomers(result.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Customer"
        icons={TableIcons}
        data={customers.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              var last =
                customers[
                  Object.keys(customers)[Object.keys(customers).length - 1]
                ];
              if (last === undefined) {
                newData.customerId = 1;
              } else {
                newData.customerId = last.customerId + 1;
              }
              console.log(newData.customerId);

              setcustomers([...customers, newData]);
              Add(newData).then(fetchData());
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...customers];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setcustomers([...dataUpdate]);
                Edit(oldData.customerId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.customerId);
                setcustomers(
                  customers.filter(
                    (item) => item.customerId !== oldData.customerId
                  )
                );
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 1000);
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
            type: "string",
          },
          {
            title: "ID Number",
            field: "identityCardNumber",
            type: "string",
          },
          {
            title: "Date Of Birth",
            field: "dateOfBirhth",
            type: "string",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.dateOfBirhth).toDateString(),
          },
          {
            title: "phone Number",
            field: "phoneNumber",
            type: "string",
          },
          {
            title: "Email",
            field: "email",
            type: "string",
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
