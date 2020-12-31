# Build Docker images
# We apply 2 tags for each image
# - :latest so that the :latest version of Docker image on Docker Hub gets updated
#  - :SHA so that the updated Docker image will have a new unique tag => Kubernetes Deployments could spot this and apply new versions of the images
docker build -t vinhlee95/fibo-client:latest -t vinhlee95/fibo-client:$SHA -f ./client/Dockerfile ./client
docker build -t vinhlee95/fibo-server:latest -t vinhlee95/fibo-server:$SHA -f ./server/Dockerfile ./server
docker build -t vinhlee95/fibo-worker:latest -t vinhlee95/fibo-worker:$SHA -f ./worker/Dockerfile ./worker

# Push :latest-tagged images to Docker Hub
docker push vinhlee95/fibo-client:latest
docker push vinhlee95/fibo-server:latest
docker push vinhlee95/fibo-worker:latest

# Push :SHA-tagged images to Docker Hub
docker push vinhlee95/fibo-client:$SHA
docker push vinhlee95/fibo-server:$SHA
docker push vinhlee95/fibo-worker:$SHA


# Apply k8s configurations for the cluster
kubectl apply -f k8s

# Imperative commands to set correct Docker images for Kubernetes Deployment objects
# kubectl set image <object_type>/<deployment_name> <container_name>=<image_name_with_tag_or_latest>
kubectl set image deployments/server-deployment server=vinhlee95/fibo-server:$SHA
kubectl set image deployments/client-deployment client=vinhlee95/fibo-client:$SHA
kubectl set image deployments/worker-deployment worker=vinhlee95/fibo-worker:$SHA