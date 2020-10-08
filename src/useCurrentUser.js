import React, {useContext} from 'react';
import UserContext from './UserContext';

//custom hook for login status
function useCurrentUser() {
    //if current logged in user (user details and auth token) is present in local storage, it will be set in login page.
    console.log("In useCurrentUser");
    const userContext = useContext(UserContext);
    if (userContext && userContext.currentUser) {
        return userContext.currentUser;
    } else {
        return null;
    }
}

export default useCurrentUser;