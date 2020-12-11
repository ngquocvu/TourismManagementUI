import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import axios from "axios";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  const [data, setData] = useState();
  useEffect(() => {
    fetchTourGroupPriceList();
  }, []);

  async function fetchTourGroupPriceList() {
    const result = await axios("http://localhost:5000/api/tour/getalltour/");
    setData(result.data.length);
  }
  return (
    <>
      <Title variant="h3">Number of Tours</Title>
      <div>
        {" "}
        <Typography component="p" variant="h1">
          {data}
        </Typography>
      </div>

      <div>
        {" "}
        <Typography
          variant="h7"
          color="textSecondary"
          className={classes.depositContext}
        >
          Recently updated
        </Typography>
      </div>
    </>
  );
}
