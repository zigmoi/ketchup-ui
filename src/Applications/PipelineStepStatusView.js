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
export default function PipelineStepStatusView(props) {
    const classes = useStyles();
    let statusView;
    if (props.statusJson?.status === "True") {
        statusView = (<CheckIcon style={{ color: green[500] }} />);
    } else if (props.statusJson?.status === "False") {
            statusView = (<CloseIcon style={{ color: red[500] }} />);
    } else if (props.statusJson?.state === "Waiting") {
        statusView = (<HourglassEmptyIcon />);
    } else if (props.statusJson?.state === "Running") {
        statusView = (<CircularProgress size={23} />);
    }else{
        statusView = (<HourglassEmptyIcon />);
    }
    return statusView;
}