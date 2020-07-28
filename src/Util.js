
export function validateHasAllRoles(requiredRoles, currentRoles) {
    for (let rr of requiredRoles) {
        if (currentRoles.indexOf(rr) == -1) { //indexOf return -1 if element is not present.
            return false;
        }
    }
    return true;
}

export function validateHasAnyRole(requiredRoles, currentRoles) {
    if (requiredRoles && requiredRoles.length == 0) {
        return true;
    }
    for (let rr of requiredRoles) {
        if (currentRoles.indexOf(rr) > -1) { //indexOf return -1 if element is not present.
            return true;
        }
    }
    return false;
}

export default { validateHasAnyRole, validateHasAllRoles };

