module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            all: ['release/**', 'release/*.*'],
            image: 'release/images',
            css: 'release/css',
            html: 'release/html/**/*'
        },

        useminPrepare: {
            html:['html/honor/settingManagement.html', 'html/honor/auditStatus.html'],
        },

        copy: {
            src: {
                files: [
                    {expand: true, cwd: 'src', src: ['**/*.html'], dest: 'release'}
                ]
            },
            image: {
                files: [
                    {expand: true, cwd: 'src', src: ['images/*.{png,jpg,jpeg,gif}'], dest: 'release'}
                ]
            },
            libs:{
                files: [
                    {expand: true, cwd: 'src', src: ['libs/**/*.*'], dest: 'release'}
                ]
            }
        },

        concat: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            css: {
                src: [
                    "src/css/*.css"
                ],
                dest: "release/css/main.css"
            },
            honorSetting: {
                src: ['./src/js/honor/setting/*.js'],
                dest: '.temp/js/honor/setting.js'
            }
        },

        //压缩CSS
        cssmin: {
            prod: {
                options: {
                    report: 'gzip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release',
                        src: ['css/*.css'],
                        dest: 'release'
                    }
                ]
            }
        },

        //压缩图片
        imagemin: {
            prod: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [
                    {expand: true, cwd: 'release', src: ['images/*.{png,jpg,jpeg,gif,webp,svg}'], dest: 'release'}
                ]
            }
        },

        uglify: {
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            honorSetting: {
                files: {
                    'release/js/honor/setting.js': ['<%= concat.honorSetting.dest %>']
                }
            },
            buildAll: {//按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand: true,
                    cwd: './src',
                    src: ['js/**/*.js'],
                    dest: './release'
                }]
            }
        },

        // 处理html中css、js 引入合并问题
        usemin: {
            html: 'release/**/*.html'
        },

        //压缩HTML
        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                    {expand: true, cwd: 'release', src: ['**/*.html'], dest: 'release'}
                ]
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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 在命令行上输入"grunt test"，test task就会被执行。
    //grunt.registerTask('test', ['jshint', 'qunit']);

    // 只需在命令行上输入"grunt"，就会执行default task
    grunt.registerTask('default', ['clean', 'useminPrepare', 'copy', 'concat', 'cssmin', 'uglify', 'usemin']);
    grunt.registerTask('buildAll', ['uglify:buildAll']);

};