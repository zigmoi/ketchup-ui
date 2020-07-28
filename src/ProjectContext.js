import React, { useState } from 'react';

const ProjectContext = React.createContext({});
export const ProjectConsumer = ProjectContext.Consumer;

export function ProjectProvider(props) {
    const [activeProject, setActiveProject] = useState(null);

    function setCurrentProject(project) {
        console.log("setting current project.")
        console.log(project);
        setActiveProject(project);
        localStorage.setItem('currentProject', JSON.stringify(project));
        console.log("setting current project complete.")
    }

    function clearCurrentProject() {
        console.log("clearing current project")
        setActiveProject(null);
        localStorage.removeItem("currentProject");
    }

    return (
        <ProjectContext.Provider
            value={{
                currentProject: activeProject,
                setCurrentProject: setCurrentProject,
                clearCurrentProject: clearCurrentProject
            }}
        >
            {props.children}
        </ProjectContext.Provider>
    );
}

export default ProjectContext;