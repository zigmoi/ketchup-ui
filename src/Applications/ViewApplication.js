import { AppBar, Box, Button, CircularProgress, Container, Grid, Paper, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';


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

    let { projectResourceId, deploymentResourceId } = useParams();
    let history = useHistory();

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, deploymentResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/project/${projectResourceId}/deployments/basic-spring-boot/${deploymentResourceId}`)
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

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Application Details
                    <Typography variant="caption" >
                            &nbsp; {deploymentResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={12} xl={5}>
                <Box m={1}>
                        <Paper>
                            <Box width="100%" display="flex" alignItems="center">
                                <Box width="80%" m={2} textAlign="left">
                                    <Typography variant="subtitle2" >
                                        Display Name: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.displayName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Description: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.description}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Active Version: &nbsp;
                                        <Typography variant="caption" >
                                           "v3" {"releaseResourceId"}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Application Type: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.applicationType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Service Name: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.serviceName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Port: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.appServerPort}
                                        </Typography>
                                    </Typography>                                    
                                    <Typography variant="subtitle2" >
                                        Replicas: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.replicas}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Git Repository URL: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.gitRepoUrl}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Git Repository Username: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.gitRepoUsername}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Git Repository Branch Name: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.gitRepoBranchName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Platform: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.platform}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Container Registry Settings: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.containerRegistrySettingId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Container Image Name: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.containerImageName}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Build Tool: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.buildTool}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Base Build Path: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.baseBuildPath}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Build Settings: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.buildToolSettingId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Deployment Pipeline: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.deploymentPipelineType}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Kubernetes Cluster: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.devKubernetesClusterSettingId}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Namespace: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.devKubernetesNamespace}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        Health View, URL, Current Commit, &nbsp;
                                    </Typography>
                                    <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                >Logs</Button>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/history`)}
                                >History</Button>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => history.push(`/app/project/${projectResourceId}/application/${deploymentResourceId}/history`)}
                                >Deploy</Button>
                            </Grid>
                                </Box>
                                <Box width="10%">
                                {/* <Typography variant="subtitle2" >
                                        Namespace: &nbsp;
                                        <Typography variant="caption" >
                                            {response?.devKubernetesNamespace}
                                        </Typography>
                                    </Typography> */}
                                </Box>
                                
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )

}
export default ViewApplication;