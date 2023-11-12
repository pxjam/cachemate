import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

const srcDir = 'content'
const destDir = 'public/min'
const assetsChecksumsFile = '.cachemate-sums.json'

const __dirname = path.resolve()

const assetsInfo = readAssetsInfoFromJson()
const cachedFiles = []

const srcDirPath = path.resolve(__dirname, srcDir)
const destDirPath = path.resolve(__dirname, destDir)

function calculateFileHash(filePath) {
	const data = fs.readFileSync(filePath)
	return crypto.createHash('md5').update(data).digest('hex')
}

function readAssetsInfoFromJson() {
	let assetsInfo = {}
	if (fs.existsSync(assetsChecksumsFile)) {
		const data = fs.readFileSync(assetsChecksumsFile, 'utf8')
		assetsInfo = JSON.parse(data)
	}
	return assetsInfo
}

function traverseDirectory(dir) {
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.join(dir, file)
		const relativePath = path.relative(srcDirPath, filePath)

		if (fs.existsSync(filePath)) {
			if (fs.statSync(filePath).isDirectory()) {
				traverseDirectory(filePath)
			} else {
				const publicFilePath = path.join(destDirPath, relativePath)

				if (fs.existsSync(publicFilePath)) {
					const fileHash = calculateFileHash(filePath)

					if (assetsInfo[relativePath] === fileHash) {
						cachedFiles.push(relativePath)
					}

					assetsInfo[relativePath] = fileHash
				}
			}
		}
	})
}

traverseDirectory(srcDirPath)

fs.writeFileSync(assetsChecksumsFile, JSON.stringify(assetsInfo, null, 2))

cachedFiles.forEach((file) => {
	console.log(file)
})
