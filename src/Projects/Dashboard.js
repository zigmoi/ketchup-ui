import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from "../Title";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import RecentDeployments from "../Applications/RecentDeployments";
import {Box, Button, CircularProgress} from "@material-ui/core";
import {useHistory, Link as RouterLink, useParams} from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 500
    },
    fixedHeight: {
        height: 160,
    },
    fixedHeightChart: {
        height: 220,
    },
    fixedHeightGetStarted: {
        height: 300,
    },
}));

export default function Dashboard() {
    document.title = "Dashboard"
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    let {projectResourceId} = useParams();
    console.log("Project ID:", projectResourceId);
    const [loading, setLoading] = useState(false);
    const [totalApplications, setTotalApplications] = useState(0);
    const [totalDeployments, setTotalDeployments] = useState(0);
    const [totalClusters, setTotalClusters] = useState(0);
    const [totalRegistries, setTotalRegistries] = useState(0);


    useEffect(() => {
        document.title = "Dashboard"
        loadDashboardDetails(projectResourceId);
    }, [projectResourceId]);

    function loadDashboardDetails(projectResourceId) {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/dashboard-data`)
            .then((response) => {
                setLoading(false);
                setTotalApplications(response.data.totalApplicationsCount);
                setTotalDeployments(response.data.totalDeploymentsCount);
                setTotalClusters(response.data.totalKubernetesClusterCount);
                setTotalRegistries(response.data.totalContainerRegistriesCount);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <main className={classes.content}>

            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={fixedHeightPaper}>
                            <React.Fragment>
                                <Title>Applications</Title>
                                <Typography variant="h4">
                                    {loading ? <CircularProgress size={30}
                                                                 className={classes.circularProgress}/> : totalApplications}
                                </Typography>
                                <div>
                                    <Link color="primary" component={RouterLink}
                                          to={`/app/project/${projectResourceId}/applications`}>
                                        View
                                    </Link>
                                </div>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={fixedHeightPaper}>
                            <React.Fragment>
                                <Title>Clusters</Title>
                                <Typography variant="h4">
                                    {loading ? <CircularProgress size={30}
                                                                 className={classes.circularProgress}/> : totalClusters}
                                </Typography>
                                <div>
                                    <Link color="primary" component={RouterLink}
                                          to={`/app/project/${projectResourceId}/kubernetes-clusters`}>
                                        View
                                    </Link>
                                </div>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={fixedHeightPaper}>
                            <React.Fragment>
                                <Title>Registries</Title>
                                <Typography variant="h4">
                                    {loading ? <CircularProgress size={30}
                                                                 className={classes.circularProgress}/> : totalRegistries}
                                </Typography>
                                <div>
                                    <Link color="primary" component={RouterLink}
                                          to={`/app/project/${projectResourceId}/container-registries`}>
                                        View
                                    </Link>
                                </div>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper className={fixedHeightPaper}>
                            <React.Fragment>
                                <Title>Deployments</Title>
                                <Typography variant="h4">
                                    {loading ? <CircularProgress size={30}
                                                                 className={classes.circularProgress}/> : totalDeployments}
                                </Typography>
                                {/*<div>*/}
                                {/*    <Link color="primary" component={RouterLink} to={`/app/project/${projectResourceId}/deployments`}>*/}
                                {/*        View*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                            </React.Fragment>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Title>Recent Deployments</Title>
                            <RecentDeployments projectResourceId={projectResourceId}/>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </main>
    );
}
