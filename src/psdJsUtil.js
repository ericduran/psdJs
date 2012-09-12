/**
 * Utilities
 *
 * Utility function
 */

'use strict';

var Util = psdJs.Util = (function UtilClosure() {
  function Util() {}

  Util.extend = function (des, src) {
    for (var property in src) {
      des[property] = src[property];
    }
    return des;
  }

  Util.pad2 = function(num) {
    // TODO: This fails if the number == 0 since it should be padded to 2 in
    // case.
    return (num % 2 == 0) ? num : num + 1;
  }

  Util.pad4 = function(num) {
    // TODO: This is needed for the Pascal string on the layer name. But I'm
    // skipping that section for now.
  }

  Util.rleEnconde = function (data) {

  }

  Util.rleDecode = function(data) {
    var output = "";

    data.forEach(function(pair) {
      output += new Array(1+pair[0]).join(pair[1])
    });

    return output;
  }

  return Util;
})();
