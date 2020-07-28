import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
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

function AddContainerRegistry1() {
    document.title = "Add Container Registry";
    const classes = useStyles();
    const { control, register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);

    let { projectResourceId } = useParams();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    // function showFields(formik) {
    //     let details;
    //     let registryType = formik.values.type;
    //     if (registryType === "local") {
    //         details = (
    //             <React.Fragment>
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="registryUrl"
    //                     label="Registry URL"
    //                     required
    //                     {...formik.getFieldProps('registryUrl')}
    //                     {...getFieldErrors('registryUrl', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="repository"
    //                     label="Repository"
    //                     {...formik.getFieldProps('repository')}
    //                     {...getFieldErrors('repository', formik)}
    //                 />
    //             </React.Fragment>);
    //     } else if (registryType === "docker-hub") {
    //         details = (
    //             <React.Fragment>
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{
    //                         classes: { input: classes.textField },
    //                         readOnly: true,
    //                         value: 'index.docker.io'
    //                     }}
    //                     id="registryUrl"
    //                     label="Registry URL"
    //                     required
    //                     {...formik.getFieldProps('registryUrl')}
    //                     {...getFieldErrors('registryUrl', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="username"
    //                     label="User Name"
    //                     required
    //                     {...formik.getFieldProps('username')}
    //                     {...getFieldErrors('username', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="password"
    //                     label="Password"
    //                     required
    //                     type="password"
    //                     {...formik.getFieldProps('password')}
    //                     {...getFieldErrors('password', formik)}
    //                 />
    //             </React.Fragment>);
    //     } else if (registryType === "gcr") {
    //         details = (
    //             <React.Fragment>
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{
    //                         classes: { input: classes.textField },
    //                         readOnly: true,
    //                         value: 'gcr.io'
    //                     }}
    //                     id="registryUrl"
    //                     label="Registry URL"
    //                     required
    //                     {...formik.getFieldProps('registryUrl')}
    //                     {...getFieldErrors('registryUrl', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="repository"
    //                     label="Project ID"
    //                     required
    //                     {...formik.getFieldProps('repository')}
    //                     {...getFieldErrors('repository', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="username"
    //                     label="User Name"
    //                     required
    //                     {...formik.getFieldProps('username')}
    //                     {...getFieldErrors('username', formik)}
    //                 />
    //                 <TextField
    //                     variant="outlined" size="small" fullWidth margin="normal"
    //                     InputLabelProps={{ shrink: true, }}
    //                     InputProps={{ classes: { input: classes.textField } }}
    //                     id="password"
    //                     label="Password"
    //                     required
    //                     type="password"
    //                     {...formik.getFieldProps('password')}
    //                     {...getFieldErrors('password', formik)}
    //                 />
    //             </React.Fragment>);
    //     } else {
    //         details = null;
    //         enqueueSnackbar('Unsupported Registry Type!', { variant: 'error' });
    //     }
    //     return details;
    // }

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
                            {/* <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="displayName"
                                label="Display Name"
                                required
                                inputRef={register({ required: true })}
                                error={errors.displayName ? true : false}
                                helperText={errors.displayName && "Required!"}
                            /> */}
                            <Controller
                                as={TextField}
                                name="firstName"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                error={errors.firstName ? true : false}
                                helperText={errors.firstName && errors.firstName.message}
                            />
                            {/* {errors.displayName && <span>This field is required</span>} */}
                            {/* <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{ classes: { input: classes.textField } }}
                                id="type"
                                label="Type"
                                required
                                select
                            >
                                <MenuItem key="local" value="local">Local</MenuItem>
                                <MenuItem key="docker-hub" value="docker-hub">Docker Hub</MenuItem>
                                <MenuItem key="gcr" value="gcr">GCR</MenuItem>
                            </TextField> */}
                            {/* {showFields(formik)} */}
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
        </Container>
    )

}
export default AddContainerRegistry1;