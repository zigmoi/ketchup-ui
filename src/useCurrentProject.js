import React, {useContext} from 'react';
import ProjectContext from './ProjectContext';
import {useLocation} from "react-router-dom";

//custom hook to get current project.
function useCurrentProject() {
    console.log("In useCurrentProject");
    const projectContext = useContext(ProjectContext);

    const location = useLocation();
    const projectIdFromUrl = getProjectIdFromUrl(location);
    if(projectIdFromUrl){
        return projectIdFromUrl;
    }

    if (projectContext && projectContext.currentProject) {
        return projectContext.currentProject;
    } else {
        return null;
    }

    function getProjectIdFromUrl(location) {
        try {
            let tempPath = location.pathname.substr(location.pathname.indexOf("/app/project/") + 13);
            const projectIdFromPath = tempPath.substr(0, tempPath.indexOf("/"));
            console.log(projectIdFromPath);
            return projectIdFromPath;
        } catch (e) {
            return "";
        }
    }
}

export default useCurrentProject;