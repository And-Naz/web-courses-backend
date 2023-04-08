const DbConnection = require('./dbConnection');
const OR = Symbol.for("Model.query.or");

const readRecords = async (fileName) => {
	try {
		const readBuffer = await DbConnection.readFileAsync(fileName);
		const readJson = readBuffer.toString();
		return JSON.parse(readJson);
	} catch (error) {
		console.log(error)
		return null;
	}
}

const writeRecords = async (fileName, records) => {
	try {
		await DbConnection.writeFileAsync(fileName, JSON.stringify(records));
		return true
	} catch (error) {
		console.log(error)
		return false;
	}
}

class Model {
	static get fileName() { return null; }
	static get primaryKey() { return null; }
	static get uniqueFields() { return null; }
	static get allFields() { return null; }

	static async findByPk(pk) {
		const readResult = await readRecords(this.fileName)
		if (!readResult || readResult.length === 0) {
			return null;
		}
		return readResult.find(record => record[this.primaryKey] === pk) || null;
	}
	static async findOne({ where }) {
		if (typeof where !== 'object' || where === null) {
			return null;
		}
		const readResult = await readRecords(this.fileName);
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
					innerCallbacksArr.push(
						record => {
							return record[key] === value;
						}
					)
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
		const readResult = await readRecords(this.fileName);
		if (!readResult || readResult.length === 0) {
			return false;
		}
		const callbacksArr = [];
		entries.forEach(([key, value]) => {
			callbacksArr.push(
				record => {
					return record[key] === value;
				}
			)
		})
		const updatedResult = readResult.map(record => {
			if (callbacksArr.every(cb => cb(record))) {
				return { ...record, ...data }
			}
			return record
		})
		return await writeRecords(this.fileName, updatedResult);
	}
	static async destroy({ where }) {
		if (typeof where !== 'object' || where === null) {
			return false;
		}
		const entries = Object.entries(where).filter(([key]) => this.uniqueFields.includes(key))
		if (entries.length === 0) {
			return false
		}
		const readResult = await readRecords(this.fileName);
		if (!readResult || readResult.length === 0) {
			return false;
		}
		const callbacksArr = [];
		entries.forEach(([key, value]) => {
			callbacksArr.push(
				record => {
					return record[key] === value;
				}
			)
		})
		const destroyResult = readResult.filter(record => !callbacksArr.every(cb => cb(record)))
		return await writeRecords(this.fileName, destroyResult);
	}
	static async create() { }
}

module.exports = Model;
module.exports.OR = OR;