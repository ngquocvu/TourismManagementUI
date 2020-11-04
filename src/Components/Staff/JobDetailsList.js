import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";

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

async function Edit(id, job) {
  fetch("http://localhost:5000/api/staff/UpdateJobDetails/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });
}
function JobDetailsList({ TableIcons, dataSource }) {
  useEffect(() => {
    fetchData().then(() => {
      console.log(allJobs);
    });
  }, []);

  async function fetchData() {
    const result = await axios("http://localhost:5000/api/job/getalljob");
    setAllJobs(result.data);
  }
  const [allJobs, setAllJobs] = useState([]);
  const [data, setData] = useState([]);
  const [jobs, setJobs] = useState(dataSource.jobDetailsList);
  const isSellectedJob = function (jobId) {
    var isExists = false;
    jobs.forEach((element) => {
      //console.log(element.jobId + " " + jobId);
      //console.log(element.jobId === jobId);
      if (element.jobId === jobId) {
        isExists = true;
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
            <input
              type="checkbox"
              checked={isSellectedJob(rowData.jobId)}
              readOnly
            ></input>
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
