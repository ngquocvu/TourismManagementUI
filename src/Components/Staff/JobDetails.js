import { Checkbox } from "@material-ui/core";
import { Check } from "@material-ui/icons";
import CheckBox from "@material-ui/core/CheckBox";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SnackbarC from "../SnackBarC";

async function Update(id, jobs) {
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

function JobDetails({ selfJob, staffId }) {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState(selfJob);

  useEffect(() => {
    fetchData();
  }, []);

  const isSellectedJob = function (jobId) {
    var isExists = false;
    jobs.map((element) => {
      if (element.jobId === jobId) {
        isExists = true;
      }
    });
    return isExists;
  };

  async function fetchData() {
    await axios("http://localhost:5000/api/job/getalljob").then((result) => {
      let newData = result.data;
      newData.forEach((job) => {
        job.isChecked = isSellectedJob(job.jobId);
      });
      setAllJobs(newData);
    });
  }

  const handleCheck = (event) => {
    let newData = [...allJobs];
    newData.forEach((job) => {
      if (job.jobName === event.target.name)
        job.isChecked = event.target.checked;
    });
    setAllJobs(newData);
    console.log(newData);
  };

  const onSubmit = () => {
    var selJobsList = new Array();
    allJobs.forEach((job) => {
      if (job.isChecked == true) {
        var sellectedJobs = {
          jobId: job.jobId,
          staffId: staffId,
        };
        selJobsList.push(sellectedJobs);
      }
    });
    Update(staffId, selJobsList);
    alert("Job of Staff Has Been Updated");
  };

  return (
    <div>
      {allJobs.map((eachJob) => (
        <ul>
          <FormControlLabel
            key={eachJob.id}
            control={
              <CheckBox
                checked={eachJob.isChecked}
                name={eachJob.jobName}
                onClick={handleCheck}
              />
            }
            label={eachJob.jobId + " : " + eachJob.jobName}
          />
        </ul>
      ))}
      <ul>
        <Button variant="contained" onClick={onSubmit} href="#outlined-buttons">
          Update
        </Button>
      </ul>
    </div>
  );
}

export default JobDetails;
