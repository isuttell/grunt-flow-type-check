/*
 * grunt-flow-type-check
 * https://github.com/isuttell/grunt-flow-type-check
 *
 * Copyright (c) 2014 Isaac Suttell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: {
        src: [
          'Gruntfile.js',
          'tasks/**/*.js',
          '<%= nodeunit.tests %>'
        ]
      }
    },

    // Configuration to be run (and then tested).
    flow: {
      options: {
        configFile: 'test/fixtures'
      },
      single: {
        options: {
          background: false
        }
      },
      json: {
        options: {
          json: true
        }
      },
      watch: {
        options: {
          background: true
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    // For testing watch support
    watch : {
      task: {
        files: [
          'Gruntfile.js',
          'tasks/**/*.js',
          '<%= nodeunit.tests %>'
        ],
        tasks: ['test']
      },
      flow: {
        files: ['test/fixtures/**/*.jsx'],
        tasks: ['flow:watch:status']
      }

    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['nodeunit', 'jshint', 'jscs']);
  grunt.registerTask('testWatch', ['flow:watch:start', 'watch']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['watch:task']);

};
