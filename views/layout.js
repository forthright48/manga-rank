const path = require('path');
const publicPath = require('forthright48/world').publicPath;

require('@forthright48/simplecss/src/normalize.css');
require('@forthright48/simplecss/src/simplecss.css');
require('@forthright48/simplecss/src/utilities.css');
require(path.join(publicPath, '/css/style.css'));
