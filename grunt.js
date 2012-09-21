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
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        validthis: false
      },
    },
    min: {
      dist: {
        src: ['dist/psdJs.js'],
        dest: 'dist/psdJs.min.js'
      }
    }
  });

  // Submodules, lint, concat, then minimized.
  grunt.registerTask('default', 'submodules concat min');


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
