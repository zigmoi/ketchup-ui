import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
// import { message, Modal, Col, Row } from 'antd';
import { useSnackbar } from 'notistack';

const UserContext = React.createContext({});
export const UserConsumer = UserContext.Consumer;

export function UserProvider(props) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    let history = useHistory();
    let location = useLocation();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    function setCurrentUser(user) {
        console.log("started setting logged in user:", user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setLoggedInUser(user);
        setInterceptors(user.accessToken, history, location, clearCurrentUser);
        console.log("setting logged in user complete.")
    }

    function clearCurrentUser() {
        console.log("clear current user started.");
        localStorage.removeItem("currentUser");
        clearInterceptors();
        setLoggedInUser(null);
        console.log("clear current user complete.");
    }

    function setInterceptors(accessToken, history, location, clearCurrentUser) {
        if (axios.defaults.timeout === 0) {
            console.log("setting up interceptors.");
            setRequestInterceptor(accessToken);
            setResponseInterceptor(history, location, clearCurrentUser);
            console.log("setting up interceptors complete.");
        }
    }

    function clearInterceptors() {
        console.log("clearing up interceptors.", axios.interceptors);
        axios.defaults.timeout = 0;
        let noOfRequestInterceptors = axios.interceptors.request.handlers.length || 0;
        for (var i = 0; i <= noOfRequestInterceptors; i++) {
            axios.interceptors.request.eject(i);
        }
        let noOfResponseInterceptors = axios.interceptors.response.handlers.length || 0;
        for (var j = 0; j <= noOfResponseInterceptors; j++) {
            axios.interceptors.response.eject(j);
        }
        console.log("clearing up interceptors complete.");
    }

    function setRequestInterceptor(accessToken) {
        // Add a request interceptor
        axios.defaults.timeout = 30000;
        axios.interceptors.request.use((config) => {
            // Do something before request is sent
            console.log("In request interceptor, token: ", accessToken);
            if (accessToken) {
                config.headers.common['Authorization'] = 'Bearer ' + accessToken;
            } else {
                //removing authorization property from header object.
                delete config.headers.common['Authorization'];
            }

            return config;
        }, (error) => {
            console.log("Error in Request Interceptor: ", error);
            return Promise.reject(error);
        });
    }

    function setResponseInterceptor(history, location, clearCurrentUser) {
        axios.interceptors.response.use((response) => {
            console.log("response:" + response);
            return response;
        }, (error) => {
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
                        // message.error('Authentication required, Please login to continue.', 5);
                        enqueueSnackbar('Authentication required, Please login to continue.', {variant: 'error'});
                        setTimeout(function () {
                            //Allows promise to resolve before history.push executes 
                            //and hence avoids set state executing after component unmounts. 
                            clearCurrentUser();
                            history.push("/login", { from: location.pathname });
                        }, 500);
                    } else if (responseStatus === 403) {
                        // message.error('Access denied, If you think you should have access to this resource, please contact support.', 5);
                        enqueueSnackbar('Access denied, If you think you should have access to this resource, please contact support.', {variant: 'error'});
                    } else if (responseStatus === 404) {
                        // message.error('Resource not found, ' + errorMessage, 5);
                        enqueueSnackbar('Resource not found, ' + errorMessage, {variant: 'error'});
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
                            // Modal.error({
                            //     width: 850,
                            //     title: 'Validation Errors:',
                            //     content: (
                            //         <Row type="flex" justify="center" align="middle">
                            //             <Col span={24}>
                            //                 {errorView}
                            //             </Col>
                            //         </Row>
                            //     ),
                            //     onOk() { },
                            // });
                        } else {
                            // message.error('Invalid request, ' + errorMessage, 5);
                            enqueueSnackbar('Invalid request, ' + errorMessage, {variant: 'error'});
                        }
                    } else if (responseStatus === 500) {
                        // message.error('Something went wrong, please try again later! If the problem persists, please contact support.', 5);
                        enqueueSnackbar('Something went wrong, please try again later! If the problem persists, please contact support.', {variant: 'error'});
                    } else {
                        // message.error('Something went wrong, please try again later! If the problem persists, kindly contact support.', 5);
                        enqueueSnackbar('Something went wrong, please try again later! If the problem persists, kindly contact support.', {variant: 'error'});
                    }
                } else if (error.request) {
                    //when no response from server, like Timeout, Server down, CORS issue, Network issue.
                    // The request was made but no response was received.
                    //console.log(error.request);
                    // message.error('Application server is not accessible, please try again!', 5);
                    enqueueSnackbar('Application server is not accessible, please try again!', {variant: 'error'});

                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message);
                    // message.error('Request processing failed, Invalid request.', 5);
                    enqueueSnackbar('Request processing failed, Invalid request.', {variant: 'error'});

                }
                return Promise.reject(error);
            } catch (error) {
                console.log(error);
                // message.error('Something went wrong! If the problem persists, kindly contact support.', 5);
                enqueueSnackbar('Something went wrong! If the problem persists, kindly contact support.', {variant: 'error'});
                return Promise.reject(error);
            };
        });
    }

    return (
        <UserContext.Provider
            value={{
                currentUser: loggedInUser,
                setCurrentUser: setCurrentUser,
                clearCurrentUser: clearCurrentUser
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;