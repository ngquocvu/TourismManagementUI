import CheckBox from "@material-ui/core/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import Paper from "@material-ui/core/Paper";
import { useRecoilState } from "recoil";
import { darkModeState } from "../../containers/state";

async function Update(id, jobs) {
  await fetch("http://localhost:5000/api/staff/UpdateJobDetails/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobs),
  });
  console.log(JSON.stringify(jobs));
}

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  flexList: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
}));
function JobDetails({ selfJob, staffId, fetchStaff, onUpdate }) {
  const classes = useStyles();
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  // const [jobs] = useState(selfJob);
  const [message, setMessage] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [chosenJobs, setChosenJobs] = useState([]);
  const [isDarkMode] = useRecoilState(darkModeState);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setChosenJobs(
      selfJob.map(({ jobId, staffId }) => ({
        jobId,
        staffId,
      }))
    );
  }, [selfJob]);

  const handleSnackBarOnClose = () => {
    setIsSnackBarOpen(false);
  };

  const handleClick = () => {
    setIsSnackBarOpen(true);
    setTimeout(() => {
      setIsSnackBarOpen(false);
    }, 3000);
  };

  // const isSellectedJob = function (jobId) {
  //   var isExists = false;
  //   jobs.map((element) => {
  //     if (element.jobId === jobId) {
  //       isExists = true;
  //     }
  //   });
  //   return isExists;
  // };

  async function fetchStaffData() {
    const result = await axios(
      "http://localhost:5000/api/staff/getstaff/" + staffId
    );
    return result.data.jobDetailsList;
  }

  async function fetchData() {
    await axios("http://localhost:5000/api/job/getalljob").then((result) => {
      // let newData = result.data;
      // newData.forEach((job) => {
      //   job.isChecked = isSellectedJob(job.jobId);
      // });
      setAllJobs(result.data);
      //console.log(result);
    });
  }

  const handleCheck = (event) => {
    const jobId = parseInt(event.target.name);
    if (chosenJobs.find((j) => j.jobId === jobId)) {
      setChosenJobs(chosenJobs.filter((j) => j.jobId !== jobId));
    } else {
      setChosenJobs([...chosenJobs, { staffId, jobId }]);
    }
  };

  const onSubmit = () => {
    setIsLoad(true);
    Update(staffId, chosenJobs).then(() => {
      fetchStaffData().then((Jobs) => {
        onUpdate(staffId, Jobs);
      });
      setIsLoad(false);
      handleClick();
    });
    setMessage("Staff [" + staffId + "] 's job has been updated ");

    //fetchStaff();
  };

  return (
    <Paper variant="outlined" className={classes.main}>
      {isLoad ? (
        <LinearProgress color={isDarkMode ? "primary" : "secondary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      {allJobs.map((eachJob) => (
        <ul key={eachJob.jobId}>
          <FormControlLabel
            key={eachJob.jobId}
            control={
              <CheckBox
                checked={!!chosenJobs.find((j) => j.jobId === eachJob.jobId)}
                name={eachJob.jobId}
                onClick={handleCheck}
              />
            }
            label={eachJob.jobName}
          />
        </ul>
      ))}
      <ul>
        <Button
          vvariant="outlined"
          size="small"
          color="secondary"
          onClick={onSubmit}
        >
          Update
        </Button>
      </ul>
      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
        message={message}
      />
    </Paper>
  );
}

export default JobDetails;
