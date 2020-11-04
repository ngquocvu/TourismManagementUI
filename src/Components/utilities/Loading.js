import React from "react";
import { useRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { darkModeState } from "../../containers/state";

function Loading() {
  const [isDarkMode] = useRecoilState(darkModeState);
  return (
    <div>
      <LinearProgress color={isDarkMode === true ? "primary" : "secondary"} />
    </div>
  );
}

export default Loading;
