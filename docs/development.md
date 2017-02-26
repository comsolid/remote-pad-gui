# Development

The development is made using [electron](https://github.com/electron/electron)
and [electron-builder](https://github.com/electron-userland/electron-builder).
For this we need to install [NodeJS](https://nodejs.org)
and [yarn](https://yarnpkg.com).

## Clone the project

```bash
git clone https://github.com/comsolid/remote-pad-gui.git
```

## Platforms

* [Debian/Ubuntu](dev/debian-ubuntu.md)

## Common tasks

After install specific softwares from Platforms section above you'll
need to install dependencies:

```bash
cd remote-pad-gui
yarn
```

### Install services

In order to run remote-pad-gui you need a copy of
[remote-pad](https://github.com/comsolid/remote-pad) and
[remote-pad-server](https://github.com/comsolid/remote-pad-server).

Download the electron version of remote-pad from

<https://github.com/comsolid/remote-pad/releases>.

Example: `remote-pad-1.0.0-electron.tar.bz2`.

Extract at directory `services/web`.

Download the electron version of remote-pad-server from

<https://github.com/comsolid/remote-pad-server/releases>.

Example: `remote-pad-server-1.0.0-electron-ubuntu-14.04.tar.bz2`.

Extract at directory `services/mqtt-broker`.

Final result should look like this:

```
services/
├── mqtt-broker
│   ├── credentials.json
│   ├── docs
│   ├── helpers
│   ├── LICENSE
│   ├── LINKS.md
│   ├── node_modules
│   ├── package.json
│   ├── process.yml
│   ├── profiles
│   ├── README.md
│   ├── scripts
│   ├── src
│   └── yarn.lock
└── web
    ├── dist
    ├── node_modules
    ├── package.json
    ├── production
    └── yarn.lock
```

Open in development mode:

```bash
# serve with hot reload at localhost:9080
npm run dev
```
