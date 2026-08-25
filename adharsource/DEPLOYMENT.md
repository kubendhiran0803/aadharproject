Deployment and local Kubernetes (minikube) instructions

Build image (option A: build into minikube's Docker daemon)

Windows PowerShell (recommended when using minikube):

```powershell
minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t adharsource:latest .
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/adharsource
minikube service adharsource-service --url
```

Option B: build and push to a registry (Docker Hub / private registry)

```bash
docker build -t <your-username>/adharsource:latest .
docker push <your-username>/adharsource:latest
# Edit k8s/deployment.yaml image to <your-username>/adharsource:latest
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/adharsource
```

Access the app via the NodePort or `minikube service` URL.
