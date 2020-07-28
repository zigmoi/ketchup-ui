import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';

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

function getFieldErrors(id, formik) {
    if (formik.touched[id] && formik.errors[id]) {
        return ({ error: true, helperText: formik.errors[id] });
    } else {
        return null;
    }
}

function AddBuildTool() {
    document.title = "Add Build Tool";
    const classes = useStyles();
    let { projectResourceId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Add Build Tool</Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <Formik
                            initialValues={{ displayName: '', type: '', buildconfig: '' }}
                            validationSchema={Yup.object({
                                displayName: Yup.string()
                                    .max(50, 'Must be 50 characters or less')
                                    .required('Required'),
                                type: Yup.string()
                                    .required('Required')
                                    .oneOf(
                                        ['maven-3.3', 'gradle-5.5'],
                                        'Invalid Build Tool Type!'
                                      ),
                                buildconfig: Yup.string()
                                    .max(65536, 'Must be 65536 characters or less')
                                    .required('Required'),

                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                setLoading(true);
                                let data = {
                                    'projectId': projectResourceId,
                                    'displayName': values.displayName,
                                    'type': values.type,
                                    'fileData': btoa(values.buildconfig),
                                };
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/build-tool`, data)
                                    .then((response) => {
                                        console.log(response);
                                        setLoading(false);
                                        setSubmitting(false);
                                        enqueueSnackbar('Build tool added successfully.', { variant: 'success' });
                                        history.push(`/app/project/${projectResourceId}/build-tools`);
                                    })
                                    .catch(() => {
                                        setLoading(false);
                                        setSubmitting(false);
                                    });
                            }}
                        >
                            {formik =>
                                <Form onSubmit={formik.handleSubmit}>
                                    <TextField
                                        variant="outlined" size="small" fullWidth margin="normal"
                                        InputLabelProps={{ shrink: true, }}
                                        InputProps={{ classes: { input: classes.textField } }}
                                        id="displayName"
                                        label="Display Name"
                                        required
                                        {...formik.getFieldProps('displayName')}
                                        {...getFieldErrors('displayName', formik)}
                                    />
                                    <TextField
                                        variant="outlined" size="small" fullWidth margin="normal"
                                        InputLabelProps={{ shrink: true, }}
                                        InputProps={{ classes: { input: classes.textField } }}
                                        id="type"
                                        label="Type"
                                        required
                                        select
                                        {...formik.getFieldProps('type')}
                                        {...getFieldErrors('type', formik)}
                                    >
                                            <MenuItem key="maven-3.3" value="maven-3.3">Maven 3.3</MenuItem>
                                            <MenuItem key="gradle-5.5" value="gradle-5.5">Gradle 5.5</MenuItem>
                                    </TextField>
                                    <TextField
                                        variant="outlined" size="small" fullWidth margin="normal"
                                        InputLabelProps={{ shrink: true, }}
                                        InputProps={{ classes: { input: classes.textField } }}
                                        id="buildconfig"
                                        label="Build Configuration"
                                        required
                                        multiline
                                        rows={18}
                                        {...formik.getFieldProps('buildconfig')}
                                        {...getFieldErrors('buildconfig', formik)}
                                    />
                                    <Grid container>
                                        <Button
                                            className={classes.button}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            type="submit"
                                            disabled={loading}>Add</Button>
                                        <Button
                                            className={classes.button}
                                            size="small"
                                            variant="outlined"
                                            onClick={(e) => history.goBack()}
                                        >Cancel</Button>
                                    </Grid>
                                </Form>
                            }
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}
export default AddBuildTool;