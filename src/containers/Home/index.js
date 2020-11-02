import React, { useState, Suspense } from "react";
import CssBaseLine from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import { useRecoilState } from "recoil";
import Loading from "../../components/utilities/Loading";
import NavBar from "../../components/NavBar";
import Grid from "@material-ui/core/Grid";
import Routes from "../../components/Routes";
import { darkModeState } from "../state";

function Home() {
  const [isDarkMode] = useRecoilState(darkModeState);

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
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <Router>
        <NavBar />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Suspense fallback={<Loading />}>
                <Routes />
              </Suspense>
            </Grid>
          </Grid>
        </Container>
      </Router>
    </ThemeProvider>
  );
}
export default Home;
