import React from 'react';
import useCurrentUser from './useCurrentUser';
import { validateHasAnyRole } from './Util';

//custom hook for validating if user has required permissions.
function useValidateUserHasAnyRole(requiredRoles) {
    console.log("In useValidateUserHasAnyRole");
    const currentUser = useCurrentUser();
    if (currentUser && currentUser.roles) {
        return validateHasAnyRole(requiredRoles, currentUser.roles);
    } else {
        return false;
    }
}

export default useValidateUserHasAnyRole;