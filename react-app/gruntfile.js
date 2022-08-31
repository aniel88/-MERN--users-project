module.exports = function (grunt) {
  grunt.initConfig({
    move: {
      move_deploy: {
        src: "./build",
        dest: "../server/views",
      },
    },
    copy: {
      copy_deploy: {
        expand: true,
        cwd: "./build/",
        src: ["**"],
        dest: "../server/views/",
      },
    },
    clean: {
      src: "../server/views/",
    },
  });

  grunt.loadNpmTasks("grunt-move");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
};
