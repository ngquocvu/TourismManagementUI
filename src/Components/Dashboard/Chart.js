import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./Title";
import axios from "axios";

// Generate Sales Data
function createData(price, amount) {
  return { price, amount };
}

export default function Chart() {
  const [data, setData] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    fetchTourGroupPriceList();
  }, []);

  const exChange = (number) => {
    return number;
  };
  async function fetchTourGroupPriceList() {
    const result = await axios("http://localhost:5000/api/tour/getalltour/");

    setData(
      result.data.map(({ tourName, touristGroup }) => ({
        tourName: tourName,
        touristGroup: touristGroup.length,
      }))
    );
    console.log(data);
  }
  return (
    <React.Fragment>
      <Title>Tour Analytics</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 10,
            left: 24,
          }}
        >
          <XAxis
            dataKey="tourName"
            data
            stroke={theme.palette.text.secondary}
          ></XAxis>

          <YAxis stroke={theme.palette.text.secondary}></YAxis>
          <Bar
            fill="#2884d8"
            dataKey="touristGroup"
            dot={false}
            name="Groups"
          />
          <Tooltip />
          <Legend iconType="circle" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
