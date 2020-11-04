import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import JobDetailsList from "./JobDetailsList";

async function Delete(id) {
  fetch("http://localhost:5000/api/staff/deletestaff/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(staff) {
  fetch("http://localhost:5000/api/staff/Createstaff/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
  });
  console.log(JSON.stringify(staff));
}

async function Edit(id, staff) {
  fetch("http://localhost:5000/api/staff/Updatestaff/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staff),
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

function StaffsTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [staffs, setstaffs] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(staffs);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios("http://localhost:5000/api/staff/getallstaff");
    setIsLoad(true);
    setstaffs(result.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Staff"
        icons={TableIcons}
        data={staffs.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              const last =
                staffs[Object.keys(staffs)[Object.keys(staffs).length - 1]];
              newData.staffId = last.staffId + 1;
              setstaffs([...staffs, newData]);
              Add(newData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...staffs];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setstaffs([...dataUpdate]);
                Edit(oldData.staffId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.staffId);
                setstaffs(
                  staffs.filter((item) => item.staffId !== oldData.staffId)
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
            field: "staffId",
            editable: "never",
          },
          { title: "Fullname", field: "fullName" },
          {
            title: "Gender",
            field: "gender",
          },
          {
            title: "ID Number",
            field: "identityCardNumber",
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
        detailPanel={[
          {
            tooltip: "Job details",
            render: (rowData) => {
              return (
                <div className={classes.detailTable}>
                  <JobDetailsList
                    TableIcons={TableIcons}
                    dataSource={rowData}
                  />
                </div>
              );
            },
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
export default StaffsTable;
