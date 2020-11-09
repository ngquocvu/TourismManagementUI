import CheckBox from "@material-ui/core/CheckBox";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { darkModeState } from "../../containers/state";
import ListSubheader from "@material-ui/core/ListSubheader";

async function Update(id, customers) {
  await fetch(
    "http://localhost:5000/api/touristGroup/UpdateTourDetailsOfCustomer/" + id,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customers),
    }
  );
  console.log(JSON.stringify(customers));
}
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  header: {
    fontWeight: 900,
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

function CustomerDetails({ customerList, touristGroupId, onUpdate }) {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [message, setMessage] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [chosenCustomers, setChosenCustomers] = useState([]);
  const [isDarkMode] = useRecoilState(darkModeState);
  const [totalCustomer, setTotalCustomer] = useState(1);
  const classes = useStyles();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setChosenCustomers(
      customerList.map(({ customerId, touristGroupId }) => ({
        customerId,
        touristGroupId,
      }))
    );
  }, [customerList]);

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
    return result.data.touristGroupDetailsOfCustomerList;
  }

  async function fetchData() {
    await axios("http://localhost:5000/api/customer/getallcustomer").then(
      (result) => {
        setAllCustomers(result.data);
      }
    );
  }

  const handleCheck = (event) => {
    const customerId = parseInt(event.target.name);
    if (chosenCustomers.find((j) => j.customerId === customerId)) {
      setChosenCustomers(
        chosenCustomers.filter((j) => j.customerId !== customerId)
      );
    } else {
      setChosenCustomers([...chosenCustomers, { touristGroupId, customerId }]);
    }
  };

  const onSubmit = () => {
    setIsLoad(true);
    Update(touristGroupId, chosenCustomers).then(() => {
      fetchGroupData().then((Customers) => {
        onUpdate(touristGroupId, Customers);
      });
      setIsLoad(false);
      handleClick();
    });
    setMessage("Staff [" + touristGroupId + "] 's customer has been updated ");
    setIsOpen(false);
  };

  return (
    <div>
      {isLoad ? (
        <LinearProgress color={isDarkMode ? "primary" : "secondary"} />
      ) : (
        <React.Fragment></React.Fragment>
      )}

      {isOpen === false ? (
        <div>
          <ListSubheader component="div" id="nested-list-subheader">
            Customer List
          </ListSubheader>
          <List
            className={classes.flexList}
            component="nav"
            aria-label="main mailbox folders"
          >
            {customerList.map((c) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar variant="square">
                    {c.customer.fullName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={c.customer.fullName} />
              </ListItem>
            ))}
          </List>
          <ListItem>
            <Button
              size="small"
              variant="contained"
              color="primary"
              endIcon={<EditIcon />}
              onClick={() => setIsOpen(true)}
              color="secondary"
            >
              Edit
            </Button>
          </ListItem>
        </div>
      ) : (
        <React.Fragment>
          {allCustomers.map((eachCustomer) => (
            <ul key={eachCustomer.customerId}>
              <FormControlLabel
                key={eachCustomer.customerId}
                control={
                  <CheckBox
                    checked={
                      !!chosenCustomers.find(
                        (j) => j.customerId === eachCustomer.customerId
                      )
                    }
                    name={eachCustomer.customerId}
                    onClick={handleCheck}
                  />
                }
                label={eachCustomer.fullName}
              />
            </ul>
          ))}
          <ul>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={onSubmit}
              color="secondary"
            >
              Update
            </Button>
            <Button
              className={classes.btn}
              size="small"
              variant="contained"
              color="primary"
              color="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </ul>
        </React.Fragment>
      )}

      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
        message={message}
      />
    </div>
  );
}

export default CustomerDetails;
