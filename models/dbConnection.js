const path = require('path');
const fs = require('fs');

class DbConnection {
	static readFileAsync = async (fileName) => {
		return await new Promise((res, rej) => {
			fs.readFile(path.resolve(__dirname, "jsonDB", fileName), (err, data) => {
				if (err) {
					return rej(err);
				}
				res(data);
			});
		});
	};

	static writeFileAsync = async (fileName, data) => {
		return await new Promise((res, rej) => {
			fs.writeFile(path.resolve(__dirname, "jsonDB", fileName), data, (err) => {
				if (err) {
					return rej(err);
				}
				res();
			});
		});
	};
	fileName;
	filePath;

	constructor(fileName, modelClass) {
		this.fileName = fileName;
		this.filePath = path.resolve(__dirname, "jsonDB", fileName);
		this.modelClass = modelClass;
		if (!fs.existsSync(this.filePath)) {
			throw new Error(`${this.fileName} doesn't exist.`);
		}
	}

	async create(model) {
		try {
			const data = await this.read();
			data.push(model);
			const retVal = await DbConnection.writeFileAsync(this.filePath, JSON.stringify(data));
			if (retVal) {
				throw retVal;
			}
			return true
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async read(query = {}) {
		try {
			const readBuffer = await DbConnection.readFileAsync(this.filePath);
			const readJson = readBuffer.toString();
			const readResult = JSON.parse(readJson);
			const objKeys = Object.key(query);
			const keys = this.modelClass.uniqueKeys.length > 0 ? [...this.modelClass.uniqueKeys, ...objKeys] : objKeys
			const selectionFunctions = keys.map(key => ((model) => model[key] === query[key]))
			const retVal = readResult.filter(model => selectionFunctions.every(fn => fn(model)));
			return retVal.map(data => new this.modelClass(data));
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async update(updatedModel) {
		try {
			const data = await this.read();

			const updatedData = data.map(model => {
				if (model.id === updatedModel.id) {
					return { ...model, ...updatedModel };
				}
				return model
			});
			const retVal = await DbConnection.writeFileAsync(this.filePath, JSON.stringify(updatedData));
			if (retVal) {
				throw retVal;
			}
			return true
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async delete(query = {}) {
		try {
			const readBuffer = await DbConnection.readFileAsync(this.filePath);
			const readJson = readBuffer.toString();
			const readResult = JSON.parse(readJson);
			const selectionFunctions = Object.keys(query).map(key => ((model) => model[key] === query[key]))
			const newData = readResult.filter(model => !selectionFunctions.every(fn => fn(model)));
			const retVal = await DbConnection.writeFileAsync(this.filePath, JSON.stringify(newData));
			if (retVal) {
				throw retVal;
			}
			return true
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}

module.exports = DbConnection;