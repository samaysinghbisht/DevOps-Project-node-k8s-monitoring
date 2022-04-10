
# Project Explained


## Components

### 1. Simple Service Webapp

- Develop a simple node application 
- Create a `Dockerfile` for it.
- Push it to a **container repository**
---

### 2. Setup Kubernetes

- Install `minikube` in your local workstation to deploy image build in `[1]`.
- Create K8s' `Service` running with `HPA` configured to use CPU for scaling.
- Deploy databse as a `StatefulSet pod` which needs persistency.

### 3. Monitoring (Prometheus/Grafana)

- Setup basic `monitoring` for the StatefulSet pod. (**sidecar container** is being used because StatefulSet Pods natively doesn't expose metrics) which can be scraped by prometheus engine.
- Deploy `Prometheus` for monitoring targets (only stateful services)
- Deploy `Grafana` to plot dashboard. Grafana community has dashboards which can be used in this case. 

Examples:
- https://grafana.com/grafana/dashboards/763
- https://grafana.com/grafana/dashboards/4279
- https://grafana.com/grafana/dashboards/4031