
/**
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_13084
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsLayerRecord = (function() {
  function psdJsLayerRecord(psd) {
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
