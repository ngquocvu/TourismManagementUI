import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { darkModeState } from "../containers/state";
import { makeStyles } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import CategoryIcon from "@material-ui/icons/Category";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import List from "@material-ui/core/List";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ListItem from "@material-ui/core/ListItem";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ListItemText from "@material-ui/core/ListItemText";
import AssessmentIcon from "@material-ui/icons/Assessment";
import PersonIcon from "@material-ui/icons/Person";
import WorkIcon from "@material-ui/icons/Work";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import HomeIcon from "@material-ui/icons/Home";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import MapIcon from "@material-ui/icons/Map";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PeopleIcon from "@material-ui/icons/People";
import CustomListItem from "./CustomListItem";

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

function NavBar() {
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeState);
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [title, setTitle] = useState("Tour Management");
  const history = useHistory();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

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
            <CustomListItem
              icon={<HomeIcon />}
              text="Dashboard"
              link="/dashboard"
              isSelected={selectedIndex === 0}
              onClick={() => handleListItemClick(0)}
            />
            <CustomListItem
              icon={<AssessmentIcon />}
              text="Analytics"
              link="/analyst"
              isSelected={selectedIndex === 10}
              onClick={() => handleListItemClick(10)}
            />
            <Divider />
            <ListSubheader>Tour Settings</ListSubheader>
            <CustomListItem
              icon={<MapIcon />}
              text="Tour"
              link="/tour"
              isSelected={selectedIndex === 1}
              onClick={() => handleListItemClick(1)}
            />
            <CustomListItem
              icon={<LocationOnIcon />}
              text="Location"
              link="/location"
              isSelected={selectedIndex === 5}
              onClick={() => handleListItemClick(5)}
            />
            <CustomListItem
              icon={<MonetizationOnIcon />}
              text="Cost"
              link="/cost"
              isSelected={selectedIndex === 4}
              onClick={() => handleListItemClick(4)}
            />
            <CustomListItem
              icon={<BeachAccessIcon />}
              text="Type"
              link="/type"
              isSelected={selectedIndex === 9}
              onClick={() => handleListItemClick(9)}
            />

            <CustomListItem
              icon={<AttachMoneyIcon />}
              text="Price"
              link="/tour-price"
              isSelected={selectedIndex === 7}
              onClick={() => handleListItemClick(7)}
            />
            <Divider />
            <ListSubheader>People</ListSubheader>
            <CustomListItem
              icon={<SupervisedUserCircleIcon />}
              text="Group"
              link="/tourist-group"
              isSelected={selectedIndex === 2}
              onClick={() => handleListItemClick(2)}
            />
            <CustomListItem
              icon={<PeopleIcon />}
              text="Customer"
              link="/customer"
              isSelected={selectedIndex === 3}
              onClick={() => handleListItemClick(3)}
            />

            <CustomListItem
              icon={<PersonIcon />}
              text="Staff"
              link="/staff"
              isSelected={selectedIndex === 8}
              onClick={() => handleListItemClick(8)}
            />
            <CustomListItem
              icon={<WorkIcon />}
              text="Job"
              link="/job"
              isSelected={selectedIndex === 6}
              onClick={() => handleListItemClick(6)}
            />
          </List>
        </div>
      </Drawer>
      <AppBar
        position="static"
        className={isDarkMode ? classes.darkMode : classes.lightMode}
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
          <Typography
            variant="h6"
            onClick={() => history.push("/")}
            className={classes.title}
          >
            {title}
          </Typography>
          {/* <IconButton aria-label="show 1 new notifications" color="inherit">
            <Badge badgeContent={1} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <IconButton
            color="inherit"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Brightness4Icon /> : <BrightnessHighIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default NavBar;
