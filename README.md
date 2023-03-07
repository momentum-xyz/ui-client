[![Master Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=master)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)
[![Develop Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=develop)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)

# Odyssey UI-Client

The UI-Client is currently a web application allowing to explore Odyssey 3D Worlds with 3D and 2D user interfaces.

It is built with React and Typescript, using Web3 style sign-in, [Mobx State Tree](https://mobx-state-tree.js.org/) for the app state management and flow and websocket-based communication layer called [posbus-client](https://github.com/momentum-xyz/posbus-client). The App and the plugins are using [Module Federation](https://webpack.js.org/concepts/module-federation/) (MF) in order to create more optimised builds and on-demand plugging in runtime.

```mermaid
flowchart LR
    subgraph UI-Client
        A[APP state]
        3D[3D UI]
        2D[2D UI]
        A -.- 3D
        A -.- 2D
    end
    A --> B(Blockchain)
    C --> B
    A -- REST + Websocket --> C(Backend Controller) --> DB[(DB)]
```

## Project packages

It is a monorepo that contains the main application and several common libraries, the plugin SDK and several the plugins that we maintain. In future the plugins may be moved to their own repositories.

    .
    ├── packages
    │   ├── app                     # Main application
    │   ├── core                    # Common reusable logic
    │   ├── map3d                   # 3D Worlds Explorer based on three.js
    │   ├── odyssey3d               # 3D World Interface based on babylon.js
    │   ├── sdk                     # Plugins SDK
    │   ├── ui-kit                  # Framework of base components
    │   ├── ui-kit-storybook        # Upcoming version of UI-Kit with Storybook
    │   │
    │   ├── plugin_google_drive     # Google Drive plugin
    │   ├── plugin_miro             # Miro plugin
    │   └── plugin_video            # Video plugin
    └── ...

### Packages connection schema

```mermaid
flowchart TD
    A --> MAP(map3d)
    MAP --> T{{three.js - legacy}}
    MAP --> C
    A --> 3D(odyssey3d)
    3D --> B{{babylon.js}}
    A --> S(sdk)
    A[APP] --> C(core)
    A --> K(ui-kit)
    S --> K
    P --> S
    P --> K
    3D --> C
    P --> C
    A o--o |MF| P(PLUGINS)
```

## How to run locally

#### Installation:

```
git lfs install
yarn install
yarn build
```

#### 1. How to run main app:

```
yarn start
```

#### 2. How to run storybook:

```
yarn start:storybook
```

#### 3. How to run odyssey 3d app:

```
yarn start:odyssey3d
```

#### 4. How to run plugin:

```
cd packages/plugin_[name]
yarn start
```

or for using an emulator:

```
cd packages/plugin_[name]
yarn start:plugin
```

## How to build

#### 1. How to build main app:

```
yarn build
```

#### 2. How to build storybook:

```
yarn build:storybook
```

#### 3. How to build odyssey 3d app:

```
yarn build:odyssey3d
```

#### 4. How to build plugin:

```
cd packages/plugin_[name]
yarn build
```

## Tips

### Code quality

- Enable `prettier` using IDE preferences. Apple rules in `.prettierrc`.
- Enable `eslint` using IDE preferences.
- Enable `husky` using `yarn run postinstall`.

### How to add an icon

- Copy an icon to `ui-kit-storybook/src/assets/icons` folder
- Change value of `fill` tag to `currentColor`
- Run following scripts:

```
cd packages/ui-kit-storybook
yarn svg-sprite:build
yarn svg-sprite:type
yarn build
```

4. Add this icon to the StoryBook

## Local config

### For the app

It's possible to override variables of AppConfig received from the dev server.

- Create file `.env.development.local`
- Add `REACT_APP_OVERRIDE_CONFIG_VARIABLES`

```json
REACT_APP_OVERRIDE_CONFIG_VARIABLES='{"APP_VERSION":"42.42.42","BACKEND_ENDPOINT_URL": "https://dev.odyssey.ninja/api/v3/backend"}'
```

### For a plugin

It's possible to assign a locally running plugin to some object in 3D for testing.

- Create file `.env.development.local`
- Add `REACT_APP_LOCAL_PLUGINS`
- Use `yarn start:plugin` command

```json
REACT_APP_LOCAL_PLUGINS='{"ba5ae691-7ad7-4508-b83d-759529b82a19":{"meta":{"id":"1234","name":"plugin_twitch","pluginId":"123","scopeName":"plugin_twitch","scriptUrl":"http://localhost:3001/remoteEntry.js"}},"84f93e15-f064-4f79-aa74-e60f21c07ba9":{"meta":{"id":"22222","name":"plugin_video","pluginId":"222","scopeName":"plugin_video","scriptUrl":"http://localhost:3002/remoteEntry.js"}}}'
```

Here `ba5ae691-7ad7-4508-b83d-759529b82a19` is the objectId of some spawned 3D object in my local world.
