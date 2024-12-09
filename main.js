const nf = require('node-fetch')
const http = require('http')
const https = require('https')
const fs = require('fs')

const filename = ".\\assets.txt"
const imagesFolder = ".\\images\\"
const url_asset = "https://assetdelivery.roblox.com/v1/asset?id="
const IEND = [0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130];

function createRbxImage(id, callback) {
	function wrapper(url, toExec) {
		https.get(url, (r) => {
			if (r.statusCode == 302) {
				wrapper(r.headers.location, toExec)
			} else {
				toExec(r)
			}
		})
	}

	let NAME = imagesFolder+id+'.png'
	if (!fs.existsSync(NAME)) {
		let file = fs.createWriteStream(NAME)
		wrapper(url_asset+id, (r) => {
			let bool1,bool2
			function finish() {
				if (bool1 && bool2) {
					file.close()
					console.log("Downloaded missing asset: "+id)
					callback(true)
				}
			}
			file.on('finish', () => {
				bool1 = true
				finish()
			})
			r.on('close', () => {
				bool2 = true
				finish()
			})
			r.pipe(file)

			let data = ""
			r.on('error', console.error)
			r.on('close', () => {console.log(id+": close")})
			r.on('data', (chunk) => {
				data += chunk
				//console.log(id+": "+data.length+" +("+chunk.length+")")
			})
			r.on('close', () => {
				//console.log(data && data.slice(-IEND.length))
				let corrupted = !data
				if (!corrupted && false) {
					for (let n=0; n<IEND.length; n++) {
						let di = data.length - (IEND.length - n)
						if (data[di] != IEND[n]) {
							corrupted = true
							break
						}
					}
				}

				/*if (!corrupted) {
					file.on("finish", () => {
						file.close()
						console.log("Downloaded missing asset: "+id)
						callback()
					})
					file.write(new Buffer.from(data))
				} else {
					console.log("Failed to download: "+id)
					callback()
				}*/
			})
		})
	} else callback(false)
}

function generateHTML(callback) {
	content = ""
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) throw err;
		console.log('OK: ' + filename);
		
		let lines = data.split("\n")
		let newcontent = ""
		let got = 0
		let found = []

		for (let i=0; i<lines.length; i++) {
			let v = lines[i]
			let httpmatch = v.match('^https?://')
			let idmatch = v.match('id=(\\d+)')
			let rbxmatch = v.match('^rbxassetid://(\\d+)')
			let ultra = (httpmatch && idmatch) || rbxmatch
			let id
			if (ultra) {
				id = ultra[0].match("(\\d+)")[0]
				let isAlreadyAdded = false
				for (let i2=0; i2<found.length; i2++) {
					if (id == found[i2]) {
						isAlreadyAdded = true
						console.log(`[-] ` + v)
						break
					}
				}
				
				if (!isAlreadyAdded) {
					//createRbxImage(id, () => {})
					content += `<div class="grid-item"><img src="${v}" style="object-fit: contain; width:96px; height:96px"><br><b style="color:#fff">${id}</b></div>`
					got++
					found[found.length] = id
					newcontent += (i>0 && '\n' || '') + v
					console.log(`[O] ` + v)
				}
			} else {
				console.log(`[ ] ` + v)
			}
		}

		function downloadFunction(i) {
			if (found[i]) {
				createRbxImage(found[i], () => downloadFunction(i+1))
			}
		}
		downloadFunction(0)
		
		console.log(`Received ${got}/${lines.length} links.`)
		if (got < lines.length) {
			fs.writeFile(filename, newcontent, () => {})
			console.log(`Trimmed useless/duplicates from ${filename}.`)
		}

		callback(content)
	});
}

http.createServer((req, res) => {
	try {
		res.statusCode = 200
		console.log(req.headers['user-agent'])
		generateHTML(content => {
			res.end(`<html style="background-color:#777">
	<style>
		.grid-container {
			display: grid;
			grid-template-columns: repeat(auto-fill, 96px);
			gap: 12px;
			padding: 6px;
		}
		.grid-item {
			padding: 4px;
			font-size: 14px;
			text-align: center;
			margin-top: 12px;
			margin-left: auto;
			margin-right: auto;
		}
	</style>
	<body class="grid-container">
		${content}
	</body>
</html>`)
		})
		console.log(req.url)
	} catch(e) {
		console.warn(e)
		res.statusCode = 500
		res.end()
	}
}).listen(9020)