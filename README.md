# psdJs

psdJs is a Javascript experiment that explores building a parser for
Photoshop Documents (PSD).

Note: This library isn't completed. When I started there wasn't many PSD Parsing Libs in JS but recently there has
been a couple appearing on github so I figured I'll just open source this. Especially since my activity on it has been
slowing down lately.

This isn't complete. Right now everything is parsed except for the Image Data Section.

I'll update the docs with instruction soon.

This project was a library that grew from another project I was working on call PSDViewer. The idea behind PSDViewer is to
Drag and Drop PSD files and be able to toggle layer on and off and of course view the render image of each layer.

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
