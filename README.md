[![Master Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=master)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)
[![Develop Status](https://github.com/OdysseyMomentumExperience/ui-client/workflows/Deploy/badge.svg?branch=develop)](https://github.com/OdysseyMomentumExperience/PositionEngine/actions)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Code quality

#### Prettier

Enable prettier in IDE preferences. Check option `Run for files on save`.<br />
Apple rules in `.prettierrc`.

#### Eslint

Enable eslint in IDE preferences.

### Local development

#### GIT lfs
To develop locally there are a few steps that need to be taken.<br />
Firstly the project uses `git-lfs` to load large files.<br />
use `git lfs install` to initialize the git hooks

#### Env vars
Environment variables are loaded using the env-config.js file.<br />
This file is normally created during build or when deploying to a k8 pod.<br />
To create this file first run `yarn dev`.<br />
This will create a config file in the `/public` folder.<br />
In the file change the `base_url` variable to the development server’s domain.

#### Running
Run following scripts:<br />
`$ bash ./dev-env.sh`<br />
`$ yarn start`

### How to add a new icon to the svg-sprite?
1. Copy a new svg-icon to the `ui-kit/assets/icons` folder<br />
2. Change value of `fill` tag to `currentColor`<br />
3. Run `$ yarn run svg-sprite:build`<br />
4. Run `$ yarn run svg-sprite:type`<br />
5. Add the icon to the StoryBook page

### Project structure
    .
    ├── public
    │   |── env-config.js           # Enviroment config file that loads relevant keys and backend routes
    │   └── ...
    ├── src
    │   ├── api                     # Folder can be moved to a separate repo
    │   │   ├── constants           # 
    │   │   ├── repositoris         # Api calls
    │   │   ├── request             # Define axios request
    │   │   └── api.ts              #
    │   ├── ui-kit                  # Folder can be moved to a separate repo
    │   │   ├── atoms               # Small components
    │   │   ├── molecules           # Components without BL
    │   │   ├── hooks               # DOM-hooks (like useClickOutside, etc.)
    │   │   ├── types               # Types for atoms
    │   │   ├── themes              # Theming via styled-components
    │   │   ├── assets
    │   │   │   └── svg-sprite      # Svg-icons & svg-sprite
    │   │   └── ...
    │   ├── core                    # Folder will be moved to a separate repo
    │   │   ├── enums               #
    │   │   ├── constants           #
    │   │   ├── models              # Common Mobx-state-three (e.g. Request, ...)
    │   │   ├── utils               #
    │   │   ├── services            #
    │   │   └── ...
    │   ├── services                #
    │   │   ├── keycloak            # Init keycloak
    │   │   ├── web3                # Init web3 auth
    │   │   └── ...
    │   ├── shared                  # Stuff can be copy pasted to each MF
    │   │   ├── i18n                # Init translations
    │   │   ├── hooks               #
    │   │   └── ...
    │   ├── static                  # Static content
    │   │   ├── images              #
    │   │   ├── styles              #
    │   │   └── fonts               #
    │   ├── scenes                  # Scene can be transformed to microfronted
    │   │   ├── auth      
    │   │   │   └── ...             # Structure like "default"    
    │   │   ├── default             # Home page. Just for sample.
    │   │   │   ├── components      #
    │   │   │   │   ├── organisms   # Components must contain molecules
    │   │   │   │   └── templates   # High-level components without connection to store
    │   │   │   ├── pages           # Main components connected only to own store
    │   │   │   ├── stores          # Using Mobx-state-three
    │   │   │   └── shared          # 
    │   │   ├── unity      
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
    │   │   │   ├── SessionStore    # 
    │   │   │   ├── ThemeStore      # 
    │   │   │   ├── AgoraStore      # 
    │   │   │   ├── MagicStore      # 
    │   │   │   └── ...             # 
    │   │   ├── RootStore.ts        #
    │   │   └── ...
    │   ├── index.tsx                
    │   └── ...   
    ├── README.md       
    └── ... 

### Project structure (old)
    .
    ├── public
    │   |── env-config.js           # Enviroment config file that loads relevant keys and backend routes
    │   └── ...
    ├── src                         
    │   ├── component
    │   │   ├── atoms               # Small components that only handle display and maby very simple local state
    │   │   ├── layout              # Components that manage/ contain the logic for entire routes. (could be renamed organisems)
    │   │   ├── molucules           # Complexer components that make up layouts or main interface. Can contain state and logic relevant to their own goals.
    │   │   ├── overlays            # Special components that are oudside of layouts or routing and provide non routing based features.
    │   │   ├── popup               # Old folder still containing some popups this file needs to be merged into molucules as a subfolder
    │   │   ├── utils               # Old folder containing random mostly atoms that need to be relocated
    │   │   ├── view                # Old folder containing mostly molucules that need to be relocated.
    │   │   ├── ...
    │   ├── context                 # Context contains global state objects and relevant hooks and classes
    │   ├── hooks                   # Container for global hooks that can be reused
    │   ├── store                   # contains zustand stores (expiremental to see if this is a better system than context)
    │   ├── utils                   # Random utility functions not specificaly grouped
    │   ├── index.tsx               # entry point of application
    │   ├── App-new.tsx             # main application component
    │   ├── config.ts               # internal static variables (not enviroment)
    │   └── ...   
    ├── README.md       
    └── ... 
