import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import ProjectContext from '../ProjectContext';

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

function CreateProject() {
    document.title = "Create Project";
    const classes = useStyles();
    const projectContext = useContext(ProjectContext);

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Create Project</Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <Formik
                            initialValues={{ projectName: '', description: '' }}
                            validationSchema={Yup.object({
                                projectName: Yup.string()
                                    .max(50, 'Must be 50 characters or less')
                                    .required('Required'),
                                description: Yup.string()
                                    .max(100, 'Must be 100 characters or less'),

                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                setLoading(true);
                                let data = {
                                    'projectResourceId': values.projectName,
                                    'description': values.description,
                                };
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/project`, data)
                                    .then((response) => {
                                        console.log(response);
                                        setLoading(false);
                                        setSubmitting(false);
                                        enqueueSnackbar('Project created successfully.', { variant: 'success' });
                                        projectContext.setCurrentProject({ "projectId": values.projectName });
                                        history.push(`/app/project/${values.projectName}/applications`);
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
                                        id="projectName"
                                        label="Project Name"
                                        required
                                        {...formik.getFieldProps('projectName')}
                                        {...getFieldErrors('projectName', formik)}
                                    />
                                    <TextField
                                        variant="outlined" size="small" fullWidth margin="normal"
                                        InputLabelProps={{ shrink: true, }}
                                        InputProps={{ classes: { input: classes.textField } }}
                                        id="description"
                                        label="Description"
                                        multiline
                                        rows={3}
                                        {...formik.getFieldProps('description')}
                                        {...getFieldErrors('description', formik)}
                                    />
                                    <Grid container>
                                        <Button
                                            className={classes.button}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            type="submit"
                                            disabled={loading}>Create</Button>
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
export default CreateProject;