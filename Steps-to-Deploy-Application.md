# Introduction
The app is built using Node.js and Postgres database. <br>
The application serves as an interface to provide a list of all the teams and captains participating in the current Euro cup 2021.

# Application Architecture


# API's
* `/teams` serves the names of EURO Cup 2021 teams.
* `/captains` serves the names of EURO Cup 2021 captains

# Pre-requisites to start the app.
Below tools should be installed and running
* DockerCLI or Docker Desktop
* Minikube
* HELM

# Getting started
### To get the app clone the app using below commands:
* https: `git clone git@github.com:Samay1993/DevOps-Project-node-k8s-monitoring.git`
* ssh: `git clone git@github.com:Samay1993/DevOps-Project-node-k8s-monitoring.git`

### Steps to run the app
Once the application is cloned:
* `cd DevOps-Project-node-k8s-monitoring` or the project name provided during cloning the project

> Note: Run the "deploy.sh" script directly or follow the below steps to manually deploy everything for better understanding.

#### Setup Kubernetes Infrastructure
  * Open a terminal window.
  * Run command `minikube start`
  * Run command `minikube ip` 
  * Run command `minikube addons enable metrics-server`
  * Run command  `minikube addons enable ingress`
  * Run command `kubectl get pods -n kube-system` and verify that the **NGINX Ingress controller** is running, if not run below two commands
    - `kubectl apply -f https://raw.githubusercontent.com/roelal/minikube/5093d8b21c0931a6c63fa448538761b4bf100ee0/deploy/addons/ingress/ingress-rc.yaml`
    - `kubectl apply -f https://raw.githubusercontent.com/roelal/minikube/5093d8b21c0931a6c63fa448538761b4bf100ee0/deploy/addons/ingress/ingress-svc.yaml`
  * Open a new terminal window
    - Run command `cd /etc`
    - Run command `sudo vi hosts`
    - Press `i` to enter INSERT mode and enter below values in the file
      + `<your-minikube-ip> mynodeapp.info`
      + `<your-minikube-ip> prometheus.mynodeapp.info`
      + `<your-minikube-ip> grafana.mynodeapp.info`
 
#### Install HELM Charts:
  * Run command `helm repo list` Check the previously added repo
  * Run command `helm repo add stable https://charts.helm.sh/stable` 
  * Run command `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
  * Run command `helm search repo prometheus-community` Check if the repo has been added successfully.
  * Run command `kubectl create namespace monitoring` Create a namespace to improve the readability.
  * Run command `helm install stable -n monitoring prometheus-community/kube-prometheus-stack` 
  * Run command `kubectl get svc -n monitoring` Check if the services of **kube-prometheus-stack** are up and running.


## Deploy application to Kubernetes (`HPA`, `StatafulSet Pods` and `Persistency`)
 * Open a terminal window and navigate to project directory.
 * Run command `cd infra`
 * Make sure to run the commands in same order and wait for some time before moving to another so that services are started gracefully
    - `kubectl apply -f postgres-statefulset/`
    - `kubectl apply -f api-k8s/`
    - `kubectl apply -f ingresses/1_app-ingress.yaml`
 * Open browser and access below endpoints
     - `mynodeapp.info/teams` to view name of the teams participating in EURO Cup.
     - `mynodeapp.info/captains` to view name of the captains participating in EURO Cup.

### Test HPA
 * **HPA** to use CPU for scaling --> HPA is implemented for [0_api-deployment.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/api-k8s/0_api-deployment.yaml "API Deployment") and implementation is here [2_api-hpa.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/api-k8s/2_api-hpa.yaml "HPA implementation to use CPU for scaling")
   - Test out HPA in real time
     + Run command `kubectl get hpa --watch` 
     + Open a new terminal window.
     + Run command `kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh` then wait for command prompt to open
     + Run command `while sleep 0.01; do wget -q -O- http://mynodeapp.info/teams; done`
     + You will see name of the teams getting printed continuously.
     + Now go back to your old terminal and watch number of replicas increasing.
     + Press `ctrl+c` or `command+c` to stop watching.
     + Go to the terminal where load generator is running and pess `ctrl+c` or `command+c`.
 
 
### StatefulSet Pod
  * **StatefulSet Pod** --> Postgres has been deployed as StatefulSet, Please check [3_postgres-statefulset.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/3_postgres-statefulset.yaml "Postgres StatefulSet")
  * Run command `kubectl get statefulset -n db` *db is the namespace where it has been deployed*
  * You can see the postgres as a Statefulset Pod

### Persistency
  * **Persistance Volume** --> Postgres is using **database-persistent-volume-claim** to retain persistant data, Please check [1_database-persistent-volume-claim.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/1_database-persistent-volume-claim.yaml "Persistent Volume Claim")
  * Run command `kubectl get pvc -n db` *db is the namespace where it has been deployed*
  * Check if you can see the persistent volume name as **database-persistent-volume-claim**

## Setup Postgres-Exporter as a sidecar container for monitoring (Setting `Sidecar Container` and Monitoring with `Prometheus` and `Grafana`)
 * Open a terminal window and navigate to **Project2** directory.
 * Run command `cd infra`
 * Run commands:
   - `kubectl apply -f ingresses/3_prometheus-ingress.yaml`
   - `kubectl apply -f ingresses/2_grafana-ingress.yaml`

### Sidecar Container
 * A **Sidecar Container** has been deployed along with *postgres* container by the name of *pgexporter*. Refer [3_postgres-statefulset.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/3_postgres-statefulset.yaml "Postgres StatefulSet") and [5_postgres-exporter-service.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/5_postgres-exporter-service.yaml "Postgres-exporter service")
 * When you are in terminal run below commands to verify the existence of sidecar container
   - `kubectl get pods -n db` --> Display the set of pods running in 'db' namespace
   - `kubectl describe pod postgres-0 -n db` --> Check the name of container 'pgexporter' in the description
 * Setting up **ServiceMonitor** for postgres and allowing Prometheus to start monitoring *pgexporter*. Refer [6_postgres-servicemonitor.yaml](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/6_postgres-servicemonitor.yaml "ServiceMonitor for pgexporter")
 * Run command `kubectl get servicemonitor -n monitoring`
 * Verify **postgres-statefulset-pod-matrices** exists.

### Prometheus UI
 * Open browser and goto *prometheus.mynodeapp.info*.
 * Click on 'Status' and then click on 'Targets'.
 * Verify that you are able to see **serviceMonitor/monitoring/postgres-statefulset-pod-matrices/0** in the list of target.
 * To check the matrices:
   - Goto terminal and run command `kubectl describe pod postgres-0 -n db` and check the port of container 'pgexporter' in the description, it is using '9187' as mentioned [here](https://github.com/Samay1993/DevOps-Project-node-k8s-monitoring/infra/postgres-statefulset/5_postgres-exporter-service.yaml#L12)
   - Run command `kubectl port-forward postgres-0 -n db 9187`
   - Goto browser and type **localhost:9187** and click **Metrics** 

### Grafana UI
 * Open browser and goto *grafana.mynodeapp.info*.
 * Login with **Username -** *admin* and **Password -** *prom-exporter*. (By default provided by Prometheus-Operator [Reference](https://github.com/helm/charts/tree/master/stable/prometheus-operator#grafana "Grafana Reference"))
 * Hover over *Dashboard* icon and click  *Manage*.
 * Click 'Import'.
 * Type *9628* in Grafana Dashboard ID and click 'Load'.
 * Update name if you want to.
 * Select **Prometheus** in Prometheus Data Source Dropdown.
 * Click **Import**.
 * Now you can see the Graphical plot of container's metrices.
