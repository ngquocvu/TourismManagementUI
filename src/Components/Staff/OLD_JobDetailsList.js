import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { RowingSharp, Update } from "@material-ui/icons";
import { Checkbox } from "@material-ui/core";

async function Delete(id) {
  fetch("http://localhost:5000/api/staff/DeleteJobDetails/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Add(job) {
  fetch("http://localhost:5000/api/staff/CreateJobDetails/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });
  console.log(JSON.stringify(job));
}

async function Edit(id, jobs) {
  fetch("http://localhost:5000/api/staff/UpdateJobDetails/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobs),
  });
  console.log(JSON.stringify(jobs));
}
function JobDetailsList({ TableIcons, dataSource }) {
  useEffect(() => {
    fetchData().then(() => {});
  }, []);

  async function fetchData() {
    const result = await axios("http://localhost:5000/api/job/getalljob");
    setAllJobs(result.data);
    console.log(result.data);
  }
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState(dataSource.jobDetailsList);
  const [state, setState] = React.useState({});
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const isSellectedJob = function (jobId) {
    var isExists = false;
    jobs.forEach((element) => {
      //console.log(element.jobId + " " + jobId);
      //console.log(element.jobId === jobId);
      if (element.jobId === jobId) {
        isExists = true;
        console.log(element.jobId + jobId);
      }
    });
    return isExists;
  };
  return (
    <MaterialTable
      data={allJobs.map((d) => ({ ...d }))}
      icons={TableIcons}
      title="Job Details"
      columns={[
        {
          title: "",
          render: (rowData) => (
            <Checkbox
              checked={isSellectedJob(rowData.jobId)}
              name={"checkbox" + rowData.jobId}
              onChange={handleChange}
            ></Checkbox>
          ),
        },

        {
          title: "Name",
          field: "jobName",
        },
      ]}
      options={{
        actionsColumnIndex: -1,
      }}
    />
  );
}
export default JobDetailsList;
