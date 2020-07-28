import React, { useState } from 'react';

const DeploymentContext = React.createContext({});
export const DeploymentConsumer = DeploymentContext.Consumer;

export function DeploymentProvider(props) {
    const [activeDeployment, setActiveDeployment] = useState(null);

    function setCurrentDeployment(deployment) {
        console.log("setting current deployment.");
        console.log(deployment);
        setActiveDeployment(deployment);
        localStorage.setItem('currentDeployment', JSON.stringify(deployment));
        console.log("setting current deployment complete.")
    }

    function clearCurrentDeployment() {
        console.log("clearing current deployment")
        setActiveDeployment(null);
        localStorage.removeItem("currentDeployment");
    }

    return (
        <DeploymentContext.Provider
            value={{
                currentDeployment: activeDeployment,
                setCurrentDeployment: setCurrentDeployment,
                clearCurrentDeployment: clearCurrentDeployment
            }}
        >
            {props.children}
        </DeploymentContext.Provider>
    );
}

export default DeploymentContext;