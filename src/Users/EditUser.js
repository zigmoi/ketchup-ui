import { AppBar, Box, Button, Checkbox, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel, InputAdornment, useScrollTrigger, Chip, FormControlLabel, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

function EditUser() {
    document.title = "Edit User";
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { control, register, handleSubmit, watch, reset, getValues, setValue, errors, trigger } = useForm({ mode: 'onBlur' });

    let history = useHistory();
    let { userName } = useParams();

    const [loading, setLoading] = useState(false);

    const roleOptions = [
        { 'value': 'ROLE_USER', 'label': 'USER' },
        { 'value': 'ROLE_USER_READER', 'label': 'USER READER' },
        { 'value': 'ROLE_USER_ADMIN', 'label': 'USER ADMIN' },
        { 'value': 'ROLE_TENANT_ADMIN', 'label': 'TENANT ADMIN' }
    ];


    useEffect(() => {
        loadDetails();
    }, [userName]);

    const { roles } = watch();

    useEffect(() => {
        console.log(roles);
        console.log(errors);
    }, [roles]);

    function loadDetails() {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/users/${userName}`)
            .then((response) => {
                setLoading(false);
                setValue("displayName", response.data.displayName);
                setValue("status", response.data.enabled.toString());
                setValue("email", response.data.email);
                setValue("firstName", response.data.firstName);
                setValue("lastName", response.data.lastName);
                let currentRoles = roleOptions.filter((role) => response.data.roles.includes(role.value))
                setValue("roles", currentRoles);
                // setCreatedOn(response.data.createdOn);
                // setCreatedBy(response.data.createdBy);
                // setLastUpdatedOn(response.data.lastUpdatedOn);
                // setLastUpdatedBy(response.data.lastUpdatedBy);

            })
            .catch((error) => {
                setLoading(false);
            });
    }


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let selectedRoles = formValues.roles.map((role) => role.value);
        let data = {
            'userName': userName,
            'enabled': new Boolean(formValues.status),
            'displayName': formValues.displayName,
            'firstName': formValues.firstName,
            'lastName': formValues.lastName,
            'email': formValues.email,
            'roles': selectedRoles,
            'password': '', //will be ignored
        };
        //alert(JSON.stringify(data, null, 2));
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/v1-alpha/users/`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('User updated successfully.', { variant: 'success' });
                history.push("/app/manage-users");
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Container maxWidth="xl" disableGutters className={classes.container}>
            <AppBar position="static" color="transparent" elevation={0} className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">Edit User
                    <Typography variant="caption" >
                            &nbsp; {userName}
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
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="firstName"
                                label="First Name"
                                required
                                inputRef={register({
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.firstName ? true : false}
                                helperText={errors.firstName?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="lastName"
                                label="Last Name"
                                required
                                inputRef={register({
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.lastName ? true : false}
                                helperText={errors.lastName?.message}
                            />
                            <TextField
                                variant="outlined" size="small" fullWidth margin="normal"
                                InputLabelProps={{ shrink: true, }}
                                InputProps={{
                                    classes: { input: classes.textField },
                                }}
                                name="email"
                                label="Email"
                                required
                                inputRef={register({
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.email ? true : false}
                                helperText={errors.email?.message}
                            />
                            <Controller
                                name="status"
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
                                    label="Status"
                                    required
                                    select
                                    error={errors.status ? true : false}
                                    helperText={errors.status?.message}
                                >
                                    <MenuItem key="true" value={"true"}> Enabled </MenuItem>
                                    <MenuItem key="false" value={"false"}> Disabled </MenuItem>
                                </TextField>}
                            />
                            <Controller
                                name="roles"
                                control={control}
                                defaultValue={[roleOptions[0]]}
                                rules={{
                                    validate: value => {
                                        console.log("value:", value);
                                        return value.length > 0 || "Required."
                                    },
                                }}
                                render={({ onChange, onBlur, name, value }) => {
                                    return <Autocomplete
                                        name={name}
                                        onChange={(event, value) => { onChange(value) }}
                                        onBlur={() => onBlur()}
                                        // onBlur={() => {trigger('roles')}} 
                                        // onblur doesnt work when value is removed using chip close button, because focus is already lost.
                                        // either use change form validation mode or manaully call trigger to initiate validation on onchange.
                                        //or make chip non deletable.
                                        size="small" fullWidth
                                        value={value}
                                        multiple limitTags={3} disableCloseOnSelect openOnFocus
                                        options={roleOptions}
                                        getOptionLabel={(option) => option.label}
                                        getOptionSelected={(option, value) => option.value === value.value}
                                        renderOption={(option, { selected }) => (
                                            <React.Fragment>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.label}
                                            </React.Fragment>
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip size="small" label={option.label} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                margin="normal"
                                                InputLabelProps={{ shrink: true, }}
                                                label="Roles"
                                                error={errors.roles ? true : false}
                                                helperText={errors.roles?.message}
                                            />
                                        )}
                                    />
                                }}
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
export default EditUser;