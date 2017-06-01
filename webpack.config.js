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
				use:ExtractCSS.extract('css-loader')
			},
			{
				test:/\.(jpe?g|gif|png|svg)$/,
				loader:'file-loader?name=/images/[hash:8].[name].[ext]'
			}
		]
	},
	resolve:{
		alias:{
			jquery:path.join(__dirname,'libs/js/jquery.js'),
			indexcss:path.join(__dirname,'src/css/index.css'),
			homecss:path.join(__dirname,'src/css/home.css')
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
			chunks:['index']
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names:['common']
		}),
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery',
			'window.jQuery':'jquery'
		})
		//压缩
		/*****
		new webpack.optimize.UglifyJsPlugin({
			sourceMap:true,
			compress:{
				warnings:false
			}
		})
		********/
	],
	devServer:{
		contentBase:__dirname+'/dist',
		//contentBase:__dirname+'/src',
	}

}