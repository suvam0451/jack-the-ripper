# jack-the-ripper
A discord bot with privately-hosted web-scraping tool integrations.

## Running with Docker/Podman

```sh
# Client only
podman pull node
podman build -t automemory-client . # From root of this project
podman run -d -p 3000:3000 automemory-client  # 3000 port (left)

# Server only
podman build -t automemory_server . # From root of this project
podman run -d -p 4000:4000 -p 27017:27017 automemory_server  # 4000 port (left)


# Database only
podman pull mongo
podman run --name automemory_db -d -p 27017:27017 mongo

# Monitoring and closing
podman ps

# Container composing
podman-compose build
podman-compose up
```

### Helpful commands list

```sh
# Checking processes using port
netstat -ltnp | grep -w ':80' 
kill {pid}
```