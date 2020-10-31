import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CircularProgress, Toolbar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    circularProgress: {
        marginLeft: theme.spacing(1),
    },
}));

export default function DeleteDialog(props) {
    const classes = useStyles();
    const {isOpen, title, description, onDelete, onClose} = props;
    const [loading, setLoading] = useState(false);

    function deleteResource() {
        setLoading(true);
        onDelete();
    }

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onClose}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle id="alert-dialog-title">{title} {loading ?
                    <CircularProgress size={15} className={classes.circularProgress}/> : null}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} onClick={deleteResource} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={onClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
