
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
