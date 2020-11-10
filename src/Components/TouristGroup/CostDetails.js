import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

function CostDetails({ costDetails }) {
  const [costList, setCostList] = useState([{}]);
  const handleBtnClick = () => {
    //mở form thêm cost vào !!
  };
  useEffect(() => {
    console.log(costList);
  });

  return (
    <div>
      {costDetails.map((c) => {
        console.log(c.cost);
      })}
    </div>
  );
}
export default CostDetails;
