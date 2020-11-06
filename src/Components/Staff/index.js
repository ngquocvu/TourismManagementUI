import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import JobDetails from "./JobDetails";
import { useRecoilState } from "recoil";
import { darkModeState } from "../../containers/state";

async function Delete(id) {
  fetch("http://localhost:5000/api/staff/deletestaff/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
async function DeleteJobsDetail(id) {
  var selJobsList = new Array();
  fetch("http://localhost:5000/api/staff/UpdateJobDetails/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selJobsList),
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
  const [isDarkMode] = useRecoilState(darkModeState);

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

  useEffect(() => {
    console.log(staffs);
  }, [staffs]);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios("http://localhost:5000/api/staff/getallstaff");
    setIsLoad(true);
    setstaffs(result.data);
    console.log(result.data);
  }

  const updateJobDetails = (staffId, jobDetails) => {
    setstaffs(
      staffs.map((s) => {
        if (s.staffId === staffId) s.jobDetailsList = jobDetails;
        return s;
      })
    );
  };

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={isDarkMode ? "primary" : "secondary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Staff"
        icons={TableIcons}
        //data=staffs.map((d) => ({ ...d }))
        data={staffs}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              var last =
                staffs[Object.keys(staffs)[Object.keys(staffs).length - 1]];
              if (last === undefined) {
                newData.staffId = 1;
              } else {
                newData.staffId = last.staffId + 1;
              }
              console.log(newData.staffId);

              setstaffs([...staffs, newData]);
              Add(newData);
              fetchData();
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
                DeleteJobsDetail(oldData.staffId);
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
            type: "numeric",
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
        detailPanel={[
          {
            tooltip: "Job details",
            render: (rowData) => {
              return (
                <JobDetails
                  className={classes.detailTable}
                  selfJob={rowData.jobDetailsList}
                  staffId={rowData.staffId}
                  fetchStaff={fetchData}
                  onUpdate={updateJobDetails}
                />
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
    </div>
  );
}
export default StaffsTable;
