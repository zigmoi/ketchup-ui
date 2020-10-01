import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from "./Title";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import RecentReleases from "./Applications/RecentReleases";

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
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightChart = clsx(classes.paper, classes.fixedHeightChart);

  return (
      <main className={classes.content}>
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
                    <Link color="primary" href="#" >
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
                    <Link color="primary" href="#" >
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
                    <Link color="primary" href="#" >
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
                    <Link color="primary" href="#" >
                      View
                    </Link>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Title>Recent Releases</Title>
                <RecentReleases />
              </Paper>
            </Grid>
           </Grid>
        </Container>
      </main> 
  );
}
