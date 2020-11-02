import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

class Loading extends React.Component {
  render() {
    return (
      <div>
        <LinearProgress color="secondary" />
      </div>
    );
  }
}
export default Loading;
