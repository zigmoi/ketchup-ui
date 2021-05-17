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

function ViewApplicationRevision() {
    document.title = "Revision Details";
    const classes = useStyles();

    let {projectResourceId, applicationResourceId, revisionResourceId} = useParams();
    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, applicationResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}/revisions/${revisionResourceId}`)
            .then((response) => {
                setLoading(false);
                setResponse(response.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Revision Details
                        <Typography variant="caption">
                            &nbsp; {revisionResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                    <div style={{flexGrow: 1}}/>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="primary"
                        disabled={response?.rollback}
                        onClick={() => history.push(`/app/project/${projectResourceId}/application/${applicationResourceId}/revision/${revisionResourceId}/pipeline`)}
                    >Pipeline</Button>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={5}>
                    <Box m={1}>
                        <Paper>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box width="80%" m={2} textAlign="left">
                                    <label style={{fontWeight: 'bold'}}>General Details</label>
                                    <Typography variant="subtitle2">
                                        Application Type: &nbsp;
                                        <Typography variant="caption">
                                            {response?.applicationType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Version Number: &nbsp;
                                        <Typography variant="caption">
                                            {response?.version}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Commit ID : &nbsp;
                                        <Typography variant="caption">
                                            {response?.commitId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Helm Release ID : &nbsp;
                                        <Typography variant="caption">
                                            {response?.helmReleaseId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Helm Release Version : &nbsp;
                                        <Typography variant="caption">
                                            {response?.helmReleaseVersion}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Deployment Status: &nbsp;
                                        <Typography variant="caption">
                                            {response?.status}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Is Rollback: &nbsp;
                                        <Typography variant="caption">
                                            {response?.rollback ? "Yes (To: " + response?.originalRevisionVersionId + ")" : "No"}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Trigger Type: &nbsp;
                                        <Typography variant="caption">
                                            {response?.deploymentTriggerType}
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
                                        Container Registry Type: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerRegistryType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Registry URL: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerRegistryUrl}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Registry Repository Name: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerRepositoryName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Registry Username: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerRegistryUsername}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Container Registry Redis URL: &nbsp;
                                        <Typography variant="caption">
                                            {response?.containerRegistryRedisUrl}
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
                                        Gunicorn App Location: &nbsp;
                                        <Typography variant="caption">
                                            {response?.gunicornAppLocation}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Dot Net Core Project Location: &nbsp;
                                        <Typography variant="caption">
                                            {response?.dotnetcoreProjectLocation}
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
                                        Cluster Settings: &nbsp;
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
                                        Cluster Base Address: &nbsp;
                                        <Typography variant="caption">
                                            {response?.devKubernetesBaseAddress}
                                        </Typography>
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
                                        Service Type: &nbsp;
                                        <Typography variant="caption">
                                            {response?.serviceType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Port: &nbsp;
                                        <Typography variant="caption">
                                            {response?.appServerPort}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Required Replicas: &nbsp;
                                        <Typography variant="caption">
                                            {response?.replicas}
                                        </Typography>
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

export default ViewApplicationRevision;