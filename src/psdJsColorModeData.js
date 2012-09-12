/**
 * PSD Color Mode Data Section. // Offset: 26, Length: Variable.
 * Only 'Indexed' and 'Duotone' have color mode data.
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_71638
 * @param  {psd} psd The psd object.
 * @return {psdColorModeData} The psdColorModeData object.
 */

var psdJsColorModeData = (function psdJsHeaderClosure() {
  'use strict';

  function psdJsColorModeData(psd) {
    // S : Description
    // 4 : The length of the following color data.
    // x : The color data

    this.size = psd.ds.readUint32();

    if (psd.header.colorMode == 'Indexed' || psd.header.colorMode == 'Duotone') {
      // TODO: Set the proper data for indexed and Duotone color modes.
    }
    else {
      if (this.size != 0) {
        // "For all other modes, this section is just the 4-byte length field, which is set to zero."
        this.data = psd.ds.readUint32();
      }
    }
  }

  return psdJsColorModeData;
})();
