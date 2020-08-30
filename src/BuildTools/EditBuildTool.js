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

function EditBuildTool() {
    document.title = "Edit Build Tool";
    const classes = useStyles();
    const { control, register, handleSubmit, watch, reset, setValue, errors } = useForm({ mode: 'onBlur' });

    let { projectResourceId, settingId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        loadDetails();
    }, [projectResourceId, settingId]);


    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/build-tool/${projectResourceId}/${settingId}`)
            .then((response) => {
                setLoading(false);
                setValue("displayName", response.data.displayName);
                setValue("type", response.data.type);
                setValue("buildconfig", atob(response.data.fileData));
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
            'projectId': projectResourceId,
            'displayName': formValues.displayName,
            'type': formValues.type,
            'fileData': btoa(formValues.buildconfig),
        };
        // alert(JSON.stringify(data, null, 2));
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1/settings/build-tool/${projectResourceId}/${settingId}`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Build tool updated successfully.', { variant: 'success' });
                history.push(`/app/project/${projectResourceId}/build-tools`);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Edit Build Tool
                    <Typography variant="caption" >
                            &nbsp; {settingId}
                        </Typography>
                    </Typography>
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
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.displayName ? true : false}
                                helperText={errors.displayName?.message}
                            />
                            <Controller
                                name="type"
                                control={control}
                                defaultValue={''}
                                rules={{
                                    required: "Required"
                                }}
                                as={<TextField
                                    variant="outlined" size="small" fullWidth margin="normal"
                                    InputLabelProps={{ shrink: true, }}
                                    InputProps={{
                                        classes: { input: classes.textField },
                                    }}
                                    label="Type"
                                    required
                                    select
                                    error={errors.type ? true : false}
                                    helperText={errors.type?.message}
                                >
                                    <MenuItem key="maven-3.3" value="maven-3.3">Maven 3.3</MenuItem>
                                    <MenuItem key="gradle-5.5" value="gradle-5.5">Gradle 5.5</MenuItem>
                                </TextField>}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="buildconfig"
                                label="Build Configuration"
                                required
                                multiline
                                rows={20}
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: { value: 65536, message: "Maximum 65536 characters are allowed." }
                                })}
                                error={errors.buildconfig ? true : false}
                                helperText={errors.buildconfig?.message}
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
export default EditBuildTool;