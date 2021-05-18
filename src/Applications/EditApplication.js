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
    MenuItem
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import React, {useState, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useForm, Controller} from "react-hook-form";
import DeleteDialog from "./DeleteDialog";


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

function EditApplication() {
    document.title = "Edit Application";
    const classes = useStyles();
    const {control, register, handleSubmit, watch, reset, setValue, errors} = useForm({mode: 'onBlur'});

    let {projectResourceId, applicationResourceId} = useParams();

    let history = useHistory();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [k8sClusters, setK8sClusters] = useState([]);
    const [containerRegistries, setContainerRegistries] = useState([]);
    const [buildTools, setBuildTools] = useState([]);
    const [testConnectionLoading, setTestConnectionLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadDetails();
        loadAllK8sClusters();
        loadAllContainerRegistries();
        loadAllBuildTools();
    }, [projectResourceId]);

    function loadDetails() {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`)
            .then((response) => {
                setLoading(false);
                setValue("displayName", response.data.displayName);
                setValue("description", response.data.description);
                setValue("serviceName", response.data.serviceName);
                setValue("serviceType", response.data.serviceType);
                setValue("applicationPort", response.data.appServerPort);
                setValue("replicas", response.data.replicas);
                setValue("deploymentStrategy", response.data.deploymentStrategy);
                setValue("gitRepoUrl", response.data.gitRepoUrl);
                setValue("gitRepoUsername", response.data.gitRepoUsername);
                setValue("gitRepoPassword", response.data.gitRepoPassword);
                setValue("gitRepoBranchName", response.data.gitRepoBranchName);
                setValue("platform", response.data.platform);
                setValue("containerRegistrySettingId", response.data.containerRegistrySettingId);
                setValue("containerRegistryPath", response.data.containerRegistryPath);
                setValue("containerImageName", response.data.containerImageName);
                setValue("buildTool", response.data.buildTool);
                setValue("baseBuildPath", response.data.baseBuildPath);
                setValue("buildToolSettingId", response.data.buildToolSettingId);
                setValue("deploymentPipelineType", response.data.deploymentPipelineType);
                setValue("devKubernetesClusterSettingId", response.data.devKubernetesClusterSettingId);
                setValue("devKubernetesNamespace", response.data.devKubernetesNamespace);
                setValue("gunicornAppLocation", response.data.gunicornAppLocation);
                setValue("dotnetcoreProjectLocation", response.data.dotnetcoreProjectLocation);


            })
            .catch(() => {
                setLoading(false);
            });
    }

    function loadAllK8sClusters() {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/kubernetes-cluster-settings`)
            .then((response) => {
                setLoading(false);
                setK8sClusters(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function loadAllContainerRegistries() {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/container-registry-settings`)
            .then((response) => {
                setLoading(false);
                setContainerRegistries(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function loadAllBuildTools() {
        setLoading(true);
        axios.get(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/build-tool-settings`)
            .then((response) => {
                setLoading(false);
                setBuildTools(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            "applicationType": "WEB-APPLICATION",
            "displayName": formValues.displayName,
            "description": formValues.description,
            "serviceName": formValues.serviceName,
            "serviceType": formValues.serviceType,
            "appServerPort": formValues.applicationPort,
            "replicas": formValues.replicas,
            "deploymentStrategy": formValues.deploymentStrategy,
            "gitRepoUrl": formValues.gitRepoUrl,
            "gitRepoUsername": formValues.gitRepoUsername,
            "gitRepoPassword": formValues.gitRepoPassword,
            "gitRepoBranchName": formValues.gitRepoBranchName,
            "continuousDeployment": false,
            "gitRepoPollingInterval": 1,
            "platform": formValues.platform,
            "containerRegistrySettingId": formValues.containerRegistrySettingId,
            "containerRegistryPath": formValues.containerRegistryPath,
            "containerImageName": formValues.containerImageName,
            "buildTool": formValues.buildTool,
            "baseBuildPath": formValues.baseBuildPath,
            "buildToolSettingId": formValues.buildToolSettingId,
            "deploymentPipelineType": formValues.deploymentPipelineType,
            "devKubernetesClusterSettingId": formValues.devKubernetesClusterSettingId,
            "devKubernetesNamespace": formValues.devKubernetesNamespace,
            "prodKubernetesClusterSettingId": "",
            "prodKubernetesNamespace": "",
            "gunicornAppLocation": formValues.gunicornAppLocation,
            "dotnetcoreProjectLocation": formValues.dotnetcoreProjectLocation
        };
        // alert(JSON.stringify(data, null, 2));
        axios.put(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Application updated successfully.', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/applications`);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function testGitRepoConnection(formValues) {
        console.log(formValues);
        setTestConnectionLoading(true);

        let data = {
            repoUrl: formValues.gitRepoUrl,
            username: formValues.gitRepoUsername,
            password: formValues.gitRepoPassword
        }
        // alert(JSON.stringify(data, null, 2));
        axios.post(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/git-repo/test-connection`, data)
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

    function deleteApplication() {
        axios.delete(`${window.REACT_APP_API_BASE_URL}/v1-alpha/projects/${projectResourceId}/applications/${applicationResourceId}`)
            .then((response) => {
                closeDeleteDialog();
                enqueueSnackbar('Application deleted successfully!', {variant: 'success'});
                history.push(`/app/project/${projectResourceId}/applications`);
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
                    <Typography variant="h6" color="inherit">Application Details
                        <Typography variant="caption">
                            &nbsp; {applicationResourceId}
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
                                description={`Do you want to delete this application (${applicationResourceId}) ?`}
                                onDelete={deleteApplication}
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
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="description"
                                label="Description"
                                multiline
                                rows={1}
                                inputRef={register({
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="serviceName"
                                label="Service Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.serviceName ? true : false}
                                helperText={errors.serviceName?.message}
                            />

                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="gitRepoUrl"
                                label="Git Repository URL"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                                })}
                                error={errors.gitRepoUrl ? true : false}
                                helperText={errors.gitRepoUrl?.message}
                            />

                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="gitRepoUsername"
                                label="Git Repository User Name"
                                inputRef={register({
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.gitRepoUsername ? true : false}
                                helperText={errors.gitRepoUsername?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="gitRepoPassword"
                                label="Git Repository Token / Password"
                                type="password"
                                inputRef={register({
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.gitRepoPassword ? true : false}
                                helperText={errors.gitRepoPassword?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="gitRepoBranchName"
                                label="Git Repository Branch Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.gitRepoBranchName ? true : false}
                                helperText={errors.gitRepoBranchName?.message}
                            />
                            {/* continuous deployment */}
                            {/* polling interval */}

                            <Controller
                                name="containerRegistrySettingId"
                                control={control}
                                defaultValue={''}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Container Registry"
                                    required
                                    select
                                    error={errors.containerRegistrySettingId ? true : false}
                                    helperText={errors.containerRegistrySettingId?.message}
                                >
                                    {containerRegistries.map(registry =>
                                        <MenuItem key={registry.settingResourceId}
                                                  value={registry.settingResourceId}> {`${registry.displayName} (${registry.settingResourceId})`} </MenuItem>)}
                                </TextField>}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="containerImageName"
                                label="Container Image Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.containerImageName ? true : false}
                                helperText={errors.containerImageName?.message}
                            />
                            <Controller
                                name="buildTool"
                                control={control}
                                defaultValue={'maven-3.3'}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Build Tool"
                                    required
                                    select
                                    error={errors.buildTool ? true : false}
                                    helperText={errors.buildTool?.message}
                                >
                                    <MenuItem key="maven-3.3" value="maven-3.3"> Maven 3 </MenuItem>
                                    <MenuItem key="npm-6.14.11" value="npm-6.14.11"> NPM 6 </MenuItem>
                                    <MenuItem key="golang-1.16" value="golang-1.16"> Golang 1.16 </MenuItem>
                                    <MenuItem key="dot-net-core5" value="dot-net-core5"> Dot Net Core 5 </MenuItem>
                                    <MenuItem key="pip-3" value="pip-3"> Pip 3 </MenuItem>
                                    {/* <MenuItem key="gradle-5.5" value="gradle-5.5"> Gradle 5 </MenuItem> */}
                                </TextField>}
                            />
                            <Controller
                                name="deploymentPipelineType"
                                control={control}
                                defaultValue={'standard-dev-1.0'}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Deployment Pipeline Type"
                                    required
                                    select
                                    error={errors.deploymentPipelineType ? true : false}
                                    helperText={errors.deploymentPipelineType?.message}
                                >
                                    <MenuItem key="standard-dev-1.0" value="standard-dev-1.0"> Standard Dev Pipeline
                                        1.0 </MenuItem>
                                    {/* <MenuItem key="standard-prod-1.0" value="standard-prod-1.0"> Standard Prod Pipeline 1.0 </MenuItem> */}
                                </TextField>}
                            />
                            <Controller
                                name="devKubernetesClusterSettingId"
                                control={control}
                                defaultValue={''}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Kubernetes Cluster"
                                    required
                                    select
                                    error={errors.devKubernetesClusterSettingId ? true : false}
                                    helperText={errors.devKubernetesClusterSettingId?.message}
                                >
                                    {k8sClusters.map(cluster =>
                                        <MenuItem key={cluster.settingResourceId}
                                                  value={cluster.settingResourceId}> {`${cluster.displayName} (${cluster.settingResourceId})`} </MenuItem>)}
                                </TextField>}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="devKubernetesNamespace"
                                label="Deployment Namespace"
                                required
                                defaultValue="default"
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 100, message: "Maximum 100 characters are allowed."}
                                })}
                                error={errors.devKubernetesNamespace ? true : false}
                                helperText={errors.devKubernetesNamespace?.message}
                            />
                            {/* prod cluster */}
                            {/* prod namespace */}

                            <Controller
                                name="platform"
                                control={control}
                                defaultValue={'java-8'}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Platform"
                                    required
                                    select
                                    error={errors.platform ? true : false}
                                    helperText={errors.platform?.message}
                                >
                                    <MenuItem key="java-8" value="java-8"> Java 8 </MenuItem>
                                    <MenuItem key="java-11" value="java-11"> Java 11 </MenuItem>
                                    <MenuItem key="node-14.16.0" value="node-14.16.0"> Node 14 </MenuItem>
                                    <MenuItem key="golang-1.16" value="golang-1.16"> Golang 1.16 </MenuItem>
                                    <MenuItem key="dot-net-core5" value="dot-net-core5"> Dot Net Core 5 </MenuItem>
                                    <MenuItem key="python-3.8" value="python-3.8"> Python 3 </MenuItem>
                                    <MenuItem key="react" value="react"> ReactJS </MenuItem>
                                </TextField>}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="baseBuildPath"
                                label="Container Image Base Build Path"
                                required
                                defaultValue="/"
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                                })}
                                error={errors.baseBuildPath ? true : false}
                                helperText={errors.baseBuildPath?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="gunicornAppLocation"
                                label="Gunicorn App Location"
                                defaultValue="/"
                                inputRef={register({
                                    maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                                })}
                                error={errors.gunicornAppLocation ? true : false}
                                helperText={errors.gunicornAppLocation?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="dotnetcoreProjectLocation"
                                label="Dot Net Core Project Location"
                                defaultValue="/"
                                inputRef={register({
                                    maxLength: {value: 250, message: "Maximum 250 characters are allowed."}
                                })}
                                error={errors.dotnetcoreProjectLocation ? true : false}
                                helperText={errors.dotnetcoreProjectLocation?.message}
                            />
                            <Controller
                                name="buildToolSettingId"
                                control={control}
                                defaultValue={''}
                                // rules={{
                                //     required: "Required"
                                // }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Build Tool Settings"
                                    // required
                                    select
                                    error={errors.buildToolSettingId ? true : false}
                                    helperText={errors.buildToolSettingId?.message}
                                >
                                    {buildTools.map(buildTool =>
                                        <MenuItem key={buildTool.settingResourceId}
                                                  value={buildTool.settingResourceId}> {`${buildTool.displayName} (${buildTool.settingResourceId})`} </MenuItem>)}
                                </TextField>}
                            />
                            <Controller
                                name="serviceType"
                                control={control}
                                defaultValue={'ClusterIP'}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Service Type"
                                    required
                                    select
                                    error={errors.serviceType ? true : false}
                                    helperText={errors.serviceType?.message}
                                >
                                    <MenuItem key="ClusterIP" value="ClusterIP"> ClusterIP </MenuItem>
                                    <MenuItem key="NodePort" value="NodePort"> NodePort </MenuItem>
                                </TextField>}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="applicationPort"
                                label="Application Port"
                                required
                                type="number"
                                defaultValue={80}
                                inputRef={register({
                                    required: "Required.",
                                    min: {value: 80, message: "Minimum value allowed is 80."},
                                    max: {value: 65535, message: "Maximum value allowed is 65535."}
                                })}
                                error={errors.applicationPort ? true : false}
                                helperText={errors.applicationPort?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{shrink: true,}}
                                InputProps={{
                                    classes: {input: classes.textField},
                                }}
                                name="replicas"
                                label="Replicas"
                                required
                                type="number"
                                defaultValue={1}
                                inputRef={register({
                                    required: "Required.",
                                    min: {value: 1, message: "Minimum value allowed is 1."},
                                    max: {value: 99, message: "Maximum value allowed is 99."}
                                })}
                                error={errors.replicas ? true : false}
                                helperText={errors.replicas?.message}
                            />

                            <Controller
                                name="deploymentStrategy"
                                control={control}
                                defaultValue={'recreate'}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{shrink: true,}}
                                    InputProps={{
                                        classes: {input: classes.textField},
                                    }}
                                    label="Deployment Strategy"
                                    required
                                    select
                                    error={errors.deploymentStrategy ? true : false}
                                    helperText={errors.deploymentStrategy?.message}
                                >
                                    <MenuItem key="recreate" value="recreate"> Recreate </MenuItem>
                                    {/* <MenuItem key="ramped" value="ramped"> Ramped </MenuItem>
                                    <MenuItem key="blue/green" value="blue/green"> Blue/Green </MenuItem>
                                    <MenuItem key="canary" value="canary"> Canary </MenuItem> */}
                                </TextField>}
                            />
                            <Grid container>
                                <Button
                                    className={classes.button}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleSubmit(testGitRepoConnection)}
                                    disabled={testConnectionLoading || loading}>
                                    {testConnectionLoading ?
                                        <React.Fragment>
                                            <CircularProgress size={15} className={classes.circularProgress}/>
                                            <Typography variant="caption">
                                                &nbsp; Test Git Connection
                                            </Typography>
                                        </React.Fragment>
                                        : "Test Git Connection"}
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

export default EditApplication;