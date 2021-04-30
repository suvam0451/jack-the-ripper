# jack-the-ripper
A discord bot with privately-hosted web-scraping tool integrations.

## Running with Docker/Podman

```sh
# Client only
podman pull node node
podman build -t automemory-client . # From root of this project
podman run -d -p 3000:3000 automemory-client  # 3000 port (left)

# Server only
podman build -t automemory-server . # From root of this project
podman run -d -p 3000:3000 automemory-server  # 3000 port (left)


# Database only
podman pull node mongo
docker run --name automemory_db -d -p 27017:27017 mongo

# Monitoring and closing
podman ps
```