# psdJs


psdJs is a Javascript experiment that explores building a parser for
Photoshop Documents (PSD).

##Building
First, clone a copy of the main psdJs git repo by running:

```bash
  git clone git://github.com/ericduran/psdJs.git
```

Enter the directory and install the Node dependencies:

```bash
cd psdJs && npm install
```

Make sure you have grunt installed by testing:

```bash
grunt -version
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of psdJs, type the following:

```bash
grunt
```

The built version of psdJs will be put in the dist/ subdirectory.

### PSD resources

http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm
