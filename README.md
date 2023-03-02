[![Master Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=master)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)
[![Develop Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=develop)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)

# Odyssey ui-client

## Project packages
    .
    ├── packages                    
    │   ├── app                     # Main application
    │   ├── core                    # Common reusable stuff
    │   ├── map3d                   # Explorer based on three.js 
    │   ├── odyssey3d               # User odyssey based on babylon.js 
    │   ├── sdk                     # Stuff for plugins
    │   ├── ui-kit                  # Out of date base components
    │   ├── ui-kit-storybook        # Storybook based on base components
    │   │
    │   ├── plugin_google_drive     # Google-drive plugin
    │   ├── plugin_miro             # Miro plugin
    │   └── plugin_video            # Video plugin
    └── ...

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

* Enable `prettier` using IDE preferences. Apple rules in `.prettierrc`.
* Enable `eslint` using IDE preferences.
* Enable `husky` using `yarn run postinstall`.

### How to add an icon

* Copy an icon to `ui-kit-storybook/src/assets/icons` folder
* Change value of `fill` tag to `currentColor`
* Run following scripts:

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

* Create file `.env.development.local`
* Add `REACT_APP_OVERRIDE_CONFIG_VARIABLES`

```json
REACT_APP_OVERRIDE_CONFIG_VARIABLES='{"APP_VERSION":"42.42.42","BACKEND_ENDPOINT_URL": "https://dev.odyssey.ninja/api/v3/backend"}'
```

### For a plugin

It's possible to assign a locally running plugin to some object in 3D for testing.

* Create file `.env.development.local`
* Add `REACT_APP_LOCAL_PLUGINS`
* Use `yarn start:plugin` command

```json
REACT_APP_LOCAL_PLUGINS='{"ba5ae691-7ad7-4508-b83d-759529b82a19":{"meta":{"id":"1234","name":"plugin_twitch","pluginId":"123","scopeName":"plugin_twitch","scriptUrl":"http://localhost:3001/remoteEntry.js"}},"84f93e15-f064-4f79-aa74-e60f21c07ba9":{"meta":{"id":"22222","name":"plugin_video","pluginId":"222","scopeName":"plugin_video","scriptUrl":"http://localhost:3002/remoteEntry.js"}}}'
```

Here `ba5ae691-7ad7-4508-b83d-759529b82a19` is the objectId of some spawned 3D object in my local world.

