import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

function CostDetails({ costDetailsList }) {
    const [costList, setCostList] = useState(costDetailsList);
    const handleBtnClick =()=>{
        //mở form thêm cost vào !!
    }
  useEffect(() => {
    console.log(costList);
  });

  return (
    <div>
      {costList.map((each) => (
        <div key={each.id}>
          <ul>
            Detail List Id:{each.id} : Cost id: {each.costId} : Notes:{" "}
            {each.note}{" "}
          </ul>
        </div>
      ))}
      <Button variant="contained" color="secondary" onClick={handleBtnClick}>
        Add Cost
      </Button>
    </div>
  );
}
export default CostDetails;
