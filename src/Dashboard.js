import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from "./Title";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import RecentReleases from "./Applications/RecentReleases";
import {Box, Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";

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
        height: 260
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

export default function Dashboard(props) {
    document.title = "Dashboard"
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightChart = clsx(classes.paper, classes.fixedHeightChart);
    const fixedHeightGetStarted = clsx(classes.paper, classes.fixedHeightGetStarted);
    let history = useHistory();
    const {projectId} = props;
    console.log("Project ID:", projectId);
    return (
        <main className={classes.content}>
            {projectId ?
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <React.Fragment>
                                    <Title>Applications</Title>
                                    <Typography component="p" variant="h4">
                                        30
                                    </Typography>
                                    <div>
                                        <Link color="primary" href="#">
                                            View
                                        </Link>
                                    </div>
                                </React.Fragment>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <React.Fragment>
                                    <Title>Releases</Title>
                                    <Typography component="p" variant="h4">
                                        100
                                    </Typography>
                                    <div>
                                        <Link color="primary" href="#">
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
                                    <Typography component="p" variant="h4">
                                        3
                                    </Typography>
                                    <div>
                                        <Link color="primary" href="#">
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
                                    <Typography component="p" variant="h4">
                                        7
                                    </Typography>
                                    <div>
                                        <Link color="primary" href="#">
                                            View
                                        </Link>
                                    </div>
                                </React.Fragment>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Title>Recent Releases</Title>
                                <RecentReleases projectId={projectId}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container> :
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <Paper className={fixedHeightGetStarted}>
                                <React.Fragment>
                                    <Title>Get Started</Title>
                                    <Typography component="p" variant="body1">
                                        Create a new project or select a existing project in menu bar.
                                    </Typography>
                                    <div>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <Button
                                            className={classes.button}
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={()=> history.push("/app/project/create")}
                                            >Create Project</Button>
                                    </div>
                                </React.Fragment>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Paper className={fixedHeightGetStarted}>
                                <React.Fragment>
                                    <Title>Documentation</Title>
                                    <Typography component="p" variant="body1">
                                        For more information refer to documentation.
                                    </Typography>
                                    <Box textAlign={"left"}>
                                        <ul>
                                            <li>
                                                <Link color="inherit" href="http://google.com" target="_blank"
                                                      rel="noopener" rel="noreferrer">
                                                    Create User.
                                                </Link>
                                            </li>
                                            <li>
                                                <Link color="inherit" href="http://google.com" target="_blank"
                                                      rel="noopener" rel="noreferrer">
                                                    Create Project.
                                                </Link>
                                            </li>
                                            <li>
                                                <Link color="inherit" href="http://google.com" target="_blank"
                                                      rel="noopener" rel="noreferrer">
                                                    Create Application.
                                                </Link>
                                            </li>
                                            <li>
                                                <Link color="inherit" href="http://google.com" target="_blank"
                                                      rel="noopener" rel="noreferrer">
                                                    Manage Permissions.
                                                </Link>
                                            </li>
                                            <li>
                                                <Link color="inherit" href="http://google.com" target="_blank"
                                                      rel="noopener" rel="noreferrer">
                                                    Check Application Logs.
                                                </Link>
                                            </li>
                                        </ul>
                                    </Box>
                                    <Link color="primary" href="http://google.com" target="_blank" rel="noopener"
                                          rel="noreferrer">
                                        More...
                                    </Link>
                                </React.Fragment>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            }
        </main>
    );
}
