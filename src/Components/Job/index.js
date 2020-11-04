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
  fetch("http://localhost:5000/api/job/deletejob/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(job) {
  fetch("http://localhost:5000/api/job/Createjob/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });
  console.log(JSON.stringify(job));
}

async function Edit(id, job) {
  fetch("http://localhost:5000/api/job/Updatejob/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
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
    padding: theme.spacing(2),
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

function JobsTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [jobs, setjobs] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log(jobs);
    });
  }, []);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios("http://localhost:5000/api/job/getalljob");
    setIsLoad(true);
    setjobs(result.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Job"
        icons={TableIcons}
        data={jobs.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              const last =
                jobs[Object.keys(jobs)[Object.keys(jobs).length - 1]];
              newData.jobId = last.jobId + 1;
              setjobs([...jobs, newData]);
              Add(newData);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...jobs];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setjobs([...dataUpdate]);
                Edit(oldData.jobId, newData);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.jobId);
                setjobs(jobs.filter((item) => item.jobId !== oldData.jobId));
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 1000);
            }),
        }}
        columns={[
          {
            title: "ID",
            field: "jobId",
            editable: "never",
          },
          { title: "Name", field: "jobName" },
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
export default JobsTable;
