
/**
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_16000
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsLayerMaskInfo = (function() {
  function psdJsLayerMaskInfo(psd) {
    this.len = Util.pad2(psd.ds.readUint32());
    this.layerCount = psd.ds.readUint16();
    this.layerRecords = this.parseLayerRecords(psd);
    this.channelImageData = this.parseChannelImageData(psd);
  }

  psdJsLayerMaskInfo.prototype = {

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

  return psdJsLayerMaskInfo;
})();
