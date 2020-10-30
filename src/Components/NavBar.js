import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Switch from "@material-ui/core/Switch";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import HomeIcon from "@material-ui/icons/Home";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import MapIcon from "@material-ui/icons/Map";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleIcon from "@material-ui/icons/People";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  listItem: {
    marginRight: theme.spacing(10),
    fontWeight: "bold",
  },
  main: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  darkMode: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lightMode: {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
function NavBar(props) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={classes.main}>
      <Drawer
        open={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div>
          <List>
            <ListItem style={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                className={classes.toolbarIcon}
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <ChevronLeft />
              </IconButton>
            </ListItem>
            <Divider />
            <Link
              exec
              to="/dashboard"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                button
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Dashboard
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/tour"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                button
              >
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Tour
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/staff"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
                button
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Staff
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/customer"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
                button
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Customer
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/cost"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
                button
              >
                <ListItemIcon>
                  <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Cost
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/location"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
                button
              >
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Location
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/job"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
                button
              >
                <ListItemIcon>
                  <WorkOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Job
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
            <Link
              to="/tour-price"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem
                selected={selectedIndex === 7}
                onClick={(event) => handleListItemClick(event, 7)}
                button
              >
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  className={classes.listItem}
                  primary={
                    <Typography
                      type="body2"
                      style={{
                        fontWeight: "fontWeightMedium",
                        fontSize: "h6.fontSize",
                      }}
                    >
                      Tour Price
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
      <AppBar
        position="static"
        className={props.isDarkMode ? classes.darkMode : classes.lightMode}
      >
        <Toolbar className={classes.root}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            
          </Typography>
          <Switch
            checked={props.isDarkMode}
            onChange={() => props.setIsDarkMode(!props.isDarkMode)}
            icon={<Brightness4Icon />}
            checkedIcon={<Brightness4Icon />}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default NavBar;
