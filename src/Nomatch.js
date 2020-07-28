import { Container, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(1),
        fontSize: '12px',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: 'white',
    },
}));

function Nomatch() {
    document.title = "Access Denied";
    const classes = useStyles();
    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <span>
                            Page Not Found!
                        </span>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Nomatch;