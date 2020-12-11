import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = (theme) => ({
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const moneyFormatter = (amount) => {
  var formatter = new Intl.NumberFormat("vn-VN", {
    locale: "vn",
    currencyCode: "vnd",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    minWidth: 400,
  },
}))(MuiDialogActions);

function CustomDialog({ openDialog, onCloseDialog, title, details }) {
  return (
    <Dialog
      style={{ minWidth: "400" }}
      onClose={() => onCloseDialog()}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
    >
      <DialogTitle id="customized-dialog-title" onClose={() => onCloseDialog()}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>

                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.costDetailsName}</TableCell>
                    <TableCell align="right">
                      {moneyFormatter(row.price) + " đ"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={() => onCloseDialog()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CustomDialog;
