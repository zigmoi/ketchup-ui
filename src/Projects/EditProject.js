import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, {useState, useEffect, useContext} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import ProjectContext from "../ProjectContext";
import useCurrentUser from "../useCurrentUser";


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

function EditProject() {
    document.title = "Project Settings";
    const classes = useStyles();
    const { control, register, handleSubmit, watch, reset, setValue, errors } = useForm({ mode: 'onBlur' });

    let { projectResourceId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const projectContext = useContext(ProjectContext);
    const currentUser = useCurrentUser();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}`)
            .then((response) => {
                setLoading(false);
                setValue("description", response.data.description);
            })
            .catch((error) => {
                setLoading(false);
            });
    }


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            'description': formValues.description,
        };
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Project updated successfully.', { variant: 'success' });
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deleteProject() {
        setLoading(true);
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}`)
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Project deleted successfully!', {variant: 'success'});
                projectContext.setCurrentProject(currentUser?.id, null);
                history.push(`/app/dashboard`);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Project Settings
                    <Typography variant="caption" >
                            &nbsp; {projectResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress} /> : null}
                    <div style={{flexGrow: 1}}/>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="secondary"
                        onClick={() => deleteProject()}
                    >Delete</Button>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="description"
                                label="Description"
                                multiline
                                rows={3}
                                inputRef={register({
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                            />

                            <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    disabled={loading}>Save</Button>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    onClick={(e) => history.goBack()}
                                >Cancel</Button>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )

}
export default EditProject;