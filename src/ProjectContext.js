import React, {useContext, useState} from 'react';

const ProjectContext = React.createContext({});
export const ProjectConsumer = ProjectContext.Consumer;

export function ProjectProvider(props) {
    const [activeProject, setActiveProject] = useState(null);

    function setCurrentProject(userName, project) {
        console.log("setting current project.")
        console.log(project);
        setActiveProject(project);

        const localStoreProjectDetails = localStorage.getItem('currentProject');
        if (localStoreProjectDetails === null || localStoreProjectDetails === "null" || localStoreProjectDetails === undefined) {
            let projectDetails = {};
            projectDetails[userName] = project;
            localStorage.setItem('currentProject', JSON.stringify(projectDetails));
            console.log("setting (update) current project complete.");
        } else {
            let localStoreProjectDetailsJson = JSON.parse(localStoreProjectDetails);
            localStoreProjectDetailsJson[userName] = project;
            localStorage.setItem('currentProject', JSON.stringify(localStoreProjectDetailsJson));
            console.log("setting (init) current project complete.")
        }

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