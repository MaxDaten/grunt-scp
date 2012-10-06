/*
 * grunt-scp
 * https://github.com/ajones/grunt-scp
 *
 * Copyright (c) 2012 Andrew Jones
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';



  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('scp', 'Copy files to a (remote) machine running an SSH daemon.', function () {

    var done = this.async(),
        exec = require('child_process').exec,
        src  = this.file.src,
        dest = this.file.dest,
        dry  = grunt.option('no-write'),
        host = this.data.options.host || 'localhost',
        port = this.data.options.port || '22',
        user = this.data.options.user || 'getGitUser',
        path = this.data.options.path || '~',
        verbose = grunt.option('verbose'),
        preserveTimes = this.data.options.preserveTimes;
    
    // setup the cmd
    var command = ['scp', '-r'];

    // these flags must be set before -P
    if (verbose) {
      command.push('-v');
    }

    if (preserveTimes) {
      command.push('-p');
    }

    // from this line on, the order of the args is relevant!

    // port
    command.push('-P', port);

    // files to copy
    command.push(grunt.file.expand(src).join(' '));
    
    // destination to copy
    command.push(user+'@' + host + ':' + path);

    command = command.join(' ');

    grunt.log.writeln('executing: ' + command );
    grunt.log.write('starting transfer...: ');
    
    if (dry) {
      grunt.log.write('dry run! ');
      grunt.log.ok();
    } else {
      exec(command, function (err, stdout, stderr) {
        if (stdout) {grunt.log.writeln(stdout);}
        if (stderr) {grunt.log.writeln(stderr);}
        
        if (err) {
          grunt.fail.fatal(err);
          done(false);
        } else {
          grunt.log.ok();
          done(true);
        }
      });
    }
  });
};