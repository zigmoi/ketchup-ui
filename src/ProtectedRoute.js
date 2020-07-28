import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useLoginStatus from './useLoginStatus';
import AccessDenied from './AccessDenied';
import useValidateUserHasAnyRole from './useValidateUserHasAnyRole';

function ProtectedRoute({ component: Component, roles, ...rest }) {
    console.log("In protected route");
    const loginStatus = useLoginStatus();
    console.log(roles);
    let requiredRoles = roles || [];
    let hasRoles = useValidateUserHasAnyRole(requiredRoles);
    console.log("hasRoles", hasRoles);
    let location = useLocation();

    let AuthenticatedView;
    if (loginStatus) {
        if (hasRoles) {
            AuthenticatedView = (
                <Component {...rest} />
            );
        } else {
            AuthenticatedView = (
                <AccessDenied {...rest} />
            );
        }
    } else {
        AuthenticatedView = (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
        );
    }


    return (AuthenticatedView);
}

export default ProtectedRoute;