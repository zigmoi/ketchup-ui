import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Toolbar,
    Typography,
    MenuItem
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {LazyLog, ScrollFollow} from 'react-lazylog';
import UserContext from '../UserContext';

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
}));

function ViewApplicationLogs() {
    document.title = "Application Logs";
    const classes = useStyles();
    let {projectResourceId, applicationResourceId} = useParams();

    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const logViewerHeight = 600;
    const userContext = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [instances, setInstances] = useState([]);
    const [selectedInstance, setSelectedInstance] = useState('');
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState('');
    const [logUrl, setLogUrl] = useState("");
    const [streaming, setStreaming] = useState(false);

    useEffect(() => {
        setInstances([]);
        setSelectedInstance('');
        setApplications([]);
        setSelectedApplication('');
        if (applicationResourceId) {
            getAllInstances(applicationResourceId);
        } else {
            getAllApplications();
        }
    }, [projectResourceId, applicationResourceId]);

    function getAllInstances(selectedApplicationResourceId) {
        setLoading(true);
        setSelectedInstance('');
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${selectedApplicationResourceId}/instances`)
            .then((response) => {
                setLoading(false);
                setInstances(response.data);
                if (response.data.length === 1) {
                    setSelectedInstance(response.data[0]);
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function getAllApplications() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications`)
            .then((response) => {
                setLoading(false);
                setApplications(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function toggleStreaming() {
        if (streaming) {
            setStreaming(false);
            stopStreaming();
        } else {
            setStreaming(true);
            startStreaming();
        }
    }

    function startStreaming() {
        let url;
        if (applicationResourceId) {
            url = `${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions/active/application-logs/stream?podName=${selectedInstance}&containerName=1&access_token=${userContext?.currentUser?.accessToken}`
        } else {
            url = `${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${selectedApplication}/revisions/active/application-logs/stream?podName=${selectedInstance}&containerName=1&access_token=${userContext?.currentUser?.accessToken}`
        }
        setLogUrl(url);
    }

    function stopStreaming() {
        setLogUrl("");
    }

    function handleStreamingError() {
        toggleStreaming();
        enqueueSnackbar('Error encountered, please try again.', {variant: 'error'});
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        Application Logs
                        <Typography variant="caption">
                            &nbsp; {applicationResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={5}>
                    <Box m={2}>
                        <Box width="100%" display="flex" alignItems="center">
                            {applicationResourceId ? null :
                                <TextField
                                    name="applications"
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    style={{width: '40%', margin: '4px'}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Applications"
                                    required
                                    select
                                    value={selectedApplication}
                                    onChange={(e) => {
                                        setSelectedApplication(e.target.value);
                                        getAllInstances(e.target.value);
                                    }}
                                >
                                    {applications.map(application => <MenuItem
                                        key={application.id.applicationResourceId}
                                        value={application.id.applicationResourceId}> {application.displayName} - {application.id.applicationResourceId}</MenuItem>)}
                                </TextField>}


                            <TextField
                                name="instances"
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                style={{width: '40%', margin: '4px'}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                label="Instances"
                                required
                                select
                                value={selectedInstance}
                                onChange={(e) => setSelectedInstance(e.target.value)}
                            >
                                {instances.map(instance => <MenuItem key={instance}
                                                                     value={instance}> {instance}</MenuItem>)}
                            </TextField>
                            <Button
                                className={classes.button}
                                size="large"
                                variant="outlined"
                                color="primary"
                                disabled={!((applicationResourceId || selectedApplication) && selectedInstance)}
                                onClick={toggleStreaming}
                            >{streaming ? "Stop" : "Stream Logs"}</Button>
                        </Box>
                        {logUrl === "" ? null :
                            <Box width="100%">
                                <ScrollFollow
                                    startFollowing={true}
                                    render={({follow, onScroll}) => (
                                        <LazyLog
                                            url={logUrl}
                                            height={logViewerHeight}
                                            // width={logViewerWidth}
                                            style={{textAlign: 'left'}}
                                            stream
                                            selectableLines
                                            follow={follow}
                                            onScroll={onScroll}
                                            onError={handleStreamingError}
                                            enableSearch/>
                                    )}
                                />
                            </Box>}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}

export default ViewApplicationLogs;