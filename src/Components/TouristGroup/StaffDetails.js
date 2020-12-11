import CheckBox from "@material-ui/core/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import { useRecoilState } from "recoil";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { darkModeState } from "../../containers/state";
import ListSubheader from "@material-ui/core/ListSubheader";

async function Update(id, staffs) {
  await fetch(
    "http://localhost:5000/api/touristGroup/UpdateTourDetailsOfStaff/" + id,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffs),
    }
  );
  console.log(JSON.stringify(staffs));
}
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  header: {
    fontWeight: 900,
  },
  main: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  detailTable: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  btn: {
    marginLeft: theme.spacing(2),
  },
  flexList: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
}));

function StaffDetails({ staffList, touristGroupId, onUpdate }) {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [allStaffs, setAllStaffs] = useState([]);
  const [message, setMessage] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [chosenStaffs, setChosenStaffs] = useState([]);
  const [isDarkMode] = useRecoilState(darkModeState);
  const [totalStaff, setTotalStaff] = useState(1);
  const classes = useStyles();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setChosenStaffs(
      staffList.map(({ staffId, touristGroupId }) => ({
        staffId,
        touristGroupId,
      }))
    );
  }, [staffList]);

  const handleSnackBarOnClose = () => {
    setIsSnackBarOpen(false);
  };

  const handleClick = () => {
    setIsSnackBarOpen(true);
    setTimeout(() => {
      setIsSnackBarOpen(false);
    }, 3000);
  };

  async function fetchGroupData() {
    const result = await axios(
      "http://localhost:5000/api/touristgroup/gettouristgroup/" + touristGroupId
    );
    return result.data.touristGroupDetailsOfStaffList;
  }

  async function fetchData() {
    await axios("http://localhost:5000/api/staff/getallstaff").then(
      (result) => {
        setAllStaffs(result.data);
      }
    );
  }

  const handleCheck = (event) => {
    const staffId = parseInt(event.target.name);
    if (chosenStaffs.find((j) => j.staffId === staffId)) {
      setChosenStaffs(chosenStaffs.filter((j) => j.staffId !== staffId));
    } else {
      setChosenStaffs([...chosenStaffs, { touristGroupId, staffId }]);
    }
  };

  const onSubmit = () => {
    setIsLoad(true);
    Update(touristGroupId, chosenStaffs).then(() => {
      fetchGroupData().then((Staffs) => {
        onUpdate(touristGroupId, Staffs);
      });
      setIsLoad(false);
      handleClick();
    });
    setMessage("Staff's jobs has been updated ");
    setIsOpen(false);
  };

  const StaffList = () => (
    <div>
      <ListSubheader component="div" id="nested-list-subheader">
        Staff List ({staffList.length} persons){"   "}
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            color="inherit"
            variant="container    "
            endIcon={<EditIcon />}
            onClick={() => setIsOpen(true)}
            aria-label="Edit Staff"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </ListSubheader>
      <Grid container spacing={2}>
        {staffList.map((c) => (
          <Grid item xs={4}>
            <ListItem>
              <ListItemAvatar>
                <Avatar variant="square">
                  {c.staff.fullName.split(" ").pop().charAt(0)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  c.staff.fullName +
                  " (" +
                  c.staff.jobDetailsList.map((eachJob) => {
                    return eachJob.job.jobName;
                  }) +
                  ")"
                }
              />
            </ListItem>
          </Grid>
        ))}
      </Grid>
      <ListItem></ListItem>
    </div>
  );

  const EditStaff = () => (
    <div>
      <Grid container spacing={2}>
        {allStaffs.map((eachStaff) => (
          <Grid item xs={4} key={eachStaff.staffId}>
            <FormControlLabel
              key={eachStaff.staffId}
              control={
                <CheckBox
                  checked={
                    !!chosenStaffs.find((j) => j.staffId === eachStaff.staffId)
                  }
                  name={eachStaff.staffId}
                  onClick={handleCheck}
                />
              }
              label={
                eachStaff.fullName +
                " (" +
                eachStaff.jobDetailsList.map((eachJob) => {
                  return eachJob.job.jobName;
                }) +
                ")"
              }
            />
          </Grid>
        ))}
        <Grid item xs={3}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onSubmit()}
            color="inherit"
          >
            Update
          </Button>
          <Button
            className={classes.btn}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <Paper variant="outlined" className={classes.main}>
      {isLoad ? (
        <LinearProgress color={isDarkMode ? "primary" : "secondary"} />
      ) : (
        <React.Fragment></React.Fragment>
      )}

      {isOpen === false ? <StaffList /> : <EditStaff />}

      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
        message={message}
      />
    </Paper>
  );
}

export default StaffDetails;
