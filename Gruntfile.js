module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      main: {
        options: {
          // protocol: 'https',
          port: 8080,
          base: './',
          keepalive: true,
          open: false,
          debug: true,
          livereload: 35730
        }
      },
    },
    clean: {
      compiled: ['**/.DS_Store', '**/Thumbs.db', '_compiled'],
      buildPre: ['./build/**'],
      buildPost: ['./build/all-templates.js']
    },
    babel: {
      options: { sourceMap: true },
      src: {
        files: [
          { expand: true,
            cwd: './app',
            src: '**/*.js',
            dest: './_compiled'
          }
        ]
      },
      build: {
        files: [
          { expand: true,
            cwd: './app',
            src: '**/*.js',
            dest: './_compiled',
            ext: '.js'
          }
        ]
      },
    },
    sass: {
      src: {
        files: [
          { expand: true,
            cwd: './app',
            src: ['**/*.sass'],
            dest: './_compiled',
            ext: '.css'
          }
        ],
        options: {
          sourcemap: 'auto'
        }
      }
    },
    karma: {
      unit: {
        options: {
          // autoRun: true,
          autoRun: false,
          frameworks: ['jasmine'],
          files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-mocks/angular-mocks.js',
            '_compiled/app-module.js',
            '_compiled/app-config.js',
            '_compiled/**/*.js',
          ],
          browsers: ['Chrome']
        }
      }
    },
    watch: {
      babel: {
        files: ['./app/**/*.js'],
        tasks: ['babel:src']
      },
      sass: {
        files: ['./app/**/*.sass'],
        tasks: ['sass:src']
      },
      reload: {
        files: ['./_compiled/**/*.js', './_compiled/**/*.css', './app/**/*.html'],
        tasks: [],
        options: { livereload: 35730 }
      }
    },
    copy: {
      // // currently, all libraries are built by concat/minify process.
      // buildLibs: {
      //   expand: true,
      //   src: [
      //     './bower_components/**',
      //     './lib/**'
      //   ],
      //   dest: 'build'
      // },
      buildAssets: {
        expand: true,
        cwd: './app',
        src: [
          './fonts/**',
          './img/**'
        ],
        dest: 'build'
      },
    },
    ngtemplates: {
      build: {
        cwd: 'app/',
        src: ['./**/*.html', '!./index.html', '!./component-template/component-template.html'],
        dest: 'build/all-templates.js',
        options: {
          module: 'app',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments:  true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }
      }
    },
    uglify: {
      build: {
        options: {
          sourceMap: true
        },
        files: {
          'build/v2v.min.js': [
            'lib/markdown/markdown.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            '_compiled/app-module.js',
            'build/all-templates.js',
            '_compiled/app-config.js',
            '_compiled/**/*.js',
            '!./_compiled/component-template/*',
            '!./_compiled/services/service-template.js'
          ]
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'build/v2v.min.css': ['_compiled/**/*.css']
        }
      }
    },
    processhtml: {
      options: { },
      build: {
        files: {
          'build/index.html': ['app/index.html']
        }
      }
    },
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('build', [
    'clean:compiled',
    'clean:buildPre',
    'babel:build',
    'sass:src',
    'copy:buildAssets',
    'ngtemplates:build',
    'uglify:build',
    'cssmin:build',
    'processhtml:build',
    'clean:buildPost'
    ]);

}