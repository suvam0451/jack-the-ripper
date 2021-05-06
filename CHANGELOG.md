# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.3](https://github.com/suvam0451/jack-the-ripper/compare/v0.0.2...v0.0.3) (2021-05-06)


### Features

* add podman-compose file ([127b74e](https://github.com/suvam0451/jack-the-ripper/commit/127b74ee7db32fded9eddc9bab7731747a3ea232))
* **docker:** modify buidl scripts to accomodate yarn ([b7fc429](https://github.com/suvam0451/jack-the-ripper/commit/b7fc429f86c7426e716b852d80b38ad5e1c8e076))
* add private gw2 route ([a00cd1c](https://github.com/suvam0451/jack-the-ripper/commit/a00cd1c3dae9f135a01d3dbe51b2cc02ec85e53c))
* **server:** add jwt authentication ([4c701c8](https://github.com/suvam0451/jack-the-ripper/commit/4c701c8740183812a8d0f7482a137098b85cba1d))


### Bug Fixes

* fix containner name where mongoose connects to mongo container ([52e04d3](https://github.com/suvam0451/jack-the-ripper/commit/52e04d3e046709502e30d616af173f3b088f0425))
* typo in docker compose ([8f4f923](https://github.com/suvam0451/jack-the-ripper/commit/8f4f92357fcd9b0634980c52beb0de1a6512ebeb))
* **localStorage:** modify key to include validity and expiry date ([20af683](https://github.com/suvam0451/jack-the-ripper/commit/20af6834b696a9a6b0a9c565321cae484304340a))
* **podman:** modify docker-compose.yaml (conside names and links) ([72b54cf](https://github.com/suvam0451/jack-the-ripper/commit/72b54cfa433fd30bc4050b2d0a87e13baf9e1184))
* **podman:** point mongoose connection to intranet of compose ([1b01fd8](https://github.com/suvam0451/jack-the-ripper/commit/1b01fd8ddee7e58ab20ed6f8a37ae8dd6df47046))
* add cors to allow all server requests ([beeed70](https://github.com/suvam0451/jack-the-ripper/commit/beeed702bf182d339bb104684ad39f0dd121ac3b))
* format error in docker-compose ([39c6f02](https://github.com/suvam0451/jack-the-ripper/commit/39c6f02516089b6eda21f9187940a716fafb879d))
* remove npm lockfile. add yarn lockfile ([ac83039](https://github.com/suvam0451/jack-the-ripper/commit/ac83039bde08fe7b572e902d41af4a8f288d53a5))

### [0.0.2](https://github.com/suvam0451/jack-the-ripper/compare/v0.0.1...v0.0.2) (2021-04-30)


### Features

* add twitter image browsing by id ([76a2c2d](https://github.com/suvam0451/jack-the-ripper/commit/76a2c2db78e00aa79ce9ca18c2d9c98303096cb7))
* add youtube mp3 download module ([d065ff3](https://github.com/suvam0451/jack-the-ripper/commit/d065ff3f5f9923f41e8e87e23f3864703f894ceb))

### 0.0.1 (2021-04-23)


### Features

* ability to fetch and sort twitter nsfw content (links) ([52ad1d6](https://github.com/suvam0451/jack-the-ripper/commit/52ad1d663941653bc13bff2ece9eda17112da0c7))
* add standard-version ([f46b98e](https://github.com/suvam0451/jack-the-ripper/commit/f46b98e8301d21e1e51c4042507843a5461763ec))

### Running with docker

```sh
docker pull mongo

docker run -n automemorydoll_client -d -p 127.0.0.1:27017:27017 mongo # run mongodb as database server
```