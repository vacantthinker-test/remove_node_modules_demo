const fs = require('fs')
const path = require("path")
const {execSync} = require('child_process')
// 导入package
// ----------------------------------

// 获取根路径 所有webprojects项目的根目录路径
let rootPath = path.dirname(__dirname)

// console.log(rootPath)

const noSearch = [
	'remove_node_modules_demo'
]

function syncDealWith() {
	fs.readdirSync(rootPath).forEach(itemProject => {
		let itemPath = path.join(rootPath, itemProject)
		// console.log(typeof itemProject)
		let stats = fs.lstatSync(itemPath);
		if (stats.isDirectory() === true) { // 当前路径是文件夹路径
			
			// 第一步：找出node_modules文件夹 删除它
			let filter = fs.readdirSync(itemPath).filter(function (n) {
				let boo = n === 'node_modules'
					|| n === '.git'
					|| n === '.next'
					|| n === '.cache'
					|| n === '.copy'
					|| n === '.nodejs'
				return boo;
			})
			if (filter.length) {
				filter.forEach(f => {
					let remove_path = path.join(itemPath, f)
					// console.log(remove_path)
					try {
						fs.rmSync(remove_path, {recursive: true})
						console.log(`${remove_path} 已被删除`)
					} catch (e) {
						console.log(e)
					}
				})
				
			}
			
			// 第二步：压缩当前路径文件夹
			let newPath = itemPath.replace(' ', '_')
			if (itemPath.indexOf(' ') !== -1) {
				fs.renameSync(itemPath, newPath)
			}
			let path_zip = `${newPath}.zip`
			let queueCommand = [
				(`7z a -tzip ${path_zip} ${newPath}`)
			]
			queueCommand.forEach(item => execSync(item))
			console.log(`${itemPath} 压缩完成`)
			
			// 第三步：删除当前路径文件夹
			fs.rmSync(itemPath, {recursive: true})
			
		}
	})
	console.log('')
	console.log(`所有 node_modules 处理完成`)
	console.log(`--------------end-----------------------`)
	
}

// 同步的方式读取根路径
syncDealWith();
console.log(`--------------end-----------------------`)

