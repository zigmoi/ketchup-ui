import { AppBar, Box, Button, Checkbox, CircularProgress, Container, Grid, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import UserContext from '../UserContext';

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

function getFieldErrors(id, formik) {
    if (formik.touched[id] && formik.errors[id]) {
        return ({ error: true, helperText: formik.errors[id] });
    } else {
        return null;
    }
}

function CreateUser() {
    document.title = "Create User";
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const userContext = useContext(UserContext);
    const tenantId = "@".concat(userContext.currentUser ? userContext.currentUser.tenantId : "");
    let history = useHistory();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [roles, setRoles] = useState([]);
    const [rolesError, setRolesError] = useState(false);
    const [rolesTouched, setRolesTouched] = useState(false);
    const [rolesHelperText, setRolesHelperText] = useState('');

    function validateRoles(selectedRoles) {
        const roleYupSchema = Yup.object({
            roles: Yup.array()
                .min(1, "Please select a role!")
        });

        setRolesTouched(true);
        return roleYupSchema.validate({ roles: selectedRoles })
            .then(function () {
                setRolesError(false);
                setRolesHelperText("");
                return true;
            })
            .catch(function (err) {
                // console.log(err);
                setRolesError(true);
                setRolesHelperText(err.message);
                return false;
            });
    }

    const roleOptions = [
        { 'value': 'ROLE_USER', 'label': 'USER' },
        { 'value': 'ROLE_USER_READER', 'label': 'USER READER' },
        { 'value': 'ROLE_USER_ADMIN', 'label': 'USER ADMIN' },
        { 'value': 'ROLE_TENANT_ADMIN', 'label': 'TENANT ADMIN' }
    ];


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
                    <Formik
                        initialValues={{ userName: '', password: '', displayName: '', firstName: '', lastName: '', email: '' }}
                        validationSchema={Yup.object({
                            userName: Yup.string()
                                .max(50, 'Invalid Username, should be less than 50 in length!')
                                .required('Please provide a valid Username!'),
                            password: Yup.string()
                                .min(8, 'Please provide a valid password, should be minimum 8 in length, mix of capital letters, small letters, numbers and a special character!')
                                .max(50, 'Please provide a valid password, maximum length allowed is 50!')
                                .required('Required'),
                            displayName: Yup.string()
                                .max(50, 'Must be 15 characters or less')
                                .required('Required'),
                            firstName: Yup.string()
                                .max(50, 'Must be 15 characters or less'),
                            lastName: Yup.string()
                                .max(50, 'Must be 20 characters or less'),
                            email: Yup.string()
                                .max(50, 'Must be 15 characters or less')
                                .email('Invalid email address'),
                            roles: Yup.array()
                                .min(1, "Please select a role!")

                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setLoading(true);
                            if (validateRoles(roles) === false) {
                                setLoading(false);
                                return;
                            }
                            let selectedRoles = roles.map((role)=> role.value);
                            let data = {
                                'userName': values.userName.concat(tenantId),
                                'password': values.password,
                                'enabled': true,
                                'displayName': values.displayName,
                                'firstName': values.firstName,
                                'lastName': values.lastName,
                                'email': values.email,
                                'roles': selectedRoles,
                            };
                            // alert(JSON.stringify(data, null, 2));
                            axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/user/`, data)
                                .then((response) => {
                                    console.log(response);
                                    setLoading(false);
                                    setSubmitting(false);
                                    enqueueSnackbar('User created successfully.', {variant: 'success'});
                                    history.push("/app/manage-users");
                                })
                                .catch(() => {
                                    setLoading(false);
                                    setSubmitting(false);
                                });
                        }}
                    >
                        {formik =>
                            <Form onSubmit={formik.handleSubmit}>
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{
                                        classes: {input: classes.textField}, 
                                        endAdornment: <InputAdornment position="end">{tenantId}</InputAdornment>
                                    }}
                                    id="userName"
                                    label="User Name"
                                    required
                                    {...formik.getFieldProps('userName')}
                                    {...getFieldErrors('userName', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="displayName"
                                    label="Display Name"
                                    required
                                    {...formik.getFieldProps('displayName')}
                                    {...getFieldErrors('displayName', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="password"
                                    label="Password"
                                    required
                                    type="password"
                                    {...formik.getFieldProps('password')}
                                    {...getFieldErrors('password', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="firstName"
                                    label="First Name"
                                    {...formik.getFieldProps('firstName')}
                                    {...getFieldErrors('firstName', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="lastName"
                                    label="Last Name"
                                    {...formik.getFieldProps('lastName')}
                                    {...getFieldErrors('lastName', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="email"
                                    label="Email"
                                    {...formik.getFieldProps('email')}
                                    {...getFieldErrors('email', formik)}
                                />
                                <Autocomplete
                                    size="small"
                                    fullWidth
                                    multiple
                                    limitTags={3}
                                    disableCloseOnSelect
                                    id="roles"
                                    options={roleOptions}
                                    getOptionLabel={(option) => option.label}
                                    getOptionSelected={(option, value) => option.value === value.value}
                                    value={roles}
                                    onChange={(event, newValue) => {
                                        setRoles(newValue);
                                        validateRoles(newValue);
                                    }}
                                    onBlur={() => validateRoles(roles)}
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
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined" 
                                            margin="normal"
                                            InputLabelProps={{ shrink: true, }}
                                            label="Roles"
                                            
                                            error={rolesTouched && rolesError}
                                            helperText={(rolesTouched && rolesError) ? rolesHelperText : ""}
                                        />
                                    )}
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
                                        onClick={(e)=>history.goBack()}
                                        >Cancel</Button>
                                </Grid>
                            </Form>
                        }
                    </Formik>
                </Box>
            </Grid>
        </Grid>
    </Container>
)

}
export default CreateUser;