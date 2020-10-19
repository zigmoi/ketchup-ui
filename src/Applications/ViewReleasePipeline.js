import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Toolbar,
    Typography,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Icon,
    IconButton
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import UserContext from '../UserContext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PipelineTaskStatusView from './PipelineTaskStatusView';
import PipelineStepView from './PipelineStepView';
import CancelIcon from '@material-ui/icons/Cancel';
import {format, formatDistanceStrict} from 'date-fns';

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
    }
}));

function ViewReleasePipeline() {
    document.title = "Deployment Pipeline";
    const classes = useStyles();
    const logViewerHeight = 350;

    let {projectResourceId, deploymentResourceId, releaseResourceId} = useParams();
    let history = useHistory();
    const userContext = useContext(UserContext);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [cancellingPipeline, setCancellingPipeline] = useState(false);
    const [statusJson, setStatusJson] = useState("");


    let statusSource;
    useEffect(() => {
        document.title = "Build Pipeline Details";
    }, []);

    useEffect(() => {
        let access_token = userContext.currentUser ? userContext.currentUser.accessToken : "";
        if (access_token === "") {
            return;
        }
        statusSource = new EventSource(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/release/pipeline/status/stream/sse?releaseId=${releaseResourceId}&access_token=${access_token}`);
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
        pipelineStatusView = (<Chip label="SUCCESS" style={{backgroundColor: 'green', color: 'white'}}/>);
    } else if (statusJson?.status === "Unknown" && statusJson?.reason === "Running") {
        pipelineStatusView = (
            <React.Fragment>
                <Chip label="IN PROGRESS" style={{backgroundColor: 'teal', color: 'white'}}/>&nbsp;
                {cancellingPipeline ?
                    <Typography variant="subtitle2">Cancelling &nbsp;<CircularProgress size={12}/></Typography> :
                    <Button color="secondary" onClick={stopPipeline}>Cancel</Button>}
            </React.Fragment>);
    } else if (statusJson?.status === "False") {
        pipelineStatusView = (<Chip label="FAILED" style={{backgroundColor: '#f44336', color: 'white'}}/>);
    } else {
        pipelineStatusView = (
            <React.Fragment>
                <Chip label="UNKNOWN" style={{backgroundColor: '#00bcd4', color: 'white'}}/>&nbsp;
                {cancellingPipeline ?
                    <Typography variant="subtitle2">Cancelling &nbsp;<CircularProgress size={12}/></Typography> :
                    <Button color="secondary" onClick={stopPipeline}>Cancel</Button>}
            </React.Fragment>);
    }

    function stopPipeline() {
        setCancellingPipeline(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/release/stop?releaseResourceId=${releaseResourceId}`)
            .then((response) => {
                setCancellingPipeline(false);
                enqueueSnackbar('Pipeline cancelled successfully.', {variant: 'success'});
            })
            .catch((error) => {
                setCancellingPipeline(false);
            });
    }


    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Deployment Pipeline
                        <Typography variant="caption">
                            &nbsp; {releaseResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={8}>
                    <Box m={1}>
                        <Paper>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box width="80%" m={2} textAlign="left">
                                    <Typography variant="subtitle2">
                                        Application ID: &nbsp;
                                        <Typography variant="caption">
                                            {deploymentResourceId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Release ID: &nbsp;
                                        <Typography variant="caption">
                                            {releaseResourceId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Start Time: &nbsp;
                                        <Typography variant="caption">
                                            {statusJson?.startTime ? format(new Date(statusJson.startTime), 'PPpp') : ""}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Completion Time: &nbsp;
                                        <Typography variant="caption">
                                            {statusJson?.completionTime ? format(new Date(statusJson.completionTime), 'PPpp') : ""}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Duration: &nbsp;
                                        <Typography variant="caption">
                                            {statusJson?.startTime && statusJson?.completionTime ?
                                                formatDistanceStrict(new Date(statusJson.completionTime), new Date(statusJson.startTime)) : ""}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Message: &nbsp;
                                        <Typography variant="caption">
                                            {statusJson?.reason}{statusJson?.message ? "," : ""} {statusJson?.message}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Box width="20%">
                                    {pipelineStatusView}
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                    <Box m={2}>
                        <br/>
                        {statusJson?.tasks?.sort((a, b) => a.order - b.order).map((task, taskIndex) => {
                            return (
                                <React.Fragment key={taskIndex}>
                                    <Accordion style={{backgroundColor: '#e9e5df'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            id="panel1bh-header"
                                        >
                                            <Box width="100%" display="flex" alignItems="center" textAlign="left">
                                                <Box m={1} width="25%">
                                                    <Typography variant="subtitle2">
                                                        Name: &nbsp;
                                                        <Typography variant="caption">
                                                            {task?.baseName}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                                <Box m={1} width="23%">
                                                    <Typography variant="subtitle2">
                                                        Start Time: &nbsp;
                                                        <Typography variant="caption">
                                                            {task?.startTime ? format(new Date(task.startTime), 'PPpp') : ""}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                                <Box m={1} width="27%">
                                                    <Typography variant="subtitle2">
                                                        Completion Time: &nbsp;
                                                        <Typography variant="caption">
                                                            {task?.completionTime ? format(new Date(task.completionTime), 'PPpp') : ""}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                                <Box m={1} width="20%">
                                                    <Typography variant="subtitle2">
                                                        Duration: &nbsp;
                                                        <Typography variant="caption">
                                                            {task?.startTime && task?.completionTime ?
                                                                formatDistanceStrict(new Date(task.completionTime), new Date(task.startTime)) : ""}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                                <Box m={1} width="5%">
                                                    <PipelineTaskStatusView statusJson={task}/>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                <Grid item md={9} lg={12} xl={8}>
                                                    {task?.steps.sort((a, b) => a.order - b.order).map((step, stepIndex) => {
                                                        return (
                                                            <React.Fragment key={stepIndex}>
                                                                <Typography variant="subtitle2">
                                                                    Message: &nbsp;
                                                                    <Typography variant="caption">
                                                                        {task?.reason}{task?.message ? "," : ""} {task?.message}
                                                                    </Typography>
                                                                </Typography>
                                                                <PipelineStepView step={step} releaseResourceId={releaseResourceId}/>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                    <br/>
                                </React.Fragment>
                            )
                        })}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}

export default ViewReleasePipeline;