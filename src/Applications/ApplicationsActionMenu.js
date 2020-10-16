import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {makeStyles} from '@material-ui/core/styles';
import {Tooltip} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import LaunchIcon from "@material-ui/icons/Launch";
import EditIcon from '@material-ui/icons/Edit';

const ITEM_HEIGHT = 30;
export default function ApplicationsActionMenu(props) {
    let history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

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

    const classes = useStyles();
    return (
        <div style={{display: "flex"}}>
            <Tooltip title="View Application">
                <IconButton
                    className={classes.actionIcon}
                    onClick={() => history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/view`)}
                >
                    <LaunchIcon color="action"/>
                </IconButton>
            </Tooltip>
            &nbsp; &nbsp;
            <Tooltip title="Edit Application">
                <IconButton
                    className={classes.actionIcon}
                    onClick={() => history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/edit`)}
                >
                    <EditIcon color="action"/>
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
                        maxHeight: ITEM_HEIGHT * 4.5 + 1,
                        width: '12ch',
                    },
                }}
            >
                <MenuItem
                    style={{fontSize: 12}}
                    key="view"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/view`);
                    }}>
                    View
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="edit"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/edit`);
                    }}>
                    Edit
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="history"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/history`);
                    }}>
                    History
                </MenuItem>
                <MenuItem
                    style={{fontSize: 12}}
                    key="logs"
                    onClick={() => {
                        setAnchorEl(null);
                        history.push(`/app/project/${props.rowData.id.projectResourceId}/application/${props.rowData.id.deploymentResourceId}/logs`);
                    }}>
                    Logs
                </MenuItem>
            </Menu>
        </div>
    );
}
