import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

const useStyles = makeStyles((theme) => ({
    circularProgress: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(0.3),
    },
    pipelineProgress: {
        marginRight: theme.spacing(1),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '20%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));
export default function PipelineTaskStatusView(props) {
    const classes = useStyles();
    let statusView;
    if (props.statusJson?.status === "Unknown" && (props.statusJson?.reason === "Started" || props.statusJson?.reason === "Pending")) {
        return statusView = (<HourglassEmptyIcon />);
    } else if (props.statusJson?.status === "Unknown") {
        return statusView = (<CircularProgress size={23} />);
    } else if (props.statusJson?.status === "True") {
        return statusView = (<CheckIcon style={{ color: green[500] }} />);
    } else if (props.statusJson?.status === "False") {
        if(!props.statusJson?.completionTime){
            return statusView = (<CircularProgress size={23} />);
        }else{
            if(props.statusJson?.reason === "TaskRunCancelled"){
                return statusView = (<CloseIcon style={{ color: red[500] }} />);
            }else if(props.statusJson?.reason === "TaskRunTimeout"){
                return statusView = (<CloseIcon style={{ color: red[500] }} />);
            }else{
                return statusView = (<CloseIcon style={{ color: red[500] }} />);
            }
        }
    }else{
        return statusView = (<HourglassEmptyIcon />);
    }
}