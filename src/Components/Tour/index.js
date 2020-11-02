import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState, useEffect, useCallback } from "react";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
function ToursTable(props) {
  const [data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [Tours, setTours] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const handleSnackBarOnClose = useCallback(() => {
    setIsSnackBarOpen(false);
  }, [false]);
  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 630,
    },
    title: {
      flex: "1 1 100%",
      textAlign: "left",
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      fontWeight: "bold",
    },
    header: {
      fontWeight: 900,
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
  const classes = useStyles();
  useEffect(() => {
    async function fetchData() {
      setIsLoad(false);
      const result = await axios("http://localhost:5000/api/Tour/getallTour");
      setTours(result.data);
      console.log(data);
      setIsLoad(true);
    }
    fetchData();
  }, Tours);
  async function Delete(id) {
    fetch("http://localhost:5000/api/Tour/deleteTour/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
  async function Add() {
    fetch("http://localhost:5000/api/Tour/CreateTour/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TourId: "",
        fullName: "",
        dateOfBirhth: "01/02/1999",
      }),
    });
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <Paper>
        <TableContainer component={Paper}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Tour Table
          </Typography>
          <Table aria-label="sticky table" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Type of tourism</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Tours.map((Tour) => (
                <TableRow key={Tour.tourId}>
                  <TableCell component="th" scope="row">
                    {Tour.tourId}
                  </TableCell>
                  <TableCell align="right">{Tour.tourName}</TableCell>
                  <TableCell align="right">{Tour.description}</TableCell>
                  <TableCell align="right">{Tour.typesOfTourismId}</TableCell>
                  <TableCell align="right">{Tour.tourPriceId}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        Add();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        Delete(Tour.tourId);
                        setTours(
                          Tours.filter((item) => item.tourId !== Tour.tourId)
                        );
                        setIsSnackBarOpen(true);
                        setTimeout(() => {
                          setIsSnackBarOpen(false);
                        }, 5000);
                      }}
                    >
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
export default ToursTable;
