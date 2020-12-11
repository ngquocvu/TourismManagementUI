import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTable from "material-table";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import TableIcons from "../utilities/TableIcons";
import Chip from "@material-ui/core/Chip";
import CustomDialog from "./CustomDialog";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
    minHeight: 140,
  },
  dialogControl: {
    margin: theme.spacing(1),
    minWidth: 420,
  },
}));
function Analyst() {
  const [tours, setTours] = useState([]);
  const [touristGroups, setTouristGroup] = useState([]);
  const [chosenTour, setChosenTour] = useState();
  const [dialogDetails, setDialogDetails] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const classes = useStyles();

  async function Get(id) {
    const result = await axios(
      "http://localhost:5000/api/touristgroup/getalltouristgroupbytourId/" + id
    );
    setTouristGroup(result.data);
    console.log(result.data);
  }
  const handleCostDetailsBtn = (group) => {
    console.log(group.costDetailsList);
    setOpenDialog(true);
    setDialogDetails(group.costDetailsList);
  };

  useEffect(() => {
    fetchData().then(() => {});
  }, []);
  const getTotalCost = () => {
    var formatter = new Intl.NumberFormat("vn-VN", {
      locale: "vn",
      currencyCode: "vnd",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    let total = 0;
    touristGroups.forEach((rowData) => {
      total =
        rowData.touristGroupDetailsOfCustomerList.length *
          rowData.priceForTouristGroup -
        rowData.totalCost +
        total;
    });
    return formatter.format(total) + " đ";
  };

  async function fetchData() {
    setTours([]);
    //setIsLoad(false);
    const result = await await axios(
      "http://localhost:5000/api/tour/getalltour"
    );
    console.log(result.status);
    //setIsLoad(true);
    setTours(result.data);
  }
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
        <InputLabel>Choose a tour</InputLabel>
        <Select
          value={chosenTour ? chosenTour : ""}
          onChange={(e) => {
            setChosenTour(e.target.value);
            Get(e.target.value);
          }}
        >
          {tours.map((each) => (
            <MenuItem key={each.tourId} value={each.tourId}>
              {each.tourName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!chosenTour ? (
        <div></div>
      ) : (
        <div>
          <MaterialTable
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            title=""
            icons={TableIcons}
            columns={[
              {
                title: "Group Name",
                field: "groupName",
                validate: (rowData) =>
                  rowData.groupName < 1 ? "Name must not be empty" : true,
              },
              {
                title: "Number of tourist",
                field: "numberOfTourist",
                render: (rowData) => {
                  return rowData.touristGroupDetailsOfCustomerList.length;
                },
              },
              {
                title: "Tour Price",
                field: "priceForTouristGroup",
                type: "currency",
                currencySetting: {
                  locale: "vn",
                  currencyCode: "vnd",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              },

              {
                title: "Revenue",
                field: "priceForTouristGroup",
                type: "currency",

                render: (rowData) => {
                  var formatter = new Intl.NumberFormat("vn-VN", {
                    locale: "vn",
                    currencyCode: "vnd",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });
                  return (
                    <Typography color="inherit">
                      {formatter.format(
                        rowData.touristGroupDetailsOfCustomerList.length *
                          rowData.priceForTouristGroup
                      ) + " ₫"}
                    </Typography>
                  );
                },
              },

              {
                title: "Cost",
                field: "totalCost",
                type: "currency",
                render: (rowData) => {
                  var formatter = new Intl.NumberFormat("vn-VN", {
                    locale: "vn",
                    currencyCode: "vnd",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });
                  return (
                    <div>
                      <Link
                        color="inherit"
                        onClick={() => handleCostDetailsBtn(rowData)}
                      >
                        {formatter.format(rowData.totalCost) + " ₫"}
                      </Link>
                    </div>
                  );
                },
              },
              {
                title: "Profit",
                field: "profit",
                type: "currency",

                render: (rowData) => {
                  var formatter = new Intl.NumberFormat("vn-VN", {
                    locale: "vn",
                    currencyCode: "vnd",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });
                  return formatter.format(
                    rowData.touristGroupDetailsOfCustomerList.length *
                      rowData.priceForTouristGroup -
                      rowData.totalCost
                  );
                },
              },
            ]}
            localization={{
              header: {
                actions: "",
              },
            }}
            data={touristGroups}
          ></MaterialTable>
          <Grid container spacing={1} variant="h5" className={classes.root}>
            <Grid item xs={2}>
              <Typography variant="h6" component="h2">
                Total
              </Typography>
            </Grid>
            <Grid item xs={2} sm={6}>
              <Typography variant="h6" component="h2">
                {getTotalCost()}
              </Typography>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
export default Analyst;
