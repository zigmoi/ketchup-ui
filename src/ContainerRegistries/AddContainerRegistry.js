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

function AddContainerRegistry() {
    document.title = "Add Container Registry";
    const classes = useStyles();
    let { projectResourceId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    function showFields(formik) {
        let details;
        let registryType = formik.values.type;
        if (registryType === "local") {
            details = (
                <React.Fragment>
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="registryUrl"
                        label="Registry URL"
                        required
                        {...formik.getFieldProps('registryUrl')}
                        {...getFieldErrors('registryUrl', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="repository"
                        label="Repository"
                        {...formik.getFieldProps('repository')}
                        {...getFieldErrors('repository', formik)}
                    />
                </React.Fragment>);
        } else if (registryType === "docker-hub") {
            details = (
                <React.Fragment>
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            classes: { input: classes.textField },
                            readOnly: true,
                            value: 'index.docker.io'
                        }}
                        id="registryUrl"
                        label="Registry URL"
                        required
                        {...formik.getFieldProps('registryUrl')}
                        {...getFieldErrors('registryUrl', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="username"
                        label="User Name"
                        required
                        {...formik.getFieldProps('username')}
                        {...getFieldErrors('username', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="password"
                        label="Password"
                        required
                        type="password"
                        {...formik.getFieldProps('password')}
                        {...getFieldErrors('password', formik)}
                    />
                </React.Fragment>);
        } else if (registryType === "gcr") {
            details = (
                <React.Fragment>
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            classes: { input: classes.textField },
                            readOnly: true,
                            value: 'gcr.io'
                        }}
                        id="registryUrl"
                        label="Registry URL"
                        required
                        {...formik.getFieldProps('registryUrl')}
                        {...getFieldErrors('registryUrl', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="repository"
                        label="Project ID"
                        required
                        {...formik.getFieldProps('repository')}
                        {...getFieldErrors('repository', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="username"
                        label="User Name"
                        required
                        {...formik.getFieldProps('username')}
                        {...getFieldErrors('username', formik)}
                    />
                    <TextField
                        variant="outlined" size="small" fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{ classes: { input: classes.textField } }}
                        id="password"
                        label="Password"
                        required
                        type="password"
                        {...formik.getFieldProps('password')}
                        {...getFieldErrors('password', formik)}
                    />
                </React.Fragment>);
        } else {
            details = null;
            enqueueSnackbar('Unsupported Registry Type!', { variant: 'error' });
        }
        return details;
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Add Container Registry</Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <Formik
                            initialValues={{ displayName: '', type: 'local', registryUrl: '', repository: '', username: '', password: '' }}
                            validationSchema={Yup.object({
                                displayName: Yup.string()
                                    .max(50, 'Must be 50 characters or less')
                                    .required('Required'),
                                type: Yup.string()
                                    .required('Required')
                                    .oneOf(
                                        ['local', 'docker-hub', 'gcr'],
                                        'Invalid Registry Type!'
                                    ),
                                registryUrl: Yup.string()
                                    .when('type', {
                                        is: 'local',
                                        then: Yup.string()
                                                 .required("Required")
                                                 .max(200, 'Must be 200 characters or less')
                                    }),
                                repository: Yup.string()
                                    .max(100, 'Must be 100 characters or less')
                                    .when('type', {
                                        is: 'gcr',
                                        then: Yup.string().required("Required")
                                    }),
                                username: Yup.string()
                                    .max(100, 'Must be 100 characters or less')
                                    .when('type', {
                                        is: 'gcr' || 'docker-hub',
                                        then: Yup.string().required("Required")
                                    }),
                                password: Yup.string()
                                    .max(5000, 'Must be 5000 characters or less')
                                    .when('type', {
                                        is: 'gcr' || 'docker-hub',
                                        then: Yup.string().required("Required")
                                    }),
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                setLoading(true);
                                
                                let registryUrl = "";
                                if(values.type === "docker-hub"){
                                    registryUrl = "index.docker.io";
                                }else if(values.type === "gcr"){
                                    registryUrl = "gcr.io";
                                }else{
                                    registryUrl = values.registryUrl ? values.registryUrl : "";
                                }

                                let data = {
                                    'projectId': projectResourceId,
                                    'displayName': values.displayName,
                                    'type': values.type,
                                    'registryUrl': registryUrl,
                                    'repository': values.repository ? values.repository : "",
                                    'registryUsername': values.username ? values.username : "",
                                    'registryPassword': values.password ? values.password : "",
                                };
                                //  alert(JSON.stringify(data, null, 2));
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/container-registry`, data)
                                    .then((response) => {
                                        console.log(response);
                                        setLoading(false);
                                        setSubmitting(false);
                                        enqueueSnackbar('Container registry added successfully.', { variant: 'success' });
                                        history.push(`/app/project/${projectResourceId}/container-registries`);
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
                                        <MenuItem key="local" value="local">Local</MenuItem>
                                        <MenuItem key="docker-hub" value="docker-hub">Docker Hub</MenuItem>
                                        <MenuItem key="gcr" value="gcr">GCR</MenuItem>
                                    </TextField>
                                    {showFields(formik)}
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
export default AddContainerRegistry;