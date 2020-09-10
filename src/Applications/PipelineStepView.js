import React, { useContext, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import PipelineStepStatusView from './PipelineStepStatusView';
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';

const useStyles = makeStyles((theme) => ({
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
export default function PipelineStepView(props) {
    let { releaseResourceId } = useParams();
    const classes = useStyles();
    const logViewerHeight = 350;
    const userContext = useContext(UserContext);
    const [startLogStream, setStartLogStream] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    function toggleShowLogs(){
        if(showLogs){
            setShowLogs(false);
        }else{
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
                <PipelineStepStatusView statusJson={props.step} />
                <Typography className={classes.heading} > {props.step?.stepName}</Typography>
                <Typography className={classes.secondaryHeading}> Start Time: {props.step?.startTime}</Typography>
                &nbsp;
                <Typography className={classes.secondaryHeading}> Completion Time: {props.step?.completionTime}</Typography>
                &nbsp;
                </AccordionSummary>
            <AccordionDetails>
                <Box width="100%">
                    <Box width="100%">
                        <Typography variant="caption">{props.step?.reason}: {props.step?.message}</Typography>
                        <br />
                        <Button style={{ display: startLogStream ? 'none' : 'block' }} variant="outlined" size="small" color="primary" onClick={() => { setStartLogStream(true); setShowLogs(true) }}>Show Logs</Button>
                        <br />
                        {
                            startLogStream === false ? null :
                                <Button variant="outlined" size="small" color="primary" 
                                    onClick={() => toggleShowLogs()}>
                                    {showLogs ? "Hide Logs" : "Show Logs"}
                                </Button>
                        }
                    </Box>
                    {startLogStream && props.step?.containerName ?
                        <Box width="100%" style={{ display: showLogs ? 'block' : 'none' }}>
                            <ScrollFollow
                                startFollowing={true}
                                render={({ follow, onScroll }) => (
                                    <LazyLog
                                        url={`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/logs/stream/direct?releaseId=${releaseResourceId}&podName=${props.step?.podName}&containerName=${props.step?.containerName}&access_token=${userContext?.currentUser?.accessToken}`}
                                        height={logViewerHeight}
                                        // width={logViewerWidth}
                                        stream
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