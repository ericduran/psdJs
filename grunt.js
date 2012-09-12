module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'src/psdJs.js',
          'src/psdJsHeader.js',
          'src/psdJsColorModeData.js',
          'src/psdJsImageResources.js',
          'src/psdJsUtil.js'
        ],
        dest: 'dist/psdJs.js'
      }
    },
    lint: {
      all: ['grunt.js', 'src/*.js']
    },
    min: {
      dist: {
        src: ['lib/*.js', 'dist/psdJs.js'],
        dest: 'dist/psdJs.min.js'
      }
    }
  });
};
