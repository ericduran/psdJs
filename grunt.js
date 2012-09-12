module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'lib/DataStreamjs/DataStream.js',
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
        src: ['dist/psdJs.js'],
        dest: 'dist/psdJs.min.js'
      }
    }
  });

  // Lint, concat, then minimized.
  grunt.registerTask('default', 'lint concat min');
};
