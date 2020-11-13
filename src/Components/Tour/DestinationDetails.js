import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TableIcons from "../utilities/TableIcons";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import MaterialTable from "material-table";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
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

function DestinationDetails({ tourDetails, tourId, tourName, onUpdate }) {
  const classes = useStyles();
  const [destinations, setDestinations] = useState(tourDetails);
  const [destinationType, setDestinationType] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedCity, setSelectedCity] = useState();

  async function Delete(id) {
    fetch(
      "http://localhost:5000/api/touristgroup/DeleteDestinationDetails/" + id,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  }

  async function Add(location) {
    fetch("http://localhost:5000/api/touristgroup/CreateDestinationDetails/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    console.log(JSON.stringify(location));
  }

  async function Edit(id, destination) {
    fetch(
      "http://localhost:5000/api/touristgroup/UpdateDestinationDetails/" + id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(destination),
      }
    );
  }

  async function fetchLocation() {
    //setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/location/getalllocation"
    );
    //setIsLoad(true);
    const unique = [...new Set(result.data.map((item) => item.city))];
    setLocations(unique);
    console.log(unique);
  }

  async function getSelectedDestination(city) {
    console.log("definde: " + city);
    const result = await axios(
      "http://localhost:5000/api/location/getalllocation?city=" +
        city.toLowerCase()
    );
    //setIsLoad(true);
    setSelectedDestination(result.data);
    setSelectedCity(city);
  }

  useEffect(() => {
    fetchLocation();
  }, []);
  const handleBtnClick = () => {
    //mở form thêm destination vào !!
  };

  return (
    <Paper variant="outlined" className={classes.main}>
      {tourDetails.map((c) => {
        console.log(c.destination);
      })}
      <MaterialTable
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        title={"Destinations of " + tourName}
        icons={TableIcons}
        //data=destinations.map((d) => ({ ...d }))
        data={destinations}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              var last =
                destinations[
                  Object.keys(destinations)[
                    Object.keys(destinations).length - 1
                  ]
                ];
              if (last === undefined) {
                newData.id = 1;
              } else {
                newData.id = last.id + 1;
              }
              newData.touristGroupId = tourId;
              console.log(newData);
              setDestinations([...destinations, newData]);
              Add(newData);

              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...destinations];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDestinations([...dataUpdate]);
                console.log(newData);
                const sender = {
                  destinationDetailsName: newData.destinationDetailsName,
                  destinationId: newData.destinationId,
                  id: newData.id,
                  price: newData.price,
                  touristGroupId: newData.touristGroupId,
                };
                Edit(oldData.id, sender).then(() => {
                  onUpdate(newData.touristGroupId, dataUpdate);
                });
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Delete(oldData.id);
                setDestinations(
                  destinations.filter((item) => item.id !== oldData.id)
                );
                resolve();
              }, 1000);
            }),
        }}
        columns={[
          {
            title: "City",
            field: "city",
            type: "string",
            render: (rowData) =>
              destinationType.map((each) => {
                if (each.destinationId === rowData.destinationId)
                  return each.destinationName;
              }),
            editComponent: (t) => (
              <Select
                value={selectedCity}
                onChange={(e) => {
                  getSelectedDestination(e.target.value);
                }}
              >
                {locations.map((each, index) => (
                  <MenuItem value={each}>{(console.log(each), each)}</MenuItem>
                ))}
              </Select>
            ),
          },
          {
            title: "Place",
            field: "locationId",
            type: "string",
            render: (rowData) =>
              destinationType.map((each) => {
                if (each.destinationId === rowData.destinationId)
                  return each.destinationName;
              }),
            editComponent: (t) => (
              <Select
                value={t.value}
                onChange={(e) => {
                  t.onChange(e.target.value);
                  console.group(e.target.value);
                }}
              >
                {selectedDestination.map((each) => (
                  <MenuItem value={each.locationId}>
                    {each.locationName}
                  </MenuItem>
                ))}
              </Select>
            ),
          },
        ]}
        localization={{
          header: {
            actions: "",
          },
        }}
      />
      <Grid container spacing={1} variant="h5" className={classes.grid}>
        <Grid item xs={2}></Grid>
        <Grid item xs={2} sm={6}>
          <Typography variant="h6" component="h2"></Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default DestinationDetails;
