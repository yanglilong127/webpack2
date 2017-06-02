const path=require('path');
const webpack=require('webpack');
//创建html文件
const HtmlWebpackPlugin=require('html-webpack-plugin');
//提取css文件
const ExtractTextPlugin=require('extract-text-webpack-plugin');
const ExtractCSS=new ExtractTextPlugin({filename:'css/[name].css'});
//当前npm运行的命令,判断是否是开发模式
var isDev=process.env.NODE_ENV==='dev'

module.exports={
	entry:{
		index:path.join(__dirname,'src/js/index.js'),
		news:path.join(__dirname,'src/js/news.js'),
		common:[
			path.join(__dirname,'libs/js/app.js'),
			path.join(__dirname,'libs/js/jquery.js')
		]
	},
	output:{
		path:path.join(__dirname,'dist'),
		filename:'js/[name].js',
		publicPath:''
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:[{
					loader:'babel-loader',
					options:{presets:['es2015']}
				}]
			},
			{
				test:/\.html$/,
				loader:'html-loader'
			},
			{
				test:/\.css$/,
				exclude:/node_modules/,
				use:ExtractCSS.extract([
					'css-loader',									
					{
						loader:'postcss-loader',
						options: {
			                postcss: function(){
			                    return [
			                        require("autoprefixer")({
			                            browsers: ['ie>=8','>1% in CN']
			                        })
			                    ]
			                }
			            }
					}
				])
			},
			/**
			{
				test:/\.less/,
				use:new ExtractTextPlugin('css/[name].css').extract(['css-loader','less-loader'])
			},
			 **/
			{
				test:/\.(eot|svg|ttf|woff|woff2)$/,
				loader:'file-loader',
				options:{
					limit:5000,
					name:'/font/[hash:8]_[name].[ext]'
				}
			},
			{
				test:/\.(jpe?g|gif|png|svg)$/,
				loader:'file-loader?name=/images/[hash:8].[name].[ext]'
			}
		]
	},
	/****
	postcss: [require("autoprefixer")({
                    browsers: ['ie>=8','>1% in CN']
            })],
    *****/
	resolve:{
		alias:{
			testjs:path.join(__dirname,'src/js/test.js'),
			jquery:path.join(__dirname,'libs/js/jquery.js'),
			indexcss:path.join(__dirname,'src/css/index.css'),
			homecss:path.join(__dirname,'src/css/home.css'),
			newscss:path.join(__dirname,'src/css/news.css'),
			fontcss:path.join(__dirname,'src/font/iconfont.css')
		}
	},
	plugins:[
		ExtractCSS,
		new HtmlWebpackPlugin({
			filename:'index.html',
			template:path.join(__dirname,'src/index.html'),
			inject:true,
			// 需要依赖的模块
			chunks:['common','index'],
			//根据依赖自动排序
			chunksSortMode:'dependency'
		}),
		new HtmlWebpackPlugin({
			filename:'html/home.html',
			template:path.join(__dirname,'src/html/home.html'),
			inject:false
		}),
		new HtmlWebpackPlugin({
			filename:'html/news.html',
			template:path.join(__dirname,'src/html/news.ejs'),
			info:'三个打酱油',
			inject:true,
			chunks:['news']
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names:['common']
		}),
		//自动加载模块，当$被当作未赋值的变量时
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery',
			'window.jQuery':'jquery'
		}),
		//（删除重复依赖的文件）
    	new webpack.optimize.DedupePlugin(),
    	/**** 踩坑，在这里配postcss不行，在postcss-loader上面配
    	new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function(){
                    return [
                        require("autoprefixer")({
                            browsers: ['ie>=8','>1% in CN']
                        })
                    ]
                }
            }
        }),
        ******/
		//压缩
		/*****
		new webpack.optimize.UglifyJsPlugin({
			sourceMap:true,
			compress:{
				warnings:false
			}
		})
		********/
		//发布前清空发布目录
		/*****
		new CleanWebpackPlugin(['dist'], {
	        root: '', // An absolute path for the root  of webpack.config.js
	        verbose: true,// Write logs to console.
	        dry: false // Do not delete anything, good for testing.
	    }),
	    ****/
	    
	],
	devServer:{
		contentBase:__dirname+'/dist',
		//contentBase:__dirname+'/src',
	},
	watch:true,

}