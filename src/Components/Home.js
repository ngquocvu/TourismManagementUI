import React, { useState, useEffect } from "react";
import CssBaseLine from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { ThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NavBar from "./NavBar";
import Grid from "@material-ui/core/Grid";
import StaffsTable from "./Staff/StaffsTable";
import CustomersTable from "./Customer/CustomersTable";
import CostsTable from "./Cost/CostsTable";
import LocationsTable from "./Location/LocationsTable";
import ToursTable from "./Tour/ToursTable";
import JobsTable from "./Job/JobsTable";
import Dashboard from "./Dashboard/Dashboard";
import TourPricesTable from "./TourPrice/TourPricesTable";
function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const theme = createMuiTheme({
    palette: {
      type: isDarkMode ? "dark" : "light",
      primary: {
        light: "#2a3eb1",
        main: "#3f50b5",
        dark: "#212121",
        contrastText: "#fff",
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseLine />
        <Router>
          <NavBar
            isLoad={isLoad}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Switch>
                  <Route path="/dashboard">
                    <Dashboard isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/customer">
                    <CustomersTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/staff">
                    <StaffsTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/location">
                    <LocationsTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/cost">
                    <CostsTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/job">
                    <JobsTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/tour">
                    <ToursTable isDarkMode={isDarkMode} />
                  </Route>
                  <Route path="/tour-price">
                    <TourPricesTable isDarkMode={isDarkMode} />
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Container>
        </Router>
      </ThemeProvider>
    </div>
  );
}
export default Home;
