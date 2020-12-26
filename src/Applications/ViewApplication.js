import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Paper,
    Toolbar,
    Typography,
    Link
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import LaunchIcon from "@material-ui/icons/Launch";
import DeleteDialog from "./DeleteDialog";


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

function ViewApplication() {
    document.title = "View Application";
    const classes = useStyles();

    let {projectResourceId, applicationResourceId} = useParams();
    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [currentRevisionResponse, setCurrentRevisionResponse] = useState({});
    const [lastSuccessfulRevisionResponse, setLastSuccessfulRevisionResponse] = useState({});
    const [deploying, setDeploying] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadDetails();
        getCurrentRevision();
        getLastSuccessfulRevision();
    }, [projectResourceId, applicationResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`)
            .then((response) => {
                setLoading(false);
                setResponse(response.data);
                // setValue("type", response.data.type);
                // setValue("buildconfig", atob(response.data.fileData));
                // setLastUpdatedBy(response.data.lastUpdatedBy);
                // setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function getCurrentRevision() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/current-revision`)
            .then((response) => {
                setLoading(false);
                setCurrentRevisionResponse(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function getLastSuccessfulRevision() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/last-successful-revision`)
            .then((response) => {
                setLoading(false);
                setLastSuccessfulRevisionResponse(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deployApplication() {
        setDeploying(true);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions?commit-id=latest`, null, {timeout: 60000})
            .then((response) => {
                console.log(response);
                setDeploying(false);
                enqueueSnackbar('Application deployment started successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/revision/${response.data.revisionResourceId}`);
            })
            .catch((error) => {
                setDeploying(false);
                enqueueSnackbar('Application deployment failed!', {variant: 'error'});
            });
    }

    function deleteApplication() {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`)
            .then((response) => {
                closeDeleteDialog();
                enqueueSnackbar('Application deleted successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/applications/`);
            })
            .catch((error) => {
                closeDeleteDialog();
            });
    }

    function openDeleteDialog() {
        setOpen(true);
    }

    function closeDeleteDialog() {
        setOpen(false);
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Application Details
                        <Typography variant="caption">
                            &nbsp; {applicationResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                    <div style={{flexGrow: 1}}/>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={() => history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/edit`)}
                    >Edit</Button>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        disabled={deploying}
                        onClick={() => deployApplication()}
                    >{deploying ?
                        <React.Fragment>
                            <CircularProgress size={15} className={classes.circularProgress}/>
                            <Typography variant="caption">
                                &nbsp; Deploy
                            </Typography>
                        </React.Fragment>
                        : "Deploy"}</Button>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={() => history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/logs`)}
                    >Logs</Button>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={() => history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/revisions`)}
                    >Revisions</Button>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={() => history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/git-web-hook/generate`)}
                    >Git Web Hook URL</Button>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="secondary"
                        onClick={openDeleteDialog}
                    >Delete</Button>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={5}>
                    <DeleteDialog
                        isOpen={open}
                        title={"Confirm Delete"}
                        description={`Do you want to delete this application (${applicationResourceId}) ?`}
                        onDelete={deleteApplication}
                        onClose={closeDeleteDialog}/>
                    <Box m={1}>
                        <Paper>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box width="80%" m={2} textAlign="left">
                                    <label style={{fontWeight: 'bold'}}>General Details</label>
                                    <Typography variant="subtitle2">
                                        Display Name: &nbsp;
                                        <Typography variant="caption">
                                            {response?.displayName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Description: &nbsp;
                                        <Typography variant="caption">
                                            {response?.description}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Application Type: &nbsp;
                                        <Typography variant="caption">
                                            {response?.applicationType}
                                        </Typography>
                                    </Typography>
                                    <br/>
                                    <label style={{fontWeight: 'bold'}}>Health Status</label>
                                    <Typography variant="subtitle2">
                                        Application Health: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentStatus?.healthy ? response?.deploymentStatus?.healthy === true ? "HEALTHY" : "UNHEALTHY" : "-"}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Deployed Version Number: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentStatus?.revisionVersionNo}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Required Replicas: &nbsp;
                                        <Typography variant="caption">
                                            {response?.replicas}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Available Replicas: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentStatus?.availableReplicas}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Ready Replicas: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentStatus?.readyReplicas}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Upto Date Replicas: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentStatus?.uptoDateReplicas}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Last Successful Deployment: &nbsp;
                                        <Typography variant="caption">
                                            {lastSuccessfulRevisionResponse?.version} &nbsp; {lastSuccessfulRevisionResponse?.rollback ? `(Rollbacked to: ${lastSuccessfulRevisionResponse?.originalRevisionVersionId})` : ""}
                                        </Typography>
                                    </Typography>
                                    <br/>
                                    <label style={{fontWeight: 'bold'}}>Current Version Details</label>
                                    <Typography variant="subtitle2">
                                        Version Number: &nbsp;
                                        <Typography variant="caption">
                                            {currentRevisionResponse?.version}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Revision ID: &nbsp;
                                        <Typography variant="caption">
                                            {currentRevisionResponse?.id?.revisionResourceId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Commit ID : &nbsp;
                                        <Typography variant="caption">
                                            {currentRevisionResponse?.commitId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Deployment Status: &nbsp;
                                        <Typography variant="caption">
                                            {currentRevisionResponse?.status}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Is Rollback: &nbsp;
                                        <Typography variant="caption">
                                            {currentRevisionResponse?.rollback ? "Yes (To: " + currentRevisionResponse?.originalRevisionVersionId + ")" : "No"}
                                        </Typography>
                                    </Typography>
                                    <br/>
                                    <label style={{fontWeight: 'bold'}}>Build Details</label>
                                    <Typography variant="subtitle2">
                                        Git Repository URL: &nbsp;
                                        <Typography variant="caption">
                                            {response?.gitRepoUrl}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Git Repository Username: &nbsp;
                                        <Typography variant="caption">
                                            {response?.gitRepoUsername}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Git Repository Branch Name: &nbsp;
                                        <Typography variant="caption">
                                            {response?.gitRepoBranchName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Registry Settings: &nbsp;
                                        {response?.containerRegistrySettingId ?
                                            <Link
                                                component="button"
                                                variant="caption"
                                                color="inherit"
                                                onClick={() => {
                                                    history.push(`/app/project/${projectResourceId}/container-registry/${response?.containerRegistrySettingId}/edit`)
                                                }}
                                            >
                                                {response?.containerRegistrySettingId}
                                            </Link> : null}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Image Name: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerImageName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Platform: &nbsp;
                                        <Typography variant="caption">
                                            {response?.platform}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Build Tool: &nbsp;
                                        <Typography variant="caption">
                                            {response?.buildTool}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Base Build Path: &nbsp;
                                        <Typography variant="caption">
                                            {response?.baseBuildPath}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Build Settings: &nbsp;
                                        {response?.buildToolSettingId ?
                                            <Link
                                                component="button"
                                                variant="caption"
                                                color="inherit"
                                                onClick={() => {
                                                    history.push(`/app/project/${projectResourceId}/build-tool/${response?.buildToolSettingId}/edit`)
                                                }}
                                            >
                                                {response?.buildToolSettingId}
                                            </Link> : null}
                                    </Typography>
                                    <br/>
                                    <label style={{fontWeight: 'bold'}}>Deployment Details</label>
                                    <Typography variant="subtitle2">
                                        Pipeline: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentPipelineType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Cluster: &nbsp;
                                        {response?.devKubernetesClusterSettingId ?
                                            <Link
                                                component="button"
                                                variant="caption"
                                                color="inherit"
                                                onClick={() => {
                                                    history.push(`/app/project/${projectResourceId}/kubernetes-cluster/${response?.devKubernetesClusterSettingId}/edit`)
                                                }}
                                            >
                                                {response?.devKubernetesClusterSettingId}
                                            </Link> : null}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Namespace: &nbsp;
                                        <Typography variant="caption">
                                            {response?.devKubernetesNamespace}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Service Name: &nbsp;
                                        <Typography variant="caption">
                                            {response?.serviceName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Port: &nbsp;
                                        <Typography variant="caption">
                                            {response?.appServerPort}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        URL: &nbsp;
                                    </Typography>
                                    <br/>
                                    <Grid container>

                                    </Grid>
                                </Box>
                                <Box width="10%">
                                    {/*<Typography variant="subtitle2" >*/}
                                    {/*        Namespace: &nbsp;*/}
                                    {/*        <Typography variant="caption" >*/}
                                    {/*            {response?.devKubernetesNamespace}*/}
                                    {/*        </Typography>*/}
                                    {/*    </Typography>*/}
                                </Box>

                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}

export default ViewApplication;