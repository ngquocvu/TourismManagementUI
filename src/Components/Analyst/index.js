import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

function Analyst() {
  const [tours, setTours] = useState([]);
  const [touristGroups, setTouristGroup] = useState([]);
  const [chosenTour, setChosenTour] = useState();

  async function Get(id) {
    const result = await axios("http://localhost:5000/api/tour/gettour/" + id);
    setTouristGroup(result.data.touristGroup);
  }

  useEffect(() => {
    fetchData().then(() => {});
  }, []);

  async function fetchData() {
    //setIsLoad(false);
    const result = await axios("http://localhost:5000/api/tour/getalltour");
    //setIsLoad(true);
    setTours(result.data);
  }
  return (
    <div>
      <Typography>Select a Tour</Typography>
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
      <MaterialTable
        title=""
        columns={[
          {
            title: "Group Name",
            field: "groupName",
            validate: (rowData) =>
              rowData.groupName < 1 ? "Name must not be empty" : true,
          },
          {
            title: "Doanh thu",
            field: "totalCost",
            validate: (rowData) =>
              rowData.groupName < 1 ? "Name must not be empty" : true,
          },
          {
            title: "Tour Name",
            field: "tourId",
            type: "numeric",
          },
          {
            title: "Start Date",
            field: "startDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
          {
            title: "End date",
            field: "endDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.endDate).toDateString(),
            validate: (rowData) =>
              new Date(rowData.endDate) < new Date(rowData.startDate)
                ? "Start date must be after end date!"
                : true,
          },
          {
            title: "Schedule Details",
            field: "scheduleDetails",
            editComponent: (t) => (
              <TextareaAutosize
                aria-label="minimum height"
                onChange={(e) => t.onChange(e.target.value)}
                rowsMin={3}
                value={t.value}
              />
            ),
            render: (rowData) => (
              <div>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  //onClick={() => onOpenDialog(rowData)}
                >
                  Details
                </Button>
              </div>
            ),
          },
        ]}
        data={touristGroups}
      ></MaterialTable>
    </div>
  );
}
export default Analyst;
