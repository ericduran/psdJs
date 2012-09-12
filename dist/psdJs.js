
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
      this.colorModeData = new psdJsColorModeData(this);
      this.imageResources = new psdJsImageResources(this);
      this.layerMask = new psdLayerMask(this);
    }
    catch (e) {

    }
  }

  psdJs.prototype = {
    seekToHeader: function() {},
    seekToColorModeData: function() {},
    seekToImageResources:  function() {},
    seekToLayerMaskInfo: function() {},
    seekToImageData: function() {}
  }

  return psdJs;
})();


/**
 * Fourth section of a Photoshop file. Contains information about layers and masks.
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_75067
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
psdLayerMask = function (psd) {
  this.len = psd.ds.readUint32();
  this.info = new psdLayerMaskInfo(psd);
}

psdLayerMask.prototype = {}

/**
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_16000
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
psdLayerMaskInfo = function(psd) {
  this.len = Util.pad2(psd.ds.readUint32());
  this.layerCount = psd.ds.readUint16();
  this.layerRecords = this.parseLayerRecords(psd);
  this.channelImageData = this.parseChannelImageData(psd);
}

psdLayerMaskInfo.prototype = {

  parseLayerRecords: function (psd) {
    var records = [], layerRecord;
    for (var i = 0; i < this.layerCount; i++) {
      layerRecord = new psdLayerRecord(psd);
      records.push(layerRecord);
    };

    return records;
  },

  parseChannelImageData: function(psd) {
    var records = [], channelImageData;
    for (var i = 0; i < this.layerCount; i++) {
      channelImageData = new psdchannelImageData(psd, i, this.layerRecords);
      records.push(channelImageData);
    };

    return records;
  }
}

/**
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_13084
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
psdLayerRecord = function(psd) {
  this.top = psd.ds.readUint32();
  this.left = psd.ds.readUint32();
  this.bottom = psd.ds.readUint32();
  this.right = psd.ds.readUint32();
  this.channels = psd.ds.readUint16();
  this.channelsInfo = [];
  if (this.channels > 0) {
    for (var i = 0; i < this.channels; i++) {
      this.channelsInfo[i] = {};
      this.channelsInfo[i].id = psd.ds.readUint16();
      this.channelsInfo[i].len = psd.ds.readUint32();
      this.channelsInfo[i].rgbakey = this.getRGBAType(this.channelsInfo[i].id);
    };
  }
  this.blendModeSignature = psd.ds.readString(4);
  this.blendModeKey = psd.ds.readString(4);
  this.blendModeName = this.getBlendModeName();
  this.opacity = psd.ds.readUint8();
  this.clipping = psd.ds.readUint8();

  // TODO: Fix me. This needs to be actual bits
  // Skiping the Flags
  this.flags = psd.ds.readUint8();

  this.filler = psd.ds.readUint8();
  this.lenDataBlendingName = psd.ds.readUint32();
  this.startLen = psd.ds.position;
  this.layerMask = new psdLayerMaskAdjustmentData(psd);
  this.layerBlendingRanges = new psdLayerBlendingRangesData(psd);

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

psdLayerRecord.prototype = {
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

psdLayerMaskAdjustmentData = function(psd) {
  this.size = psd.ds.readUint32();
  if (this.size == 0) {
    // We'll skip the other processing.
    return;
  }
  else {
    console.log("The SIZE IS NOT 0");
  }
}

psdLayerBlendingRangesData = function(psd) {
  this.size = psd.ds.readUint32();
  // Seek and skip this for now.
  // TODO: Fix me.
  psd.ds.position = psd.ds.position + this.size;
}

psdImageData = function (psd) {
  psd.ds.seek(psd.ds.position + psd.layerMask.len - 4);
  this.compression = psd.ds.readUint16();
  this.data = psd.ds.readUint8Array(psd.ds._byteLength - psd.ds.position);
}

/**
 * Channel image data
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_26431
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
psdchannelImageData = function(psd, index, layerRecords) {
  this.compression = psd.ds.readUint16();
  psd.ds.position = psd.ds.position + this.dataSize;

  // If the compression code is 0, the image data is just the raw image data,
  // whose size is calculated as (LayerBottom-LayerTop)* (LayerRight-LayerLeft)
  // (from the first field in See Layer records).
  if (this.compression == 0) {
    this.dataSize = (layerRecords[index].bottom - layerRecords[index].top) * (layerRecords[index].right - layerRecords[index].left);
    if (this.dataSize == 0) {
      return
    }
    else {
      if (this.dataSize == 2000000) {
          var elementSize = this.dataSize * Uint8Array.BYTES_PER_ELEMENT;
          var buffer = new ArrayBuffer(elementSize);
          this.data = new Uint8Array(buffer);
          for (var i = 0; i < this.data.length; i++) {
            this.data[i] = psd.ds.readUint8();
          };
          var tempcanvas = document.createElement('canvas');
          tempcanvas.height = (layerRecords[index].bottom - layerRecords[index].top);
          tempcanvas.width = (layerRecords[index].right - layerRecords[index].left);
          var tempcontext = tempcanvas.getContext('2d');

          var imgdata = tempcontext.getImageData(0,0,tempcanvas.width,tempcanvas.height);
          console.log(this.data.length);
          var imgdatalen = this.data.length;
          for(var i=0; i<imgdatalen; i++)
          {
               imgdata.data[i] = this.data[i];
          }
          console.log(imgdata);
          tempcontext.putImageData(imgdata,0,0);
        var img = document.getElementById('img');
                       img.height = tempcanvas.height;
                       img.width = tempcanvas.width;
                       img.src = tempcanvas.toDataURL();
          console.log(tempcontext);
          console.log(img);

      }
      else {
        psd.ds.position = psd.ds.position + this.dataSize;
      }
    }
  }
  else {
    if (this.compression == 1) {
      // RLE
              psd.ds.position = psd.ds.position + this.dataSize;

      console.log(psd.ds.readUint8());
    }
    else {
      psd.ds.position = psd.ds.position + this.dataSize;
    console.log('Different compression');

    }
  }

}

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

/**
 * PSD Image Resources Section. // Offset: 34, Length: Variable.
 * "Image resources are used to store non-pixel data associated with images, such as pen tool paths"
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_69883
 * @param  {psd} psd The psd object.
 * @return {psdImageResources} The psdImageResources object.
 */

var psdJsImageResources = (function psdJsImageResourcesClosure() {
  'use strict';

  function psdJsImageResources(psd) {
    // S : Description
    // 4 : Length of image resource section. The length may be zero.
    // x : Image resources (psdJsImageResourceBlock).

    var lenMissing;
    this.resources = [];

    // Lets also set the missing len to the size.
    // We'll subtract every resource byte until we get to 0.
    // Then we'll know when the Image Resources are over.
    this.size = lenMissing = psd.ds.readUint32();

    // Process Image Resources.
    var x = 0;
    while (lenMissing > 0) {
      var resourceSize = this.processResourceBlock(psd);
      lenMissing -= resourceSize;
    }
    if (lenMissing < 0) {
      // TODO: Trow error if we go over the expected lenght (if lenMissing != 0)
      console.log('Image Resources failed (psdImageResources) Over: ' + lenMissing);
    }
  }

  psdJsImageResources.prototype = {
    // Return the resource block lenght;
    processResourceBlock: function(psd) {
      var resource = new psdJsImageResourceBlock(psd);
      this.resources.push(resource);
      return resource.totalSize;
    }
  }

  return psdJsImageResources;
})();

var psdJsImageResourceBlock = (function psdJsImageResourceBlockClosure() {
  'use strict';

  function psdJsImageResourceBlock(psd) {
    // S : Description
    // 4 : Signature: '8BIM'
    // 2 : Unique identifier for the resource. Image resource IDs contains a list of resource IDs used by Photoshop.
    // x : Name: Pascal string
    // 4 : Actual size of resource data that follows
    // x : The resource data, described in the sections on the individual resource types. It is padded to make the size even.

    var start = psd.ds.position;
    var dataBuffer, bufferElementSize = 0;
    this.totalSize = 0;
    this.len = 0;
    this.signature = psd.ds.readString(4);
    this.id = psd.ds.readUint16();

    // "Pascal string, padded to make the size even".
    // The 1st byte tells us how long the name is.
    this.namelen = Util.pad2(psd.ds.readUint8());
    if (this.namelen == 0) {
      //skip the extra byte.
      this.name = psd.ds.readUint8();
    }
    else {
      // TODO: Trow error if actually get a len larger than 0
      console.log('Image Resource block failed namelen: ' + this.namelen);
    }

    this.len = Util.pad2(psd.ds.readUint32());
    this.totalSize = (psd.ds.position + this.len) - start;

    // Set up an Uint8Array to store our data.
    var elementSize = this.len * Uint8Array.BYTES_PER_ELEMENT;
    var buffer = new ArrayBuffer(elementSize);
    this.data = new Uint8Array(buffer);
    for (var i = this.data.length - 1; i >= 0; i--) {
      this.data[i] = psd.ds.readUint8();
    };
  }

  return psdJsImageResourceBlock;
})();

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
