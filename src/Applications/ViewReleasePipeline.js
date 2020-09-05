import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel, Chip, Accordion, AccordionSummary, AccordionDetails, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import UserContext from '../UserContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LazyLog, ScrollFollow } from 'react-lazylog';

const useStyles = makeStyles((theme) => ({
    content: {
        fontSize: '12px',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'white'
    },
    container: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(1),
        fontSize: '12px',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'white',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    textField: {
        fontSize: '12px'
    },
    button: {
        marginRight: theme.spacing(0.5),
    },
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

function ViewReleasePipeline() {
    document.title = "Deployment Pipeline";
    const classes = useStyles();
    const logViewerHeight = 350;

    let { projectResourceId, releaseResourceId } = useParams();
    let history = useHistory();
    const userContext = useContext(UserContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [statusJson, setStatusJson] = useState("");
    const [startLogStream, setStartLogStream] = useState(false);


    let statusSource;
    useEffect(() => {
        document.title = "Build Pipeline Details";
    }, []);

    useEffect(() => {
        let access_token = userContext.currentUser ? userContext.currentUser.accessToken : "";
        if (access_token === "") {
            return;
        }
        statusSource = new EventSource(`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/status/stream/sse?releaseId=${releaseResourceId}&access_token=${access_token}`);
        statusSource.addEventListener('data', function (e) {
            streamPipelineStatus(e);
        }, false);

        statusSource.addEventListener('close', function (e) {
            console.log("closing.");
            this.close();
            console.log("closed.");
        }, false);

        statusSource.addEventListener('error', function (e) {
            console.log("error, closed.");
        }, false);

        return () => {
            console.log("clearing status stream.")
            statusSource.close();
        }
    }, [releaseResourceId, userContext.currentUser]);


    function streamPipelineStatus(event) {
        console.log(event);
        setStatusJson(JSON.parse(event.data));
        let parsedStatusJson = JSON.parse(event.data);
        console.log(parsedStatusJson);

        if (parsedStatusJson.reason && (parsedStatusJson.reason === 'Succeeded' || parsedStatusJson.reason === 'Failed')) {
            console.log('closing status source.');
            statusSource.close();
        }
    }
 

    let pipelineStatusView;
    if (statusJson?.status === "True") {
        pipelineStatusView = (<Chip label="Success" color="primary" />);
    } else if (statusJson?.status === "Unknown" && statusJson?.reason === "Running") {
        pipelineStatusView = (
            <React.Fragment>
                <Chip label="In Progress" color="primary" />&nbsp;
                <CircularProgress size={15} className={classes.circularProgress} />
            </React.Fragment>);
    } else if (statusJson?.status === "False") {
        pipelineStatusView = (<Chip label="Failed" color="secondary" />);
    } else {
        pipelineStatusView = (<Chip label="Unknown" />);
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Deployment Pipeline
                        <Typography variant="caption" >
                            &nbsp; {releaseResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={8}>
                    <Box m={2}>
                        {pipelineStatusView}
                        <br />
                        <Typography variant="caption" >
                            Start Time: &nbsp; {statusJson?.startTime}
                        </Typography>
                        &nbsp;
                        <Typography variant="caption" >
                            Completion Time: &nbsp; {statusJson?.completionTime}
                        </Typography>
                        <br />
                        <Typography variant="caption" >
                            Reason: &nbsp; {statusJson?.reason + ", " + statusJson?.message}
                        </Typography>
                        <br />


                        {statusJson?.tasks?.map((task, taskIndex) => {
                            return(
                            <Accordion style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}  >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    id="panel1bh-header"
                                >
                                    <Typography className={classes.heading} ><CircularProgress size={15} className={classes.pipelineProgress} /> {task.baseName}</Typography>
                                    <Typography className={classes.secondaryHeading}> Start Time: {task?.startTime}</Typography>
                                 &nbsp;
                                 <Typography className={classes.secondaryHeading}> Completion Time: {task?.completionTime}</Typography>
                                 &nbsp;
                                 <Typography className={classes.secondaryHeading}> {task?.message}</Typography>
                                 &nbsp;

                             </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container>
                                        <Grid item md={9} lg={12} xl={8}>
                                            {task?.steps.map((step, stepIndex) => {
                                                return (
                                                <Accordion   >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header1"
                                                    >
                                                        <Typography className={classes.heading} ><CircularProgress size={15} className={classes.pipelineProgress} /> {step.stepName}</Typography>
                                                        <Typography className={classes.secondaryHeading}> Completion Time: {step?.completionTime}</Typography>
                                                        &nbsp;
                                                        <Typography className={classes.secondaryHeading}> {step?.reason}</Typography>
                                                        &nbsp;
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Box width="100%">
                                                            <Box width="100%">
                                                                <Typography variant="caption">Message: {step?.reason}</Typography>
                                                                <Button style={{ display: startLogStream ? 'none' : 'block' }} variant="outlined" size="small" color="primary" onClick={() => setStartLogStream(true)}>Logs</Button>
                                                            </Box>
                                                            {startLogStream && step?.containerName ?
                                                                <Box width="100%">
                                                                    <ScrollFollow
                                                                        startFollowing={true}
                                                                        render={({ follow, onScroll }) => (
                                                                            <LazyLog
                                                                                url={`${process.env.REACT_APP_API_BASE_URL}/v1/release/pipeline/logs/stream/direct?releaseId=${releaseResourceId}&podName=${step.podName}&containerName=${step.containerName}&access_token=${userContext?.currentUser?.accessToken}`}
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
                                                </Accordion>
                                            )})}
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>

                            </Accordion>
                        )})}
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )

}
export default ViewReleasePipeline;