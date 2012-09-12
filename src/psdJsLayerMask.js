
/**
 * Fourth section of a Photoshop file. Contains information about layers and masks.
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_75067
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsLayerMask = (function() {
  'use strict';

  function psdJsLayerMask(psd) {
    this.len = psd.ds.readUint32();
    this.info = new psdJsLayerMaskInfo(psd);
  }

  return psdJsLayerMask;
})();
