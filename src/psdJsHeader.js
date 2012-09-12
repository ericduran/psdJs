/**
 * PSD Header Section.
 *
 * The 1st part of the PSD file. The header contains the basic properties of the PSD file.
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_19840
 *
 * @param  {psdJs} psd The psdJs object.
 * @return {psdJsHeader} The psdJsHeader object.
 */
var psdJsHeader = (function psdJsHeaderClosure() {
  'use strict';

  function psdJsHeader(psd) {
    // We always set a start value so we can move around the sections.
    this.start = psd.ds.position;

    // S : Description
    // 4 : Signature: always equal to '8BPS'.
    // 2 : Version: always equal to 1. Do not try to read the file if the version does not match this value. (**PSB** version is 2.)
    // 6 : Reserved: must be zero.
    // 2 : The number of channels in the image, including any alpha channels. Supported range is 1 to 56.
    // 4 : The height of the image in pixels. Supported range is 1 to 30,000. (**PSB** max of 300,000.)
    // 4 : The width of the image in pixels. Supported range is 1 to 30,000. (*PSB** max of 300,000)
    // 2 : Depth: the number of bits per channel. Supported values are 1, 8, 16 and 32.
    // 2 : The color mode of the file.

    var header = [
      'signature', 'string:4',
      'version', 'uint16',
      'reserved', 'string:6',
      'channels', 'uint16',
      'height', 'uint32',
      'width', 'uint32',
      'depth', 'uint16',
      'colormode', 'uint16'
    ];

    Util.extend(this, psd.ds.readStruct(header));

    if (this.signature != '8BPS' || this.version != 1) {
      throw new Error("Invalid PSD");
    }

    this.colormodeName = this.getColorMode();
  }

  psdJsHeader.prototype = {
    // Returns the name of the supported color mode.
    getColorMode: function () {
      // Supported values are: Bitmap = 0; Grayscale = 1; Indexed = 2; RGB = 3;
      // CMYK = 4; Multichannel = 7; Duotone = 8; Lab = 9.
      var modes = {
        0: 'Bitmap',
        1: 'Grayscale',
        2: 'Indexed',
        3: 'RGB',
        4: 'CMYK',
        7: 'Multichannel',
        8: 'Duotone',
        9: 'Lab'
      };

      // TODO: Blindly assumes the value is always available.
      return modes[this.colormode];
    }
  }

  return psdJsHeader;
})();
