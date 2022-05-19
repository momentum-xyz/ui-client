[![Master Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=master)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)
[![Develop Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=develop)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.<br /> 
Your app is ready to be deployed!

## Code quality
1. Enable `prettier` using IDE preferences. Apple rules in `.prettierrc`.
2. Enable `eslint` using IDE preferences.
3. Enable `husky` using `yarn run postinstall`.

## Local development

#### Before `yarn start`

Run following script `$ bash ./scripts/env-dev.sh`

#### GIT lfs
To develop locally there are a few steps that need to be taken.<br />
Firstly the project uses `git-lfs` to load large files.<br />
use `git lfs install` to initialize the git hooks

#### How to add a new icon to the svg-sprite?
1. Copy a new svg-icon to the `ui-kit/assets/icons` folder<br />
2. Change value of `fill` tag to `currentColor`<br />
3. Run `$ yarn run svg-sprite:build`<br />
4. Run `$ yarn run svg-sprite:type`<br />
5. Add the icon to the StoryBook page

## Project structure
    .
    ├── public
    │   |── env-config.js           # Enviroment config file that loads relevant keys and backend routes
    │   └── ...
    ├── src
    │   ├── api                     # Api calls
    │   │   ├── constants           # 
    │   │   ├── repositoris         # Api calls
    │   │   ├── request             # Define axios request
    │   │   └── api.ts              #
    │   ├── ui-kit                  # Core reusable components
    │   │   ├── atoms               # Small components
    │   │   ├── molecules           # Components without BL
    │   │   ├── hooks               # DOM-hooks (like useClickOutside, etc.)
    │   │   ├── types               # Types for atoms
    │   │   ├── themes              # Theming via styled-components
    │   │   ├── assets
    │   │   │   └── svg-sprite      # Svg-icons & svg-sprite
    │   │   └── ...
    │   ├── core                    # Core functionality
    │   │   ├── enums               #
    │   │   ├── constants           #
    │   │   ├── insterfaces         #
    │   │   ├── models              # Common Mobx-state-three (e.g. Request, ...)
    │   │   ├── utils               #
    │   │   ├── services            #
    │   │   └── ...
    │   ├── shared                  # Stuff can be copy pasted to each MF
    │   │   ├── auth                # Configs for web3, guests, keycloak sessions
    │   │   ├── hooks               # Special hooks for mst-store & user
    │   │   ├── services            #
    │   │   │     ├── i18n          # Init translations
    │   │   │     ├── web3          # Web3 common helpers
    │   │   └──   └── ...
    │   ├── static                  # Static content
    │   │   ├── images              #
    │   │   ├── styles              #
    │   │   └── fonts               #
    │   ├── scenes                  # Scene can be transformed to microfronted
    │   │   ├── default             # Home page. Just for sample.
    │   │   │   ├── pages           # Main components connected only to own store
    │   │   │   ├── stores          # Using Mobx-state-three
    │   │   │   └── index.ts        # 
    │   │   ├── auth      
    │   │   │   └── ...             # Structure like "default"
    │   │   ├── collaboration      
    │   │   │   └── ...             # Structure like "default"
    │   │   ├── stageMode      
    │   │   │   └── ...             # Structure like "default"
    │   │   ├── ...                 # Another scenes (e.g. userProfile, dashboard, ...)
    │   │   ├── App.tsx             
    │   │   └── AppRouter.tsx       
    │   ├── stores                  # Main store & links to substores
    │   │   ├── MainStore           # Main stores which affect all UI
    │   │   │   ├── UnityStore      # 
    │   │   │   ├── ThemeStore      # 
    │   │   │   ├── WorldStore      #
    │   │   │   └── ...             # 
    │   │   ├── SessionStore        # Store for current user
    │   │   ├── RootStore.ts        #
    │   │   └── ...
    │   ├── index.tsx                
    │   └── ...   
    ├── README.md       
    └── ... 
