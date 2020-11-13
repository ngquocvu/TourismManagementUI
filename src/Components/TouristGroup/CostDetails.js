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
}));

function CostDetails({ costDetails, groupId, groupName, onUpdate }) {
  const classes = useStyles();
  const [costs, setCosts] = useState(costDetails);
  const [costType, setCostType] = useState([]);

  async function Delete(id) {
    fetch("http://localhost:5000/api/touristgroup/DeleteCostDetails/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async function Add(location) {
    fetch("http://localhost:5000/api/touristgroup/CreateCostDetails/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    console.log(JSON.stringify(location));
  }

  async function Edit(id, cost) {
    fetch("http://localhost:5000/api/touristgroup/UpdateCostDetails/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cost),
    });
  }

  const getTotalCost = () => {
    let total = 0;
    costs.forEach((element) => {
      total = element.price + total;
      //console.log(element);
    });
    return new Intl.NumberFormat("VN-VN", {
      style: "currency",
      currency: "VND",
    }).format(total);
  };

  const handleBtnClick = () => {
    //mở form thêm cost vào !!
  };

  useEffect(() => {
    fetchCostType().then((result) => {
      console.log(result);
    });
  }, []);

  const fetchCostType = async () => {
    const result = await axios("http://localhost:5000/api/cost/getallcost");
    setCostType(result.data);
    console.log(result.data);
  };

  return (
    <Paper variant="outlined" className={classes.main}>
      {costDetails.map((c) => {
        console.log(c.cost);
      })}
      <MaterialTable
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        title={"Costs of " + groupName}
        icons={TableIcons}
        //data=costs.map((d) => ({ ...d }))
        data={costs}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              var last =
                costs[Object.keys(costs)[Object.keys(costs).length - 1]];
              if (last === undefined) {
                newData.id = 1;
              } else {
                newData.id = last.id + 1;
              }
              newData.touristGroupId = groupId;
              console.log(newData);
              setCosts([...costs, newData]);
              Add(newData);

              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...costs];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setCosts([...dataUpdate]);
                console.log(newData);
                const sender = {
                  costDetailsName: newData.costDetailsName,
                  costId: newData.costId,
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
                setCosts(costs.filter((item) => item.id !== oldData.id));
                resolve();
              }, 1000);
            }),
        }}
        columns={[
          {
            title: "Name",
            field: "costDetailsName",
            type: "string",
            //initialEditValue: new Date().toISOString(),
            // render: (rowData) => new Date(rowData.endDate).toDateString(),
          },
          {
            title: "Type",
            field: "costId",
            type: "string",
            render: (rowData) =>
              costType.map((each) => {
                if (each.costId === rowData.costId) return each.costName;
              }),
            editComponent: (t) => (
              <Select
                value={t.value}
                onChange={(e) => {
                  t.onChange(e.target.value);
                  console.group(e.target.value);
                }}
              >
                {costType.map((each) => (
                  <MenuItem value={each.costId}>{each.costName}</MenuItem>
                ))}
              </Select>
            ),
          },
          {
            title: "Price",
            field: "price",
            type: "currency",
            currencySetting: {
              locale: "vn",
              currencyCode: "vnd",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
            //initialEditValue: new Date().toISOString(),
            //render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
        ]}
        localization={{
          header: {
            actions: "",
          },
        }}
      />
      <Grid container spacing={1} variant="h5" className={classes.grid}>
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
    </Paper>
  );
}
export default CostDetails;
