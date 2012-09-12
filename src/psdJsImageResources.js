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
