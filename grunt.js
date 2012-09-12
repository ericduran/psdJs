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

  // Submodules, Lint, concat, then minimized.
  grunt.registerTask('default', 'submodules concat min');


  // Borrowed from jquery
  // see https://github.com/jquery/jquery/blob/master/grunt.js#L377-397
  grunt.registerTask("submodules", function() {
    var done = this.async();

    grunt.verbose.write( "Updating submodules..." );

    // TODO: migrate remaining `make` to grunt tasks
    //
    grunt.utils.spawn({
      cmd: "make"
    }, function( err, result ) {
      if ( err ) {
        grunt.verbose.error();
        done( err );
        return;
      }

      grunt.log.writeln( result );

      done();
    });
  });

};
