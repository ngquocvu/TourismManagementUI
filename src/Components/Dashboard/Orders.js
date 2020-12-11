import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import { useHistory } from "react-router-dom";
import GradeIcon from "@material-ui/icons/Grade";
import Title from "./Title";
import Chip from "@material-ui/core/Chip";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginLeft: theme.spacing(2),
  },
  root: {
    justifyContent: "center",
    textAlign: "center",
  },
}));

export default function Orders() {
  const [data, setData] = useState([]);
  const history = useHistory();

  async function fetchTourGroupPriceList() {
    const result = await axios("http://localhost:5000/api/tour/getalltour/");
    setData(result.data);
  }
  useEffect(() => {
    fetchTourGroupPriceList();
  }, []);

  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Chip
          color="primary"
          onClick={() => history.push("/analyst")}
          label="Analyst board"
          clickable
          size="medium"
          className={classes.seeMore}
          icon={<GradeIcon />}
        />
        <Chip
          color="primary"
          label="Tour"
          clickable
          size="medium"
          onClick={() => history.push("/tour")}
          className={classes.seeMore}
          icon={<GradeIcon />}
        />
        <Chip
          color="primary"
          label="Tourist group"
          clickable
          size="medium"
          onClick={() => history.push("/tourist-group")}
          className={classes.seeMore}
          icon={<GradeIcon />}
        />
        <Chip
          color="primary"
          label="Staff"
          clickable
          onClick={() => history.push("/staff")}
          size="medium"
          className={classes.seeMore}
          icon={<GradeIcon />}
        />
      </div>
    </React.Fragment>
  );
}
