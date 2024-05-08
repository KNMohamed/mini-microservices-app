#!/bin/bash

# List the services
services=("client" "posts" "comments" "event-bus" "moderation" "query")
userdockerhub="yourmaingotoguy"

for service in "${services[@]}"; do
    docker build -t "$userdockerhub/$service" "./$service"
    docker tag "$userdockerhub" "$userdockerhub/$service:latest"
    docker push "$userdockerhub/$service:latest"
done