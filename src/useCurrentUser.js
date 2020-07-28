import React, { useContext } from 'react';
import UserContext from './UserContext';

//custom hook for login status
function useCurrentUser() {
    console.log("In useCurrentUser");
    const userContext = useContext(UserContext);
    if (userContext && userContext.currentUser) {
        return userContext.currentUser;
    } else {
        //if current logged in user (user details and auth token) is present in local storage,
        // get user from local storage to set it in UserContext.
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser);
        if (currentUser) {
            userContext.setCurrentUser(currentUser);
            return currentUser;
        } else {
            return null;
        }
    }
}

export default useCurrentUser;