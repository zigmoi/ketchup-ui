import { AppBar, Box, Button, Checkbox, CircularProgress, Container, Grid, TextField, Toolbar, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel, InputAdornment, useScrollTrigger, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import UserContext from '../UserContext';
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

function CreateUser() {
    document.title = "Create User";
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { control, register, handleSubmit, watch, reset, getValues, setValue, errors, trigger } = useForm({ mode: 'onBlur' });

    let history = useHistory();

    const [loading, setLoading] = useState(false);
    const userContext = useContext(UserContext);
    const tenantId = "@".concat(userContext.currentUser?.tenantId);

    const roleOptions = [
        { 'value': 'ROLE_USER', 'label': 'USER' },
        { 'value': 'ROLE_USER_READER', 'label': 'USER READER' },
        { 'value': 'ROLE_USER_ADMIN', 'label': 'USER ADMIN' },
        { 'value': 'ROLE_TENANT_ADMIN', 'label': 'TENANT ADMIN' }
    ];

    const { roles } = watch();

    useEffect(() => {
        console.log(roles);
        console.log(errors);
    }, [roles]);


    function onSubmit(formValues) {
        console.log(formValues);
        setLoading(true);

        let selectedRoles = formValues.roles.map((role) => role.value);
        let data = {
            'userName': formValues.userName.concat(tenantId),
            'password': formValues.password,
            'enabled': true,
            'displayName': formValues.displayName,
            'firstName': formValues.firstName,
            'lastName': formValues.lastName,
            'email': formValues.email,
            'roles': selectedRoles,
        };
        //  alert(JSON.stringify(data, null, 2));
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/user/`, data)
            .then((response) => {
                console.log(response);
                setLoading(false);
                enqueueSnackbar('User created successfully.', { variant: 'success' });
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
                    <Typography variant="h6" color="inherit">Create User</Typography>
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
                                    endAdornment: <InputAdornment position="end">{tenantId}</InputAdornment>
                                }}
                                name="userName"
                                label="User Name"
                                required
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.userName ? true : false}
                                helperText={errors.userName?.message}
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
                                InputProps={{ classes: { input: classes.textField } }}
                                name="password"
                                label="Password"
                                required
                                type="password"
                                inputRef={register({
                                    required: "Required.",
                                    maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
                                })}
                                error={errors.password ? true : false}
                                helperText={errors.password?.message}
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
                                name="roles"
                                control={control}
                                defaultValue={[roleOptions[0]]}
                                rules={{
                                    validate: value => {
                                        console.log("value:", value);
                                        return value.length > 0 || "Required."},
                                }}
                                render={({ onChange, onBlur, name, value }) => {
                                    return <Autocomplete
                                        name={name}
                                        onChange={(event, value) => { onChange(value) }}
                                        onBlur={()=> onBlur()} 
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
export default CreateUser;