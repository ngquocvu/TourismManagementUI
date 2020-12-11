import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTable from "material-table";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import TableIcons from "../utilities/TableIcons";
import Chip from "@material-ui/core/Chip";
import CustomDialog from "./CustomDialog";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  dialogControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
}));
function StaffAnalyst() {
  const [Staffs, setStaffs] = useState([]);
  const [chosenStaff, setChosenStaff] = useState({});
  const [chosenStaffID, setChosenStaffID] = useState();
  const [dialogDetails, setDialogDetails] = useState([]);
  const [tourGroup, setTourGroup] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [staffAnalyst, setStaffAnalyst] = useState([]);
  const classes = useStyles();

  async function Get(id) {
    const result = await axios(
      "http://localhost:5000/api/Staff/getStaff/" + id
    );
    setChosenStaff(result.data);
  }

  async function getAllTourGroup() {
    const result = await axios(
      "http://localhost:5000/api/TouristGroup/getallTouristGroup/"
    );
    setTourGroup(result.data);
  }
  const handleCostDetailsBtn = (group) => {
    setOpenDialog(true);
    setDialogDetails(group.costDetailsList);
  };

  useEffect(() => {
    fetchData().then(() => {});
    getAllTourGroup();
  }, []);

  async function fetchData() {
    setStaffs([]);
    //setIsLoad(false);
    const result = await await axios(
      "http://localhost:5000/api/Staff/getallStaff"
    );
    //setIsLoad(true);
    setStaffs(result.data);
  }

  const getStaffAnalyst = (staffId) => {
    const arr = [];
    tourGroup.forEach((group) => {
      group.touristGroupDetailsOfStaffList.forEach((staffInfo) => {
        if (staffInfo.staffId === staffId) {
          arr.push({
            groupName: group.groupName,
            tourName: group.tour.tourName,
          });
        }
        setStaffAnalyst(arr);
      });
    });
  };
  return (
    <div className={classes.root}>
      <CustomDialog
        className={classes.dialogControl}
        title="Cost details"
        details={dialogDetails}
        openDialog={openDialog}
        onCloseDialog={() => setOpenDialog(false)}
      />
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel>Choose a Staff</InputLabel>
        <Select
          value={chosenStaffID ? chosenStaffID : ""}
          onChange={(e) => {
            setChosenStaffID(e.target.value);
            Get(e.target.value);
            getStaffAnalyst(e.target.value);
          }}
        >
          {Staffs.map((each) => (
            <MenuItem key={each.staffId} value={each.staffId}>
              {each.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!chosenStaffID ? (
        <div></div>
      ) : (
        <div>
          <Grid container spacing={1} variant="h5" className={classes.root}>
            <Grid item xs={12}>
              <Typography variant="body1" component="h2">
                Staff: {chosenStaff.fullName}
              </Typography>
              <Typography variant="body1" component="h2">
                Number of tour: {staffAnalyst.length}
              </Typography>
              <Typography variant="body1" component="h2">
                Email: {chosenStaff.email}
              </Typography>
              <Typography variant="body1" component="h2">
                Phone: {chosenStaff.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Group</TableCell>
                      <TableCell align="right">Tour</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffAnalyst.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.groupName}
                        </TableCell>
                        <TableCell align="right">{row.tourName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
export default StaffAnalyst;
