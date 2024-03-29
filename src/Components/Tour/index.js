import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import ExploreIcon from "@material-ui/icons/Explore";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PriceList from "./PriceList";
import DestinationDetails from "./DestinationDetails";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

async function Delete(id) {
  fetch("http://localhost:5000/api/tour/Deletetour/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Edit(id, tour) {
  fetch("http://localhost:5000/api/tour/Updatetour/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tour),
  });
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
    background: "#d4d4d4",
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

function ToursTable(props) {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [tours, setTours] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [typeOfTourism, setTypeOfTourism] = useState([]);

  const updateTourDetailsList = (tourId, tourDetailsList) => {
    setTours(
      tours.map((s) => {
        if (s.tourId === tourId) s.tourDetailsList = tourDetailsList;
        return s;
      })
    );
  };
  const updateTourPriceList = (tourId, tourPriceList) => {
    setTours(
      tours.map((s) => {
        if (s.tourId === tourId) s.tourPriceList = tourPriceList;
        return s;
      })
    );
  };

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {
      console.log("Type ne");
    });
  }, []);

  async function Add(tour) {
    await fetch("http://localhost:5000/api/tour/CreateTour/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tour),
    });
    fetchData();
  }

  async function fetchData() {
    setIsLoad(false);
    const result = await axios("http://localhost:5000/api/tour/getalltour");
    const tourResult = await axios(
      "http://localhost:5000/api/TypesOfTourism/getall"
    );
    setIsLoad(true);
    setTours(result.data);
    setTypeOfTourism(tourResult.data);
  }

  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={!props.isDarkMode ? "secondary" : "primary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <MaterialTable
        title="Tour"
        icons={TableIcons}
        data={tours.map((d) => ({ ...d }))}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Add(newData).then(() =>
                  setTimeout(function () {
                    fetchData();
                    setIsLoad(false);
                  }, 1000)
                );

                resolve();
              }, 0);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tours];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setTours([...dataUpdate]);
                const sender = {
                  description: newData.description,
                  tourId: oldData.tourId,
                  tourName: newData.tourName,
                  typesOfTourismId: newData.typesOfTourismId,
                };
                console.log(oldData);
                Edit(oldData.tourId, sender);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                Delete(oldData.tourId);
                setTours(
                  tours.filter((item) => item.tourId !== oldData.tourId)
                );
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 100);
            }),
        }}
        columns={[
          {
            title: "Name",
            field: "tourName",
            validate: (rowData) =>
              rowData.tourName < 1 ? "Tour Name must not be empty" : true,
          },
          {
            title: "Description",
            field: "description",
            validate: (rowData) =>
              rowData.description < 1 ? "Description must not be empty" : true,
          },
          {
            title: "Type of tourism",
            field: "typesOfTourismId",
            type: "numeric",
            editComponent: (t) => (
              <Select
                value={t.value ? t.value : " "}
                onChange={(e) => {
                  t.onChange(e.target.value);
                  console.group(e.target.value);
                }}
              >
                {typeOfTourism.map((each) => (
                  <MenuItem value={each.typesOfTourismId}>
                    {each.typeName}
                  </MenuItem>
                ))}
              </Select>
            ),
            render: (rowData) => {
              let typeName;
              typeOfTourism.map((t) => {
                if (rowData.typeOfTourismId === t.typeOfTourismId)
                  typeName = t.typeName;
              });
              return typeName;
            },
          },
        ]}
        detailPanel={[
          {
            icon: ExploreIcon,
            tooltip: "Destination",
            render: (rowData) => {
              return (
                <div>
                  <DestinationDetails
                    tourId={rowData.tourId}
                    tourDetails={rowData.tourDetailsList}
                    tourName={rowData.tourName}
                    onUpdate={updateTourDetailsList}
                    setIsLoad={setIsLoad}
                  />
                </div>
              );
            },
          },
          {
            icon: MonetizationOnIcon,
            tooltip: "Price List",
            onClick: () => {
              fetchData();
            },
            render: (rowData) => {
              return (
                <div>
                  <PriceList
                    tourId={rowData.tourId}
                    //costDetails={rowData.tourPriceList}
                    groupName={rowData.tourName}
                    onUpdate={updateTourPriceList}
                    setIsLoad={setIsLoad}
                  />
                </div>
              );
            },
          },
        ]}
      />
      <SnackBarC
        open={isSnackBarOpen}
        handleSnackBarOnClose={handleSnackBarOnClose}
      />
    </div>
  );
}
export default ToursTable;
