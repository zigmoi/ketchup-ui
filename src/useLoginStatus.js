import React from 'react';
import useCurrentUser from './useCurrentUser';

//custom hook for login status
function useLoginStatus() {
    console.log("In useLoginStatus");
    const currentUser = useCurrentUser();
    if (currentUser) {
        return true;
    } else {
        return false;
    }
}

export default useLoginStatus;