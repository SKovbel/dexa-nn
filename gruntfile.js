/**
    npm install grunt
    npm install grunt-cli
    npm install grunt-contrib-concat
    npm install grunt-contrib-watch
    npm install grunt-contrib-uglify

    ./node_modules/grunt/bin/grunt concat
    ./node_modules/grunt/bin/grunt watch
 */

module.exports = function(grunt){
    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    ["./libs/**"],
                ],
                dest: "./dexa.js"
            }
        },
        /*uglify: {
            files: {
                src: "dexa.js",
                dest: "dexa.min.js"
            }
        },*/
        watch: {
            options: {
                atBegin: true,
                event: ['all']
            },
            files: ['**/*'],
            tasks: ['concat'],
          }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['watch']);
};
