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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";


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

function EditK8sCluster() {
    document.title = "Edit Kubernetes Cluster";
    const classes = useStyles();
    const {control, register, handleSubmit, watch, reset, setValue, errors} = useForm({mode: 'onBlur'});

    let {projectResourceId, settingResourceId} = useParams();

    const [loading, setLoading] = useState(false);
    const [testConnectionLoading, setTestConnectionLoading] = useState(false);
    const [open, setOpen] = useState(false);
    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingResourceId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings/${settingResourceId}`)
            .then((response) => {
                setLoading(false);
                setValue("displayName", response.data.displayName);
                setValue("kubeconfig", atob(response.data.kubeconfig));
                // setLastUpdatedBy(response.data.lastUpdatedBy);
                // setLastUpdatedOn(response.data.lastUpdatedOn);
            })
            .catch((error) => {
                setLoading(false);
            });
    }


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            'projectResourceId': projectResourceId,
            'displayName': formValues.displayName,
            'kubeconfig': btoa(formValues.kubeconfig),
        };
        // alert(JSON.stringify(data, null, 2));
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings/${settingResourceId}`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Kubernetes cluster updated successfully.', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/kubernetes-clusters`);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function testConnection(formValues) {
        console.log(formValues);
        setTestConnectionLoading(true);

        let data = {
            'projectResourceId': projectResourceId,
            'displayName': formValues.displayName,
            'kubeconfig': btoa(formValues.kubeconfig),
        };
        // alert(JSON.stringify(data, null, 2));
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings/test-connection`, data)
            .then((response) => {
                console.log(response);
                setTestConnectionLoading(false);
                if (response.data.status === "success") {
                    enqueueSnackbar('Test connection successful.', {variant: 'success'});
                } else {
                    enqueueSnackbar('Test connection failed.', {variant: 'error'});
                }
            })
            .catch(() => {
                setTestConnectionLoading(false);
            });
    }

    function deleteSetting() {
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings/${settingResourceId}`)
            .then((response) => {
                closeDeleteDialog();
                enqueueSnackbar('Setting deleted successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/kubernetes-clusters`);
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
                    <Typography variant="h6" color="inherit">Edit Kubernetes Cluster
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
                        <DeleteDialog
                            isOpen={open}
                            title={"Confirm Delete"}
                            description={`Do you want to delete this setting (${settingResourceId}) ?`}
                            onDelete={deleteSetting}
                            onClose={closeDeleteDialog}/>
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
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="kubeconfig"
                                label="Kubeconfig"
                                required
                                multiline
                                rows={20}
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 65535, message: "Maximum 65535 characters are allowed."}
                                })}
                                error={errors.kubeconfig ? true : false}
                                helperText={errors.kubeconfig?.message}
                            />

                            <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleSubmit(testConnection)}
                                    disabled={testConnectionLoading || loading}>
                                    {testConnectionLoading ?
                                        <React.Fragment>
                                            <CircularProgress size={15} className={classes.circularProgress}/>
                                            <Typography variant="caption">
                                                &nbsp; Test Connection
                                            </Typography>
                                        </React.Fragment>
                                        : "Test Connection"}
                                </Button>
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

export default EditK8sCluster;