import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useForm} from "react-hook-form";
import ProjectContext from '../ProjectContext';
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

function CreateProject() {
    document.title = "Create Project";
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {register, handleSubmit, errors} = useForm({mode: 'onBlur'});

    let history = useHistory();
    const projectContext = useContext(ProjectContext);
    const currentUser = useCurrentUser();
    const [loading, setLoading] = useState(false);

    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            'projectResourceId': formValues.projectName,
            'description': formValues.description,
        };
        //  alert(JSON.stringify(data, null, 2));
        axios.post(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Project created successfully.', {variant: 'success'});
                projectContext.setCurrentProject(currentUser?.id, formValues.projectName);
                history.push(`/app/project/${formValues.projectName}/dashboard`);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Create Project</Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
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
                                name="projectName"
                                label="Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    pattern: {
                                        value: /^[a-z0-9]+$/i,
                                        message: "Only alphabets and numbers are allowed."
                                    },
                                    minLength: {value: 2, message: "Minimum 2 characters are required."},
                                    maxLength: {value: 20, message: "Maximum 20 characters are allowed."}
                                })}
                                error={errors.projectName ? true : false}
                                helperText={errors.projectName?.message}
                            />
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
                                    disabled={loading}>Create</Button>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => history.goBack()}
                                >Cancel</Button>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )

}

export default CreateProject;