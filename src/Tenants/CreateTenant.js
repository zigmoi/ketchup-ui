import { AppBar, Box, Button, CircularProgress, Container, Grid, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';


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

function CreateTenant() {
    document.title = "Create Tenant";
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const { enqueueSnackbar } = useSnackbar();


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
                    <Formik
                        initialValues={{ tenantId: '', displayName: '', defaultUserEmail: '', defaultUserPassword: '' }}
                        validationSchema={Yup.object({
                            tenantId: Yup.string()
                                .max(50, 'Invalid Username, should be less than 50 in length!')
                                .required('Please provide a valid Tenant ID!'),
                                displayName: Yup.string()
                                .max(50, 'Must be 50 characters or less')
                                .required('Required'),
                                defaultUserEmail: Yup.string()
                                .max(50, 'Must be 50 characters or less')
                                .email('Invalid email address')
                                .required('Required'),
                                defaultUserPassword: Yup.string()
                                .min(8, 'Please provide a valid password, should be minimum 8 in length, mix of capital letters, small letters, numbers and a special character!')
                                .max(50, 'Please provide a valid password, maximum length allowed is 50!')
                                .required('Required'),
                                
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setLoading(true);
                            let data = {
                                'id': values.tenantId,
                                'displayName': values.displayName,
                                'defaultUserEmail': values.defaultUserEmail,
                                'defaultUserPassword': values.defaultUserPassword,
                            };
                            // alert(JSON.stringify(data, null, 2));
                            axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/tenant`, data)
                                .then((response) => {
                                    console.log(response);
                                    setLoading(false);
                                    setSubmitting(false);
                                    enqueueSnackbar('Tenant created successfully.', {variant: 'success'});
                                    history.push("/app/manage-tenants");
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
                                    InputProps={{ classes: {input: classes.textField}, }}
                                    id="tenantId"
                                    label="ID"
                                    required
                                    {...formik.getFieldProps('tenantId')}
                                    {...getFieldErrors('tenantId', formik)}
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
                                    id="defaultUserEmail"
                                    label="Default User Email"
                                    required
                                    {...formik.getFieldProps('defaultUserEmail')}
                                    {...getFieldErrors('defaultUserEmail', formik)}
                                />
                                <TextField
                                    variant="outlined" size="small" fullWidth margin="normal" 
                                    InputLabelProps={{ shrink: true, }} 
                                    InputProps={{classes: {input: classes.textField}}}
                                    id="defaultUserPassword"
                                    label="Default User Password"
                                    required
                                    type="password"
                                    {...formik.getFieldProps('defaultUserPassword')}
                                    {...getFieldErrors('defaultUserPassword', formik)}
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
                                        onClick={()=>history.goBack()}
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
export default CreateTenant;