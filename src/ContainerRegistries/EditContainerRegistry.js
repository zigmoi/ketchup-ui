import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Toolbar,
    Typography,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
    InputLabel
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useForm, Controller} from "react-hook-form";
import DeleteDialog from "../Applications/DeleteDialog";


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

function EditContainerRegistry() {
    document.title = "Edit Container Registry";
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {control, register, handleSubmit, watch, reset, setValue, errors} = useForm({mode: 'onBlur'});

    let history = useHistory();
    let {projectResourceId, settingResourceId} = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {type} = watch();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/container-registry-settings/${settingResourceId}`)
            .then((response) => {
                setLoading(false);
                setValue("displayName", response.data.displayName);
                setValue("type", response.data.type);
                setValue("registryUrl", response.data.registryUrl);
                setValue("repository", response.data.repository);
                setValue("username", response.data.registryUsername);
                setValue("password", response.data.registryPassword);
                setValue("redisUrl", response.data.redisUrl);
                setValue("redisPassword", response.data.redisPassword);
                // setLastUpdatedBy(response.data.lastUpdatedBy);
                // setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    useEffect(() => {
        setValue("repository", "");
        setValue("username", "");
        setValue("password", "");
        if (type === "docker-hub") {
            setValue("registryUrl", "index.docker.io");

        } else if (type === "gcr") {
            setValue("registryUrl", "gcr.io");
        } else {
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
                    as={<TextField/>}
                    control={control}
                    defaultValue=""
                    required
                    rules={{
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                    }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                >
                </Controller>
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="repository"
                    label="Repository"
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
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
                    as={<TextField/>}
                    control={control}
                    defaultValue=""
                    required
                    rules={{
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                    }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{
                        classes: {input: classes.textField},
                        readOnly: true,
                    }}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="username"
                    label="User Name"
                    required
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                    })}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="password"
                    label="Password"
                    required
                    type="password"
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
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
                    as={<TextField/>}
                    control={control}
                    defaultValue=""
                    required
                    rules={{
                        required: "Required.",
                        maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                    }}
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{
                        classes: {input: classes.textField},
                        readOnly: true,
                    }}
                    error={errors.registryUrl ? true : false}
                    helperText={errors.registryUrl?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="repository"
                    label="Project ID"
                    required
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                    })}
                    error={errors.repository ? true : false}
                    helperText={errors.repository?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="username"
                    label="User Name"
                    required
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                    })}
                    error={errors.username ? true : false}
                    helperText={errors.username?.message}
                />
                <TextField
                    variant="outlined" size="small" fullWidth margin="normal"
                    InputLabelProps={{shrink: true,}}
                    InputProps={{classes: {input: classes.textField}}}
                    name="password"
                    label="Password"
                    required
                    type="password"
                    inputRef={register({
                        required: "Required.",
                        maxLength: {value: 5000, message: "Maximum 5000 characters are allowed."}
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
            'displayName': formValues.displayName,
            'type': formValues.type,
            'registryUrl': formValues.registryUrl,
            'repository': formValues.repository ? formValues.repository : "",
            'registryUsername': formValues.username ? formValues.username : "",
            'registryPassword': formValues.password ? formValues.password : "",
            'redisUrl': formValues.redisUrl,
            'redisPassword': formValues.redisPassword,
        };
        //alert(JSON.stringify(data, null, 2));
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/container-registry-settings/${settingResourceId}`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Container registry updated successfully.', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/container-registries`);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function deleteSetting() {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/container-registry-settings/${settingResourceId}`)
            .then((response) => {
                closeDeleteDialog();
                enqueueSnackbar('Setting deleted successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/container-registries`);
            })
            .catch((error) => {
                closeDeleteDialog();
            });
    }

    function openDeleteDialog() {
        setOpen(true);
    }

    function closeDeleteDialog() {
        setOpen(false);
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Edit Container Registry
                        <Typography variant="caption">
                            &nbsp; {settingResourceId}
                        </Typography>
                    </Typography>
                    {loading ? <CircularProgress size={15} className={classes.circularProgress}/> : null}
                    <div style={{flexGrow: 1}}/>
                    <Button
                        className={classes.button}
                        size="small"
                        variant="text"
                        color="secondary"
                        onClick={openDeleteDialog}
                    >Delete</Button>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item md={9} lg={6} xl={5}>
                    <Box m={2}>
                        {open ?
                            <DeleteDialog
                                isOpen={open}
                                title={"Confirm Delete"}
                                description={`Do you want to delete this setting (${settingResourceId}) ?`}
                                onDelete={deleteSetting}
                                onClose={closeDeleteDialog}/> : null}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="displayName"
                                label="Display Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    pattern: {
                                        value: /^[a-z0-9- ]+$/i,
                                        message: "Only alphabets, numbers, space and dash (-) are allowed."
                                    },
                                    maxLength: {value: 50, message: "Maximum 50 characters are allowed."}
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
                                    rules={{required: "this is required"}}
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
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="redisUrl"
                                label="Redis Url (Cache)"
                                inputRef={register({
                                    maxLength: {value: 250, message: "Maximum 250 characters are allowed." }
                                })}
                                error={errors.redisUrl ? true : false}
                                helperText={errors.redisUrl?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="redisPassword"
                                label="Redis Password"
                                type="password"
                                inputRef={register({
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.redisPassword ? true : false}
                                helperText={errors.redisPassword?.message}
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
        </Container>
    )

}

export default EditContainerRegistry;