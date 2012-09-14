/**
 *
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */

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
      'channels', function(dataStream, struct) {
        var info = [];
        // We're going to read in 8 bytes each loop, so we go up by 8.
        // The struct.size also needs to be lowered by 8 bytes because we read
        // the first 8 bytes before the loop.
        for (var i = 0; i < struct.size - 8; i = i + 8) {
          info.push(psd.ds.readStruct([
            'source', 'uint32',
            'dest', 'uint32'
          ]));
        }
        return info;
      }
    ];

    Util.extend(this, psd.ds.readStruct(blendingStruct));
  }

  return psdJsLayerBlendingRangesData;

})();
