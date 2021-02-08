# Ketchup UI
Web User Interface for [Ketchup Core](https://github.com/zigmoi/ketchup-core) application.

## Install

#### Prerequisites
1. Kubernetes cluster, version >= v1.16.0 and <= v1.19.0.
2. [Helm CLI client](https://helm.sh/docs/intro/install/), version >= 3
4. [Kubectl Client](https://kubernetes.io/docs/tasks/tools/install-kubectl/), version >= v1.16.0 and <= v1.19.0.

#### Install via Helm
1. Create UI configuration file config.js in the current directory. Here is sample below:
```
window.REACT_APP_API_BASE_URL="http://localhost:8097";
```
2. Update window.REACT_APP_API_BASE_URL property to API server URL accessible outside kubernetes cluster.
3. Run following helm commands to install ketchup API server:
   applicationProperties variable is set to location of config.js file.
```
helm repo add ketchup https://zigmoi.github.io/ketchup-helm-repo
helm repo list
helm repo update
helm install ketchup-ui ketchup/ketchup-ui --set-file applicationProperties=./config.js
```  
3. Check installation
    1. Run the following command, it should list ketchup-ui as one of the releases.
    ```
    helm list
    ```
    2. Run the following command, it should show one pod for ketchup-ui.
    ```
    kubectl get pods
    ```
4. Run following commands to expose ketchup UI outside cluster
```
export KETCHUP_UI_POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=ketchup-ui,app.kubernetes.io/instance=ketchup-ui" -o jsonpath="{.items[0].metadata.name}")
kubectl port-forward $KETCHUP_UI_POD_NAME 8080:80
```
5. Access UI in the browser using following URL
   `http://localhost:8080`

## Build source

#### Prerequisites
1. NodeJs, version >= 10.7.0
2. NPM, version >= 6.2.0
3. Git, version >= 2.6.0

#### Compile and Run
1. Clone the code repo
```
git clone https://github.com/zigmoi/ketchup-ui.git
```
2. Update window.REACT_APP_API_BASE_URL property to Ketchup Core API server URL in config.js
   in public/config root directory of project
3. Install dependencies, run following command inside the root directory of project
```
npm install
```
4. Run application, run following command inside the root directory of project
```
npm start
```
5. Access UI in the browser using following URL
   `http://localhost:3000`
6. Create production build, run following command inside the root directory of project
```
npm run build
```
7. Run production build, run following commands inside the root directory of project
   1. Install serve
   ```
    npm install -g serve
   ```
   2. Use serve to run the production build
   ```
   serve -s build -l 3000
   ```
   3. Access UI in the browser using following URL.
      `http://localhost:3000`
