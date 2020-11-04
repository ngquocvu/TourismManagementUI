import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
const useStyles = makeStyles((theme) => ({
  listItem: {
    marginRight: theme.spacing(10),
    fontWeight: "bold",
  },
}));
function CustomListItem({ link, icon, text, isSelected, onClick }) {
  const classes = useStyles();
  return (
    <Link
      exec
      to={link}
      style={{ color: "inherit", textDecoration: "inherit" }}
    >
      <ListItem selected={isSelected} onClick={onClick} button>
        <ListItemIcon>{icon}</ListItemIcon>
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
              {text}
            </Typography>
          }
        />
      </ListItem>
    </Link>
  );
}
export default CustomListItem;
