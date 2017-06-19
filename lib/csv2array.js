'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _legacyEncoding = require('legacy-encoding');

var _legacyEncoding2 = _interopRequireDefault(_legacyEncoding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCSVContent = function getCSVContent(filename) {
  var _ret = _fs2.default.readFileSync(filename);
  return _ret;
};

var isTerminal = function isTerminal(char) {
  return char === ',' || char.charCodeAt(0) === 13;
};

var formatStr = function formatStr(str) {
  return parseInt(str) == str ? parseInt(str) : str;
};

var depackageSingleLine = function depackageSingleLine(line) {

  var tempStr = "";
  var pt = 0;
  var ret = [];

  while (pt < line.length + 1) {

    //special string contains " or , or others.
    if (line[pt] === '"') {
      //pass "
      pt++;
      //find single "
      while (!(line[pt] === '"' && (line[pt + 1] === ',' || pt + 1 >= line.length))) {
        tempStr += line[pt];
        pt += line[pt] === '"' ? 2 : 1;
        if (pt >= line.length) {
          break;
        }
      }
      pt++;
      ret.push(formatStr(tempStr));
      tempStr = "";
    }
    //normal string. find until next ,
    else {
        while (line[pt] !== ',' && pt < line.length) {
          tempStr += line[pt];
          pt++;
        }
        ret.push(formatStr(tempStr));
        tempStr = "";
      }
    pt++;
  }
  return ret;
};

var csv2Array = function csv2Array(filename, encoding) {
  var text = _legacyEncoding2.default.decode(getCSVContent(filename), encoding);

  var pt = 0;
  var tempStr = "";

  var _ret = text.split('\r\n');
  var ret = [];

  for (var x = 0; x < _ret.length - 1; x++) {
    ret.push(depackageSingleLine(_ret[x]));
  }

  return ret;
};

exports.default = csv2Array;