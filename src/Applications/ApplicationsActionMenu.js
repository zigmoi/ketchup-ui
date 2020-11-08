import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {makeStyles} from '@material-ui/core/styles';
import {Tooltip} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import LaunchIcon from "@material-ui/icons/Launch";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import {useSnackbar} from "notistack";
import DeleteDialog from "./DeleteDialog";

const ITEM_HEIGHT = 30;
export default function ApplicationsActionMenu(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const useStyles = makeStyles((theme) => ({
        actionIcon: {
            '& svg': {
                fontSize: 17,
            },
            margin: 0,
            padding: 0,
            paddingInline: 0,
            marginInline: 0,
        },
    }));

    function deleteApplication() {
        const applicationResourceId = props.rowData.id.applicationResourceId;
        const projectResourceId = props.rowData.id.projectResourceId;
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`)
            .then((response) => {
                closeDeleteDialog();
                enqueueSnackbar('Application deleted successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/applications`);
            })
            .catch((error) => {
                closeDeleteDialog();
            });
    }

    function openDeleteDialog() {
        setDialogOpen(true);
    }

    function closeDeleteDialog() {
        setDialogOpen(false);
    }

    const classes = useStyles();
    return (
        <div style={{display: "flex"}}>
            <Tooltip title="View Application">
                <IconButton
                    className={classes.actionIcon}
                    onClick={() => history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/view`)}
                >
                    <LaunchIcon color="action"/>
                </IconButton>
            </Tooltip>
            &nbsp; &nbsp;
            <Tooltip title="Edit Application">
                <IconButton
                    className={classes.actionIcon}
                    onClick={() => history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/edit`)}
                >
                    <EditIcon color="action"/>
                </IconButton>
            </Tooltip>
            &nbsp; &nbsp;
            <Tooltip title="Delete Application">
                <IconButton
                    className={classes.actionIcon}
                    onClick={() => openDeleteDialog()}
                >
                    <DeleteIcon color="action"/>
                </IconButton>
            </Tooltip>
            &nbsp; &nbsp;
            <IconButton onClick={handleClick} className={classes.actionIcon}>
                <MoreVertIcon/>
            </IconButton>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 5.5 + 1,
                        width: '12ch',
                    },
                }}
            >
                <MenuItem
                    style={{fontSize: 12}}
                    key="view"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/view`);
                    }}>
                    View
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="edit"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/edit`);
                    }}>
                    Edit
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="revisions"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/revisions`);
                    }}>
                    Revisions
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="logs"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.applicationResourceId}/logs`);
                    }}>
                    Logs
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="delete"
                    onClick={() => {
                        setAnchorEl(null);
                        openDeleteDialog();
                    }}>
                    Delete
                </MenuItem>
            </Menu>
            <DeleteDialog
                isOpen={dialogOpen}
                title={"Confirm Delete"}
                description={`Do you want to delete this application (${props.rowData.id.applicationResourceId}) ?`}
                onDelete={deleteApplication}
                onClose={closeDeleteDialog}/>
        </div>
    );
}
