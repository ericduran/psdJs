
// "use strict"

/**
 * psd.js
 *
 * Reads PSD (layers, mask, info).
 *
 * @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
 */

var psdJs = (function psdJSClosure() {

  function psdJs(data) {
    try {
      this.ds = new DataStream(data, 0, false);
      this.header = new psdJsHeader(this);
    }
    catch (e) {}

    this.colorModeData = new psdJsColorModeData(this);
    this.imageResources = new psdJsImageResources(this);
    this.layerMask = new psdJsLayerMask(this);
  }

  psdJs.prototype = {
    seekToHeader: function() {

    },
    seekToColorModeData: function() {

    },
    seekToImageResources:  function() {

    },
    seekToLayerMaskInfo: function() {

    },
    seekToImageData: function() {

    }
  }

  return psdJs;
})();

psdImageData = function (psd) {
  psd.ds.seek(psd.ds.position + psd.layerMask.len - 4);
  this.compression = psd.ds.readUint16();
  this.data = psd.ds.readUint8Array(psd.ds._byteLength - psd.ds.position);
}


