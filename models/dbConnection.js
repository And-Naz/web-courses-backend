const path = require('path');
const fs = require('fs');

class DbConnection {
	static folderNameDbRoot = "db";
	static folderNameDbTables = "tables";
	static folderNameDbConfigs = "configs";
	static dbRoot = path.resolve(__dirname, DbConnection.folderNameDbRoot)
	static tablesRoot = path.resolve(__dirname, DbConnection.folderNameDbRoot, DbConnection.folderNameDbTables);
	static configsRoot = path.resolve(__dirname, DbConnection.folderNameDbRoot, DbConnection.folderNameDbConfigs);
	static readFileAsync = async (fileName, root) => {
		return await new Promise((res, rej) => {
			fs.readFile(path.resolve(__dirname, root, fileName), (err, data) => {
				if (err) {
					return rej(err);
				}
				res(data);
			});
		});
	};

	static writeFileAsync = async (fileName, data, root) => {
		return await new Promise((res, rej) => {
			fs.writeFile(
				path.resolve(__dirname, root, fileName),
				data,
				(err) => {
					if (err) {
						return rej(err);
					}
					res();
				}
			);
		});
	};

	static init() {
		try {
			if (!fs.existsSync(DbConnection.dbRoot)) {
				fs.mkdirSync(DbConnection.dbRoot);
			}
		} catch (err) {
			console.error(err);
			return;
		}

		try {
			if (!fs.existsSync(DbConnection.tablesRoot)) {
				fs.mkdirSync(DbConnection.tablesRoot);
			}
		} catch (err) {
			console.error(err);
		}

		try {
			if (!fs.existsSync(DbConnection.configsRoot)) {
				fs.mkdirSync(DbConnection.configsRoot);
			}
		} catch (err) {
			console.error(err);
		}

		return this;
	}
}

module.exports = DbConnection.init();