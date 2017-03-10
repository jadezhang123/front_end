module.exports = function (grunt) {

    grunt.initConfig({
        //package.json 文件读入项目配置信息，并存入pkg 属性内。这样就可以让我们访问到package.json文件中列出的属性了
        pkg: grunt.file.readJSON('package.json'),

        //将所有存在于src/目录下以.js结尾的文件合并起来，然后存储在dist目录中，并以项目名来命名。
        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            honorSetting: {
                src: ['./src/js/honor/setting/*.js'],
                dest: './release/js/honor/setting.js'
            }
        },
        uglify: {
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            honorSetting: {
                files: {
                    'release/js/honor/setting.min.js': ['<%= concat.honorSetting.dest %>']
                }
            },
            buildAll: {//按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand: true,
                    cwd: './src',
                    src: ['!js/honor/setting/*.js','js/**/*.js'],//所有js文件
                    dest: './release'//输出到此目录下
                }]
            }
        },
        watch: {
            build: {
                files: ['./src/js/**/*.js', './src/*.css'],
                task: ['uglify'],
                options: {spawn: false}
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 在命令行上输入"grunt test"，test task就会被执行。
    //grunt.registerTask('test', ['jshint', 'qunit']);

    // 只需在命令行上输入"grunt"，就会执行default task
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
    grunt.registerTask('buildAll', ['uglify:buildAll']);

};