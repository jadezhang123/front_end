module.exports = function(grunt) {

	grunt.initConfig({
		//package.json 文件读入项目配置信息，并存入pkg 属性内。这样就可以让我们访问到package.json文件中列出的属性了
		pkg: grunt.file.readJSON('package.json'),
	
		//将所有存在于src/目录下以.js结尾的文件合并起来，然后存储在dist目录中，并以项目名来命名。
		concat: {
			options: {
				// 定义一个用于插入合并输出文件之间的字符
				separator: ';'
			},
			dist: {
				// 将要被合并的文件
				src: ['src/**/*.js'],
				// 合并后的JS文件的存放位置
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		//在dist/目录中创建了一个包含压缩结果的JavaScript文件。这里使用了<%= concat.dist.dest>，
		//因此uglify会自动压缩concat任务中生成的文件。
		uglify: {
			options: {
				// 此处定义的banner注释将插入到输出文件的顶部
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		}
	});

	//grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// 在命令行上输入"grunt test"，test task就会被执行。
	//grunt.registerTask('test', ['jshint', 'qunit']);

	// 只需在命令行上输入"grunt"，就会执行default task
	grunt.registerTask('default', ['concat', 'uglify']);

};