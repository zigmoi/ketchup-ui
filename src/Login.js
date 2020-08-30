import axios from 'axios';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useLoginStatus from './useLoginStatus';
import UserContext from './UserContext';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login() {
  console.log("login");
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isUserLoggingIn, setIsUserLoggingIn] = useState(false);
  const [from, setFrom] = useState("/app/dashboard");

  let history = useHistory();
  let location = useLocation();

  const userContext = useContext(UserContext);
  const loginStatus = useLoginStatus();

  useEffect(() => {
    console.log("in effect login");
    document.title = "Sign In";
    //execution comes here when login is in progress and current user is set.
    //loginStatus gets updated via context api and hence execution comes here.
    //variable isUserLoggingIn is used to prevent history.replace
    //from executiing twice and loading route twice.
    //Once its executed in useEffect and secind time in getUserInfo.
    //Without this check route gets called twice also causes interceptor to load twice.

    if (location.state && location.state.from && location.state.from.pathname) {
      setFrom(location.state.from.pathname);
    }

    if (loginStatus && isUserLoggingIn === false) {
      history.replace(from);
    }
  }, [loginStatus]);


  function onSubmit(formValues) {
    setLoading(true);

    var params = {
      "grant_type": "password",
      'username': formValues.username,
      'password': formValues.password
    };

    var authHeader = {
      username: 'client-id-1',
      password: 'client-id-1-secret',
      scope: 'all'
    };

    axios.request({
      url: "/oauth/token",
      method: "post",
      baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
      auth: authHeader,
      data: qs.stringify(params),
      headers: { "content-type": "application/x-www-form-urlencoded" }
    }).then((response) => {
      console.log(response);
      setLoading(false);
      // var decoded_token = jwt_decode(response.data.access_token);
      // console.log(decoded_token);
      getUserInfo(formValues.username, response.data.access_token);
    })
      .catch((error) => {
        setLoading(false);
        console.log("Error in login request: ", error);
        try {
          if (error.response) {
            console.log("Error response:", error.response);
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            let responseStatus = error.response.status;
            let errorMessage = "";
            if (error.response.data.apierror && error.response.data.apierror.message) {
              errorMessage = error.response.data.apierror.message;
            } else if (error.response.data.error_description) {
              errorMessage = error.response.data.error_description;
            } else {
              errorMessage = "";
            }
            if (responseStatus === 401) {
              enqueueSnackbar(errorMessage, { variant: 'error' });
            } else if (responseStatus === 403) {
              enqueueSnackbar('Access denied, If you think you should have access to this resource, please contact support.', { variant: 'error' });
            } else if (responseStatus === 404) {
              enqueueSnackbar('Resource not found, ' + errorMessage, { variant: 'error' });
            } else if (responseStatus === 400) {
              let subErrors = "";
              if (error.response.data.apierror && error.response.data.apierror.subErrors) {
                subErrors = error.response.data.apierror.subErrors;
                let errorView = (
                  <ul>
                    {subErrors.map((value, index) => {
                      return <li key={index}>{value.field} : {value.message}</li>
                    })}
                  </ul>);
                enqueueSnackbar(errorView, { variant: 'error' });
              } else {
                enqueueSnackbar('Invalid request, ' + errorMessage, { variant: 'error' });
              }
            } else if (responseStatus === 500) {
              enqueueSnackbar('Something went wrong, please try again later! If the problem persists, please contact support.', { variant: 'error' });
            } else {
              enqueueSnackbar('Something went wrong, please try again later! If the problem persists, kindly contact support.', { variant: 'error' });
            }
          } else if (error.request) {
            //when no response from server, like Timeout, Server down, CORS issue, Network issue.
            // The request was made but no response was received.
            //console.log(error.request);
            enqueueSnackbar('Application server is not accessible, please try again!', { variant: 'error' });
          } else {
            // Something happened in setting up the request that triggered an Error
            //console.log('Error', error.message);
            enqueueSnackbar('Request processing failed, Invalid request.', { variant: 'error' });
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar('Something went wrong! If the problem persists, kindly contact support.', { variant: 'error' });
        };
      }
      );

  }

  function getUserInfo(loggedInUserName, accessToken) {
    setLoading(true);
    let config = {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    }
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/user/my/profile`, config)
      .then((response) => {
        console.log("getUserInfo", response);
        setLoading(false);
        let user = {
          id: loggedInUserName,
          accessToken: accessToken,
          displayName: response.data.displayName,
          roles: response.data.roles,
          tenantId: response.data.userName.split("@")[1],
          email: response.data.email,
        };

        setIsUserLoggingIn(true);
        userContext.setCurrentUser(user);
        history.replace(from);
      })
      .catch(() => {
        enqueueSnackbar('Unable to fetch profile information!', { variant: 'error' });
        setLoading(false);
      });
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <TextField
            variant="outlined" fullWidth margin="normal"
            name="username"
            label="User Name"
            required
            inputRef={register({
              required: "Required.",
              maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
            })}
            error={errors.username ? true : false}
            helperText={errors.username?.message}
          />
          <TextField
            variant="outlined" fullWidth margin="normal"
            name="password"
            label="Password"
            type="password"
            required
            inputRef={register({
              required: "Required.",
              maxLength: { value: 100, message: "Maximum 100 characters are allowed." }
            })}
            error={errors.password ? true : false}
            helperText={errors.password?.message}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth variant="contained" color="primary"
            className={classes.submit}
            type="submit"
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
