import React from 'react';
import useCurrentUser from './useCurrentUser';
import { validateHasAllRoles } from './Util';

//custom hook for validating if user has required permissions.
function useValidateUserHasAllRoles(requiredRoles) {
    console.log("In useValidateUserHasAllRoles");
    const currentUser = useCurrentUser();
    if (currentUser && currentUser.roles) {
        return validateHasAllRoles(requiredRoles, currentUser.roles);
    } else {
        return false;
    }
}

export default useValidateUserHasAllRoles;