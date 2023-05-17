'use strict';

/**
 * svg-sprite
 * https://github.com/jkphl/svg-sprite
 */

const requireContext = require('require-context');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const SVGSpriter = require('svg-sprite');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const SPRITE_FILE_NAME = 'svg-sprite.svg';
const SVG_SPRITE_INPUT = resolveApp('src/assets/icons');
const SVG_SPRITE_OUTPUT = resolveApp('src/assets/svg-sprite');

const removeCurrentSvgSprite = () => {
  /** node v12.10.0 */
  fs.rmdirSync(SVG_SPRITE_OUTPUT, {recursive: true});
};

const createNewSvgSprite = () => {
  const config = {
    /** 'info', 'verbose' or 'debug' */
    log: 'info',
    mode: {
      /** sprite with `symbol` mode */
      symbol: {
        dest: '.',
        sprite: `${SVG_SPRITE_OUTPUT}/${SPRITE_FILE_NAME}`,
        inline: true,
        /** add content based hash to the filename */
        bust: false
      }
    }
  };

  const spriter = new SVGSpriter(config);

  const svgModules = requireContext(SVG_SPRITE_INPUT, false, /\.svg$/);
  svgModules.keys().forEach((svgIconPath) => {
    /** add all SVG source files */
    spriter.add(
      path.resolve(`${SVG_SPRITE_INPUT}/${svgIconPath}`),
      svgIconPath,
      fs.readFileSync(`${SVG_SPRITE_INPUT}/${svgIconPath}`, {encoding: 'utf-8'})
    );
  });

  /** compile the sprite */
  spriter.compile((error, result, data) => {
    if (error) console.log(error);

    /** run through all files that have been created for the `symbol` mode */
    for (var type in result.symbol) {
      /** recursively create directories as needed */
      mkdirp.sync(path.dirname(result.symbol[type].path));

      /** write the generated resource to disk */
      fs.writeFileSync(result.symbol[type].path, result.symbol[type].contents);
    }
  });
};

removeCurrentSvgSprite();
createNewSvgSprite();
