const fs = require('fs');
const path = require('path')
const DbConnection = require('./dbConnection');
const OR = Symbol.for("Model.query.or");
class Model {
	static get fileName() { return null; }
	static get tableFileName() { return this.fileName + ".json"; }
	static get configFileName() { return this.fileName + ".config.json" ;}
	static get primaryKey() { return null; }
	static get uniqueFields() { return null; }
	static get allFields() { return null; }
	static get allowDateAt () { return true }

	static init() {
		const tableFile = path.resolve(DbConnection.tablesRoot, this.tableFileName);
		if(!fs.existsSync(tableFile)) {
			fs.writeFile(tableFile, JSON.stringify([]), function (err) { if (err) throw err; });
		}
		const configFile = path.resolve(DbConnection.configsRoot, this.configFileName);
		if(!fs.existsSync(configFile)) {
			fs.writeFile(configFile, JSON.stringify({ rowCount: 0 }), function (err) { if (err) throw err; });
		}
		return this;
	}

	static async findByPk(pk) {
		const readResult = await readRecordsFromTable(this.tableFileName)
		if (!readResult || readResult.length === 0) {
			return null;
		}
		return readResult.find(record => record[this.primaryKey] === pk) || null;
	}
	static async findOne({ where }) {
		if (typeof where !== 'object' || where === null) {
			return null;
		}
		const readResult = await readRecordsFromTable(this.tableFileName);
		if (!readResult || readResult.length === 0) {
			return null;
		}
		const callbacksArr = [];
		const { [OR]: conditionsOR, ...other } = where;
		if (Array.isArray(conditionsOR)) {
			conditionsOR.forEach(condition => {
				if (typeof condition !== 'object' || condition === null) { return; }
				const entries = Object.entries(condition)
				const innerCallbacksArr = [];
				entries.forEach(([key, value]) => {
					innerCallbacksArr.push(record => record[key] === value)
				})
				callbacksArr.push(record => innerCallbacksArr.some(cb => cb(record)))
			})
		}
		const otherEntries = Object.entries(other)
		if (otherEntries.length > 0) {
			const innerCallbacksArr = [];
			otherEntries.forEach(([key, value]) => {
				innerCallbacksArr.push(record => record[key] === value);
			});
			callbacksArr.push(record => innerCallbacksArr.every(cb => cb(record)));
		}
		return readResult.find(record => callbacksArr.every(cb => cb(record)));
	}
	static async update(data, { where }) {
		if (typeof where !== 'object' || where === null || typeof data !== 'object' || data === null) {
			return false;
		}
		const entries = Object.entries(where).filter(([key]) => this.uniqueFields.includes(key))
		if (entries.length === 0) {
			return false
		}
		const readResult = await readRecordsFromTable(this.tableFileName);
		if (!readResult || readResult.length === 0) {
			return false;
		}
		const callbacksArr = [];
		entries.forEach(([key, value]) => {
			callbacksArr.push(record => record[key] === value)
		})
		const updatedResult = readResult.map(record => {
			if (callbacksArr.every(cb => cb(record))) {
				return { ...record, ...data }
			}
			return record
		})
		return await writeRecordsFromTable(this.tableFileName, updatedResult);
	}
	static async destroy({ where }) {
		if (typeof where !== 'object' || where === null) {
			return false;
		}
		const entries = Object.entries(where).filter(([key]) => this.uniqueFields.includes(key))
		if (entries.length === 0) {
			return false
		}
		const readResult = await readRecordsFromTable(this.tableFileName);
		if (!readResult || readResult.length === 0) {
			return false;
		}
		const callbacksArr = [];
		entries.forEach(([key, value]) => {
			callbacksArr.push(record => record[key] === value)
		})
		const destroyResult = readResult.filter(record => !callbacksArr.every(cb => cb(record)))
		return await writeRecordsFromTable(this.tableFileName, destroyResult);
	}
	static async create(data) {
		if (typeof data !== 'object' || data === null) {
			return false;
		}
		const entries = Object.entries(data).filter(([key]) => this.uniqueFields.includes(key))
		if (entries.length === 0) {
			return false
		}
		// const readResult = await readRecordsFromTable(this.tableFileName);
		const conditionsOR = entries.reduce((acc, [key, value]) => (acc.push({ [key]: value }), acc), [])
		const findOne = await this.findOne({ where: { [OR]: conditionsOR } })
		if (findOne) {
			return false;
		}
		const config = await readRecordsFromConfig(this.configFileName)
		const newData = { ...data };
		if (!Object.prototype.hasOwnProperty.call(newData, this.primaryKey)) {
			newData[this.primaryKey] = config.rowCount + 1;
		}
		if (this.allowDateAt) {
			const now = (new Date()).toISOString();
			newData.createdAt = now;
			newData.updatedAt = now;
		}
		const result = await writeRecordsFromTable(this.tableFileName, newData)

		if (result) {
			config.rowCount++;
			await writeRecordsFromConfig(this.configFileName, config)
		}
	}
}

async function readRecordsFromTable(fileName) {
	try {
		const readBuffer = await DbConnection.readFileAsync(fileName, DbConnection.tablesRoot);
		const readJson = readBuffer.toString();
		return JSON.parse(readJson);
	} catch (error) {
		console.log(error)
		return null;
	}
}

async function writeRecordsFromTable(fileName, records) {
	try {
		await DbConnection.writeFileAsync(fileName, JSON.stringify(records), DbConnection.tablesRoot);
		return true
	} catch (error) {
		console.log(error)
		return false;
	}
}

async function readRecordsFromConfig(fileName) {
	try {
		const readBuffer = await DbConnection.readFileAsync(fileName, DbConnection.configsRoot);
		const readJson = readBuffer.toString();
		return JSON.parse(readJson);
	} catch (error) {
		console.log(error)
		return null;
	}
}

async function writeRecordsFromConfig(fileName, records) {
	try {
		await DbConnection.writeFileAsync(fileName, JSON.stringify(records), DbConnection.configsRoot);
		return true
	} catch (error) {
		console.log(error)
		return false;
	}
}

module.exports = Model;
module.exports.OR = OR;