module.exports = function ( grunt ) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	var taskConfig = {
		jshint: {
			src: ['src/**/*.js'],
				options: {
					"curly":	true,
					"eqnull": 	true,
					"eqeqeq": 	true,
					"undef": 	true,
					"node":	true,	// unless we want "use strict"; inside every function...
					"globals": {
						"$": 	true,
						"Console": 	true,
						"$routeProvider": true,
						"document": true,
						"module":	true,
						"angular":	true	// Making sure jshint doesn't complain about angular
					},
			},
		}
	};
	grunt.initConfig(taskConfig);
	
	// For running jshint with simple "grunt" command
	grunt.registerTask('default', ['jshint']);
};
