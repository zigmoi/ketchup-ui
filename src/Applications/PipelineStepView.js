import React, { useContext, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import PipelineStepStatusView from './PipelineStepStatusView';
import UserContext from '../UserContext';
import {format, formatDistanceStrict} from "date-fns";

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '20%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    }
}));
export default function PipelineStepView(props) {
    let { projectResourceId, applicationResourceId, revisionResourceId } = props;
    const classes = useStyles();
    const logViewerHeight = 350;
    const userContext = useContext(UserContext);
    const [startLogStream, setStartLogStream] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    function toggleShowLogs() {
        if (showLogs) {
            setShowLogs(false);
        } else {
            setShowLogs(true);
        }
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header1"
            >
                <Box width="100%" display="flex" alignItems="center" textAlign="left">
                    <Box m={1} width="25%">
                        <Typography variant="subtitle2" >
                            Name: &nbsp;
                            <Typography variant="caption" >
                                {props.step?.stepName}
                            </Typography>
                        </Typography>
                    </Box>
                    <Box m={1} width="23%">
                        <Typography variant="subtitle2" >
                            Start Time: &nbsp;
                            <Typography variant="caption" >
                                {props.step?.startTime ? format(new Date(props.step.startTime), 'PPpp') : ""}
                            </Typography>
                        </Typography>
                    </Box>
                    <Box m={1} width="27%">
                        <Typography variant="subtitle2" >
                            Completion Time: &nbsp;
                            <Typography variant="caption" >
                                {props.step?.completionTime ? format(new Date(props.step.completionTime), 'PPpp') : ""}
                            </Typography>
                        </Typography>
                    </Box>
                    <Box m={1} width="20%">
                        <Typography variant="subtitle2" >
                            Duration: &nbsp;
                            <Typography variant="caption" >
                                {props.step?.startTime && props.step?.completionTime ?
                                    formatDistanceStrict(new Date(props.step.completionTime), new Date(props.step.startTime)) : ""}
                            </Typography>
                        </Typography>
                    </Box>
                    <Box m={1} width="5%">
                        <PipelineStepStatusView statusJson={props.step} />
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box width="100%">
                        <Typography variant="subtitle2" >
                            Message: &nbsp;
                            <Typography variant="caption" >
                                {props.step?.reason}{props?.step?.message ? "," : ""} {props.step?.message}
                            </Typography>
                        </Typography>
                        <br />
                        <Button style={{ display: startLogStream ? 'none' : 'block' }} variant="outlined" size="small" color="primary" onClick={() => { setStartLogStream(true); setShowLogs(true) }}>Show Logs</Button>
                        {
                            startLogStream === false ? null :
                                <Button variant="outlined" size="small" color="primary"
                                    style={{ display: 'block' }}
                                    onClick={() => toggleShowLogs()}>
                                    {showLogs ? "Hide Logs" : "Show Logs"}
                                </Button>
                        }
                    </Box>
                    <br />
                    {startLogStream && props.step?.containerName ?
                        <Box width="100%" style={{ display: showLogs ? 'block' : 'none' }}>
                            <ScrollFollow
                                startFollowing={true}
                                render={({ follow, onScroll }) => (
                                    <LazyLog
                                        url={`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions/${revisionResourceId}/pipeline/logs/stream/direct?podName=${props.step?.podName}&containerName=${props.step?.containerName}&access_token=${userContext?.currentUser?.accessToken}`}
                                        height={logViewerHeight}
                                        // width={logViewerWidth}
                                        style={{ textAlign: 'left' }}
                                        stream
                                        selectableLines
                                        follow={follow}
                                        onScroll={onScroll}
                                        enableSearch />
                                )}
                            />
                        </Box> : null}
                </Box>
            </AccordionDetails>
        </Accordion>);




}