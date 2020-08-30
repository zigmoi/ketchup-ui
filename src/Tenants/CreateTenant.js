import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

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

function CreateTenant() {
    document.title = "Create Tenant";
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' });

    let history = useHistory();
    const [loading, setLoading] = useState(false);


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let data = {
            'id': formValues.tenantId,
            'displayName': formValues.displayName,
            'defaultUserEmail': formValues.defaultUserEmail,
            'defaultUserPassword': formValues.defaultUserPassword,
        };
        //  alert(JSON.stringify(data, null, 2));
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/tenant/`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('Tenant created successfully.', { variant: 'success' });
                history.push("/app/manage-tenants");
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Create Tenant</Typography>
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
                                name="tenantId"
                                label="ID"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.tenantId ? true : false}
                                helperText={errors.tenantId?.message}
                            />
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
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="defaultUserEmail"
                                label="Default User Email"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.defaultUserEmail ? true : false}
                                helperText={errors.defaultUserEmail?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{ classes: { input: classes.textField } }}
                                name="defaultUserPassword"
                                label="Default User Password"
                                required
                                type="password"
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.defaultUserPassword ? true : false}
                                helperText={errors.defaultUserPassword?.message}
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
        </Container >
    )

}
export default CreateTenant;