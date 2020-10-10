import React, {useContext} from 'react';
import ProjectContext from './ProjectContext';

//custom hook to get current project.
function useCurrentProject() {
    console.log("In useCurrentProject");
    const projectContext = useContext(ProjectContext);
    
    if (projectContext && projectContext.currentProject) {
        return projectContext.currentProject;
    } else {
        return null;
    }
}

export default useCurrentProject;