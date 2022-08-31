grunt.initConfig({
  move: {
    test: {
      src: "old",
      dest: "new",
    },
  },
});

grunt.loadNpmTasks("grunt-move");
grunt.registerTask("default", ["move"]);
