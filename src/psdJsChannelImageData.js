/**
 * Channel image data
 *
 * See http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_26431
 * @param  {[type]} psd [description]
 * @return {[type]}     [description]
 */
var psdJsChannelImageData = (function() {

  psdJsChannelImageData = function(psd, index, layerRecords) {
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

  return psdJsChannelImageData;
})();
