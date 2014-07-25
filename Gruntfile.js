module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		concat:{
			nce:{
				src:['nce/src/index.js'],
				template:['nce/template/style.tpl'],
				dest:'nce/dest/nce.js'
			}
		},
		uglify:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			nce:{
				src:'nce/dest/nce.js',
				dest:'nce/dest/nce.min.js'
			},
		},
		watch:{
			files:['src/~.js','template/~.tpl'],
			tasks:['concat','uglify']
		}
	});
	grunt.loadNpmTasks('grunt-qc-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-qc-watch');

	grunt.registerTask('default',['concat','uglify']);
}
