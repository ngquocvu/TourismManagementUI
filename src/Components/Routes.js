import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";
import { darkModeState } from "../containers/state";

const Dashboard = lazy(() => import("./Dashboard"));
const StaffsTable = lazy(() => import("./Staff"));
const CustomersTable = lazy(() => import("./Customer"));
const CostsTable = lazy(() => import("./Cost"));
const LocationsTable = lazy(() => import("./Location"));
const ToursTable = lazy(() => import("./Tour"));
const JobsTable = lazy(() => import("./Job"));
const TouristGroup = lazy(() => import("./TouristGroup"));
const TourPricesTable = lazy(() => import("./TourPrice"));
function Routes() {
  const [isDarkMode] = useRecoilState(darkModeState);
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route exact path="/dashboard">
        <Dashboard isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/customer">
        <CustomersTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/staff">
        <StaffsTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/location">
        <LocationsTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/cost">
        <CostsTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/job">
        <JobsTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/tour">
        <ToursTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/tour-price">
        <TourPricesTable isDarkMode={isDarkMode} />
      </Route>
      <Route exact path="/tourist-group">
        <TouristGroup isDarkMode={isDarkMode} />
      </Route>
    </Switch>
  );
}
export default Routes;
