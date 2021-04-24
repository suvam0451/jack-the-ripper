# jack-the-ripper
A discord bot with privately-hosted web-scraping tool integrations.

## Running with Docker/Podman

```sh
podman pull node node
podman pull node mongo
docker build -t automemory-client . # From root of this project
docker run -d -p 3000:3000 node-app  # 3000 port will run the client
```