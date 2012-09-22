/**
 * Channel image data
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_26431
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsChannelImageData = (function() {

  psdJsChannelImageData = function(psd, index, layerRecords) {
    // We always set a start value so we can move around the sections.
    this.start = psd.ds.position;

    // S : Description
    // 2 : Compression. 0 = Raw Data, 1 = RLE compressed, 2 = ZIP without prediction, 3 = ZIP with prediction.
    // * : Image data.
    //      If the compression code is 0, the image data is just the raw image data, whose size is calculated as (LayerBottom-LayerTop)* (LayerRight-LayerLeft) (from the first field in See Layer records).
    //      If the compression code is 1, the image data starts with the byte counts for all the scan lines in the channel (LayerBottom-LayerTop) , with each count stored as a two-byte value.(**PSB** each count stored as a four-byte value.) The RLE compressed data follows, with each scan line compressed separately. The RLE compression is the same compression algorithm used by the Macintosh ROM routine PackBits, and the TIFF standard.
    //      If the layer's size, and therefore the data, is odd, a pad byte will be inserted at the end of the row.
    //      If the layer is an adjustment layer, the channel data is undefined (probably all white.)

    this.rows = layerRecords[index].bottom - layerRecords[index].top;
    this.cols = layerRecords[index].right - layerRecords[index].left;
    this.rb = parseInt((this.cols * psd.header.depth + 7) / 8);
    this.ch = [];

    // This isn't really explain in the docs. Took a while to figure out.
    // The image data is per channel, each channel has a lenght. You can see
    // the channel in from the LayerRecords. We moved through the imageData
    // by seeking accross the left of each channel data. This always
    // means the raw image data size is not actually the size of bytes in this
    // block. I haven't been able to find the image data yet. But this does
    // parse all the encription correctly and seeks forward to the next expect
    // location for now. Most of this was abstracted out from http://telegraphics.com.au/svn/psdparse/trunk/
    // I build psdParse and ran the same psd to compare output. This lead me to this logic.
    // This does break in certain PSDs. More testing required.
    for (var i = 0; i < layerRecords[index].channels; i++) {
      this.ch[i] = {};
      this.ch[i].rowbytes  = this.rb;
      this.ch[i].pos = psd.ds.position;
      this.ch[i].rows = this.rows;
      this.ch[i].cols = this.cols;
      this.ch[i].compression = psd.ds.readUint16();
      // We need to remove 2 for reading the compression.
      psd.ds.position = psd.ds.position + (layerRecords[index].channelsInfo[i].len - 2);
    }



    // TODO: CONTINUE FROM HERE. THIS IS WHERE I LEFT OF LAST on 9/22/2012
    // if (this.compression === 0) {
    //   // for (var i = 0; i < 2; i++) {
    //     if (this.rows) {
    //       this.maybeSize = (this.rb * this.rows);
    //       psd.ds.position = psd.ds.position + (this.rb * this.rows)  - 2x;
    //     }
    //   // }

    // }
  }

  psdJsChannelImageData.prototype = {

    getDataSize: function(compression) {
      if (compression === 0) {
        // If the compression code is 0, the image data is just the raw image
        // data, whose size is calculated as (LayerBottom-LayerTop)* (LayerRight-LayerLeft)
        // (from the first field in See Layer records).
      }
      else if (compression === 1) {

      }
      else if (compression === 2) {

      }
      else if (compression === 3) {

      }
    }
  };

  return psdJsChannelImageData;
})();
