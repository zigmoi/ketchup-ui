import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";


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

function AddContainerRegistry() {
    document.title = "Add Container Registry";
    const classes = useStyles();
    const { control, register, handleSubmit, watch, reset, setValue, errors } = useForm({ mode: 'onBlur' });

    let { projectResourceId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { type } = watch();

    useEffect(() => {
        if(type === "docker-hub"){
            setValue("registryUrl", "index.docker.io");
        }else if(type === "gcr"){
            setValue("registryUrl", "gcr.io");
        }else{
            setValue("registryUrl", "");
        }
    }, [type]);

    let dependentFields;
    let registryType = type;
    if (registryType === "local") {
        dependentFields = (
            <React.Fragment>
                <Controller
                    name="registryUrl"
                    label="Registry URL"
                    as={<TextField />}
                    control={control}
                    defaultValue=""
                    required
                    rules={{ 
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed." } 
                    }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                >
                </Controller>
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="repository"
                    label="Repository"
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                    })}
                    error={errors.repository ? true : false}
                    helperText={errors.repository?.message}
                />
            </React.Fragment>);
    } else if (registryType === "docker-hub") {
        dependentFields = (
            <React.Fragment>
                <Controller
                    name="registryUrl"
                    label="Registry URL"
                    as={<TextField />}
                    control={control}
                    defaultValue=""
                    required
                    rules={{ 
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed." }
                     }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{
                        classes: { input: classes.textField },
                        readOnly: true,
                    }}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                ></Controller>
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="username"
                    label="User Name"
                    required
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                    })}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="password"
                    label="Password"
                    required
                    type="password"
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                    })}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                />
            </React.Fragment>);
    } else if (registryType === "gcr") {
        dependentFields = (
            <React.Fragment>
                <Controller
                    name="registryUrl"
                    label="Registry URL"
                    as={<TextField />}
                    control={control}
                    defaultValue=""
                    required
                    rules={{ 
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed." }
                     }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{
                        classes: { input: classes.textField },
                        readOnly: true,
                    }}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                ></Controller>
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="repository"
                    label="Project ID"
                    required
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                    })}
                    error={errors.repository ? true : false}
                    helperText={errors.repository?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="username"
                    label="User Name"
                    required
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                    })}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{ shrink: true, }}
                    InputProps={{ classes: { input: classes.textField } }}
                    name="password"
                    label="Password"
                    required
                    type="password"
                    inputRef={register({ 
                        required: "Required.",
                        maxLength: {value: 5000, message: "Maximum 5000 characters are allowed." }
                    })}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                />
            </React.Fragment>);
    } else {
        dependentFields = null;
    }

    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            'projectResourceId': projectResourceId,
            'displayName': formValues.displayName,
            'type': formValues.type,
            'registryUrl': formValues.registryUrl,
            'repository': formValues.repository ? formValues.repository : "",
            'registryUsername': formValues.username ? formValues.username : "",
            'registryPassword': formValues.password ? formValues.password : "",
        };
        //alert(JSON.stringify(data, null, 2));
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/container-registry-settings`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Container registry added successfully.', { variant: 'success' });
                history.push(`/app/project/${projectResourceId}/container-registries`);
            })
            .catch(() => {
                setLoading(false);
            });
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="displayName"
                                label="Display Name"
                                required
                                inputRef={register({ 
                                    required: "Required.",
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.displayName ? true : false}
                                helperText={errors.displayName?.message}
                            />
                            <FormControl
                                variant="outlined" size="small"
                                fullWidth margin="normal"
                                required
                                error={Boolean(errors.type)}
                            >
                                <InputLabel shrink>Type</InputLabel>
                                <Controller
                                    name="type"
                                    rules={{ required: "this is required" }}
                                    defaultValue="local"
                                    label="Type"
                                    control={control}
                                    as={
                                        <Select>
                                            <MenuItem key="local" value="local">Local</MenuItem>
                                            <MenuItem key="docker-hub" value="docker-hub">Docker Hub</MenuItem>
                                            <MenuItem key="gcr" value="gcr">GCR</MenuItem>
                                        </Select>
                                    }
                                >
                                </Controller>
                                <FormHelperText>
                                    {errors.type && errors.type.message}
                                </FormHelperText>
                            </FormControl>
                            {dependentFields}
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
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )

}
export default AddContainerRegistry;