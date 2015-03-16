var pkg = require('./package.json'),
	config = {
		pkg: pkg,
		app: 'src',
		dist: 'dist'
	},
	compiled_dir = './public/assets/compiled/',
	build_dir = './public/assets/build/',
	path = {
		js_compiled: compiled_dir + 'js/',
		css_compiled: compiled_dir + 'css/',
		js_build : build_dir + 'js/',
		css_build: build_dir + 'css/',
		css_asset_path: './app/assets/stylesheets/'
	},
	bower_pkg = './.bowerrc',
	asset_pkg = './.assetpack';

module.exports = function(grunt) {
	var js_list = Array(),
		css_list = Array(),
		asset = grunt.file.readJSON('./.assetpack'),
		bower = grunt.file.readJSON(bower_pkg);

	asset.js.forEach(function(js) {
		js_list.push(bower.directory + '/' + js);
	});

	asset.css.forEach(function(css) {
		css_list.push(bower.directory + '/' + css);
	});
	css_list.push(path.css_compiled + '*.css');
	
	grunt.initConfig({
		config: config,
		pkg: config.pkg,
		bower: bower,
		path: path,
		js_list: js_list,
		less: {
			development: {
				options: {
					compress: false,
					path: [path.css_asset_path]
				},
				files: [{
					expand: true,
					cwd: path.css_asset_path,
					src: ["<%= css_asset_path %>*.less.erb"],
					dest: "<%= path.css_compiled %>",
					ext: ".css"
				}]
			},
			production: {
				options: {
					compress: true,
					path: [path.css_asset_path]
				},
				files: [{
					expand: true,
					cwd: path.css_asset_path,
					src: ["<%= css_asset_path %>*.less.erb"],
					dest: "<%= path.css_compiled %>",
					ext: ".css"
				}]
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: js_list,
				dest: "<%= path.js_build %>main.js"
			},
			css: {
				src: css_list,
				dest: "<%= path.css_build %>main.css"
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			build: {
				src: "<%= path.js_build %>main.js",
				dest: "<%= path.js_build %>main.js"
			}
		},

		watch: {
			styles: {
				files: ['./app/assets/stylesheets/*.less.erb'],
				tasks: ['less:development', 'concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less:development', 'concat']);
	grunt.registerTask('production', ['less:production', 'concat', 'uglify']);

};