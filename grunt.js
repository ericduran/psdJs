module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'lib/DataStreamjs/DataStream.js',
          'src/*.js'
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

  // Submodules, lint, concat, then minimized.
  grunt.registerTask('default', 'submodules lint concat min');


  // Borrowed from jquery
  // see https://github.com/jquery/jquery/blob/master/grunt.js#L377-397
  grunt.registerTask("submodules", function() {
    var done = this.async();

    grunt.verbose.write( "Updating submodules..." );

    grunt.utils.spawn({
      cmd: "git submodule update --init --recursive;"
    }, function(err, result) {
      if (err) {
        grunt.verbose.error();
        done(err);
        return;
      }

      grunt.log.writeln(result);

      done();
    });
  });

};
