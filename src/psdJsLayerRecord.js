
/**
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_13084
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsLayerRecord = (function() {
  'use strict';

  function psdJsLayerRecord(psd) {
    // We always set a start value so we can move around the sections.
    this.start = psd.ds.position;

    // S : Description
    // 4 * 4 : Rectangle containing the contents of the layer. Specified as top, left, bottom, right coordinates
    // 2 : Number of channels in the layer
    // 6 * number of channels: Channel information. Six bytes per channel, consisting of:
    // 2 : bytes for Channel ID: 0 = red, 1 = green, etc.;-1 = transparency mask; -2 = user supplied layer mask, -3 real user supplied layer mask (when both a user mask and a vector mask are present)
    // 4 bytes for length of corresponding channel data. (**PSB** 8 bytes for length of corresponding channel data.) See See Channel image data for structure of channel data.
    // 4 : Blend mode signature: '8BIM'
    // 4 :Blend mode key:
    // 1 : Opacity. 0 = transparent ... 255 = opaque
    // 1 : Clipping: 0 = base, 1 = non-base
    // 1 : Flags:
    //        bit 0 = transparency protected; bit 1 = visible; bit 2 = obsolete;
    //        bit 3 = 1 for Photoshop 5.0 and later, tells if bit 4 has useful information;
    //        bit 4 = pixel data irrelevant to appearance of document
    // 1 : Filler (zero)
    // 4 : Length of the extra data field ( = the total length of the next five fields).
    // * : Layer mask data: See See Layer mask / adjustment layer data for structure. Can be 40 bytes, 24 bytes, or 4 bytes if no layer mask.
    // * : Layer blending ranges: See See Layer blending ranges data.
    // * : Layer name: Pascal string, padded to a multiple of 4 bytes.

    var layerStruct = [
      'top', 'uint32',
      'left', 'uint32',
      'bottom', 'uint32',
      'right', 'uint32',
      'channels', 'uint16',
      'channelsInfo', function(dataStream, struct) {
        var info = [];
        for (var i = 0; i < struct.channels; i++) {
          info.push(psd.ds.readStruct([
            'id', 'uint16',
            'len', 'uint32'
            ])
          );
        }
        //this.channelsInfo[i].rgbakey = this.getRGBAType(this.channelsInfo[i].id);
        return info;
      },
      'blendModeSignature', 'string:4',
      'blendModeKey', 'string:4',
      // this.blendModeName = this.getBlendModeName();

      'opacity', 'uint8',
      'clipping', 'uint8',

      // TODO: Fix me. This needs to be actual bits
      // Skiping the Flags
      'flags', 'uint8',

      'filler', 'uint8',
      'lenDataBlendingName', 'uint32',

    ];

    Util.extend(this, psd.ds.readStruct(layerStruct));

    this.startLen = psd.ds.position;
    this.layerMask = new psdJsLayerMaskAdjustmentData(psd);
    this.layerBlendingRanges = new psdJsLayerBlendingRangesData(psd);

    // "Pascal string, padded to make the size even".
    // The 1st byte tells us how long the name is.
    this.namelen = Util.pad2(psd.ds.readUint8());
    if (this.namelen == 0) {
      // skip the extra byte.
      // this.name = psd.ds.readUint8();
      console.log('This is running');
    }
    else {
      this.layername = psd.ds.readString(this.namelen);

      // TODO: WHAT THE HELL IS IN THIS EMPTY SPACE.
      // We have to pad it to the end in order to move on the the next layer.
      psd.ds.position = this.startLen + this.lenDataBlendingName;
    }
  }

  psdJsLayerRecord.prototype = {
    getRGBAType: function(type) {
      if (type == 65535) {
        return "A";
      }
      return "RGB".substring(type, type + 1);
    },

    getBlendModeName: function() {
      var key = this.blendModeKey;
      // Note: The names are padded to always be 4 characters.
      var names = {
        'pass': 'pass through',
        'norm': 'normal',
        'diss': 'dissolve',
        'dark': 'darken',
        'mul ': 'multiply',
        'idiv': 'color burn',
        'lbrn': 'linear burn',
        'dkCl': 'darker color',
        'lite': 'lighten',
        'scrn': 'screen',
        'div ': 'color dodge',
        'lddg': 'linear dodge',
        'lgCl': 'lighter color',
        'over': 'overlay',
        'sLit': 'soft light',
        'hLit': 'hard light',
        'vLit': 'vivid light',
        'lLit': 'linear light',
        'pLit': 'pin light',
        'hMix': 'hard mix',
        'diff': 'difference',
        'smud': 'exclusion',
        'fsub': 'subtract',
        'fdiv': 'divide',
        'hue ': 'hue',
        'sat ': 'saturation',
        'colr': 'color',
        'lum ': 'luminosity',
      }
      return names[key];
    }
  }

  return psdJsLayerRecord;
})();

var psdJsLayerMaskAdjustmentData = (function() {
  'use strict';

  function psdJsLayerMaskAdjustmentData(psd) {
    this.size = psd.ds.readUint32();
    if (this.size == 0) {
      // We'll skip the other processing.
      return;
    }
    else {
      console.log("The SIZE IS NOT 0");
    }
  }

  return psdJsLayerMaskAdjustmentData;
})();

var psdJsLayerBlendingRangesData = (function() {
  'use strict';

  function psdJsLayerBlendingRangesData(psd) {
    // We always set a start value so we can move around the sections.
    this.start = psd.ds.position;

    // S : Description
    // 4 : Length of layer blending ranges data
    // 4 : Composite gray blend source. Contains 2 black values followed by 2 white values. Present but irrelevant for Lab & Grayscale.
    // 4 : Composite gray blend destination range
    // 4 : First channel source range
    // 4 : First channel destination range
    // 4 : Nth channel source range
    // 4 : Nth channel destination range

    var blendingStruct = [
      'size', 'uint32',
      'compositeSource', 'uint32',
      'compositeDest', 'uint32',
    ];

    Util.extend(this, psd.ds.readStruct(blendingStruct));


    // Seek and skip this for now.
    // TODO: Fix me.
    psd.ds.position = psd.ds.position + (this.size - 8);
  }

  return psdJsLayerBlendingRangesData;

})();
