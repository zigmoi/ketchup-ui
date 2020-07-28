import React, { useContext } from 'react';
import ProjectContext from './ProjectContext';

//custom hook to get current project.
function useCurrentProject() {
    console.log("In useCurrentProject");
    const projectContext = useContext(ProjectContext);
    
    if (projectContext && projectContext.currentProject) {
        return projectContext.currentProject;
    } else {
        //if current project is present in local storage set it in ProjectContext.
        const currentProject = JSON.parse(localStorage.getItem('currentProject'));
        console.log(currentProject);
        if (currentProject) {
            projectContext.setCurrentProject(currentProject);
            return currentProject;
        } else {
            return null;
        }
    }
}

export default useCurrentProject;