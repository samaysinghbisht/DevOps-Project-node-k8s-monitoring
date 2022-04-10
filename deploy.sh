#!/usr/bin/env bash

if [ "$(uname)" == "Darwin" ]; then
    echo "Mac"        
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    echo "Linux"
    minikube start
    minikube addons enable metrics-server
    minikube addons enable ingress
    kubectl apply -f https://raw.githubusercontent.com/roelal/minikube/5093d8b21c0931a6c63fa448538761b4bf100ee0/deploy/addons/ingress/ingress-rc.yaml
    kubectl apply -f https://raw.githubusercontent.com/roelal/minikube/5093d8b21c0931a6c63fa448538761b4bf100ee0/deploy/addons/ingress/ingress-svc.yaml
    helm repo add stable https://charts.helm.sh/stable
    sleep 5
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    sleep 5
    kubectl create namespace monitoring
    sleep 5
    helm install stable -n monitoring prometheus-community/kube-prometheus-stack
    sleep 5
    kubectl apply -f infra/postgres-statefulset/
    echo "Wait till database gets deployed successfully......."
    sleep 30
    kubectl apply -f infra/api-k8s/
    sleep 10
    kubectl apply -f infra/ingresses/
    sleep 10
    minikube_ip=$(minikube ip)
    echo "Congratulations! Your Kubernetes Cluster is deployed successfully."
    echo "Please follow the below steps to access the applications....."
    echo "Open a new terminal window and type below command"
    echo "cd /etc"
    echo "sudo vi hosts"
    echo "Press I to enter insert mode and paste below text at the end of the file and press 'esc' then type ':wq'"
    echo "$minikube_ip mynodeapp.info"
    echo "$minikube_ip prometheus.mynodeapp.info"
    echo "$minikube_ip grafana.mynodeapp.info"
    read -p "Please press 'y' and press Enter once you are done.." input
    if [ $input == "y" -o "Y" ]; then
        echo "You can access the application @ mynodeapp.info/teams and mynodeapp.info/captains"
        echo "To access Prometheus visit prometheus.mynodeapp.info"
        echo "To access Grafana visit grafana.mynodeapp.info"
    fi
fi




   
