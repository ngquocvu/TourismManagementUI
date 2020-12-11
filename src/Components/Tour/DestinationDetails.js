import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  main: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  grid: {
    margin: theme.spacing(2),
  },
  flexList: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
}));

function DestinationDetails({ tourId, tourName, onUpdate }) {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [selCity, setSelCity] = useState();
  const [selPlace, setSelPlace] = useState();
  const [inOrder, setInOrder] = useState();
  const [errorMessage, setErrorMessage] = useState();

  async function Delete(id) {
    await fetch("http://localhost:5000/api/tour/DeleteTourDetails/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    fetchTourDetails();
  }

  async function Add(location) {
    await fetch("http://localhost:5000/api/tour/CreateTourDetails/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    console.log(JSON.stringify(location));
    fetchTourDetails();
  }

  async function fetchLocation() {
    const result = await axios(
      "http://localhost:5000/api/location/getalllocation"
    );
    setLocations(result.data);
    const unique = [...new Set(result.data.map((item) => item.city))];
    setCities(unique);
  }
  async function fetchTourDetails() {
    const result = await axios(
      "http://localhost:5000/api/tour/gettour/" + tourId
    );
    setDestinations(result.data.tourDetailsList);
  }

  function getSelectedDestination(sellectedCity) {
    setPlaces(
      locations
        .filter(({ city }) => sellectedCity === city)
        .map(({ locationId, locationName }) => ({
          locationId,
          locationName,
        }))
    );
  }
  function onSubmitLocation() {
    const sender = {
      locationId: selPlace,
      tourId: tourId,
    };
    let validated = true;
    destinations.forEach((place) => {
      if (selPlace === place.locationId) {
        setErrorMessage("Duplicate place in tour !");
        validated = false;
      }
    });
    if (validated) {
      setDestinations([...destinations], sender);
      Add(sender);
      setErrorMessage("");
    }
  }

  useEffect(() => {
    fetchLocation();
    fetchTourDetails();
  }, []);

  return (
    <Paper variant="outlined" className={classes.main}>
      <MaterialTable
        title={"Destination of " + tourName}
        icons={TableIcons}
        //data=staffs.map((d) => ({ ...d }))
        data={destinations}
        options={{
          actionsColumnIndex: -1,
        }}
        columns={[
          {
            title: "Place",
            field: "locationId",
            render: (rowData) => {
              var result = "";
              locations.map((l) => {
                if (l.locationId === rowData.locationId)
                  result = l.locationName;
              });
              return result;
            },
          },
        ]}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Delete(oldData.id).then(() => {
                  fetchTourDetails();
                });
                resolve();
              }, 100);
            }),
        }}
      ></MaterialTable>
      <Grid container spacing={3} variant="h5" className={classes.grid}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" component="h2">
            Add A Place
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography component="h5">Select City</Typography>
          <Select
            value={selCity ? selCity : 1}
            onChange={(e) => {
              getSelectedDestination(e.target.value);
              setSelCity(e.target.value);
            }}
          >
            {cities.map((each, index) => (
              <MenuItem value={each}>{(console.log(each), each)}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography component="h5">Select Place</Typography>
          <Typography variant="h6" component="h2"></Typography>
          <Select
            value={selPlace ? selPlace : ""}
            onChange={(e) => {
              setSelPlace(e.target.value);
              console.log(e.target.value);
            }}
          >
            {places.map((each) => (
              <MenuItem value={each.locationId}>{each.locationName}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography component="h6" color="inherit">
            {errorMessage}
          </Typography>
        </Grid>

        <Grid item xs={2} sm={12}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            //onClick={onSubmit}
            color="inherit"
            onClick={() => onSubmitLocation()}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default DestinationDetails;
