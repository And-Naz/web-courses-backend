const DbConnection = require('./dbConnection');
const OR = Symbol.for("Model.query.or");
const AND = Symbol.for("Model.query.and");

const getRecords = async (fileName) => {
	const readBuffer = await DbConnection.readFileAsync(fileName);
	const readJson = readBuffer.toString();
	return JSON.parse(readJson);
}

class Model {
	static get fileName() { return null; }
	static get primaryKey() { return null; }
	static get uniqueFields() { return null; }
	static get allFields() { return null; }

	static async findByPk(pk) {
		const readResult = await getRecords(this.fileName)
		if (!readResult || readResult.length === 0) {
			return null;
		}
		return readResult.find(record => record[this.primaryKey] === pk) || null;
	}

	static async findOne({ where }) {
		if (typeof where !== 'object' || where === null) {
			return null;
		}
		const readResult = await getRecords(this.fileName);
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
				callbacksArr.push(record => innerCallbacksArr.some(cb => cd(record)))
			})
		}
		const otherEntries = Object.entries(other)
		if (otherEntries.length > 0) {
			const innerCallbacksArr = [];
			otherEntries.forEach(([key, value]) => {
				innerCallbacksArr.push(
					record => {
						return record[key] === value;
					}
				)
			})
			callbacksArr.push(record => innerCallbacksArr.every(cb => cd(record)))
		}
		return readResult.find(record => callbacksArr.every(record))
	}

	static async update() {

	}
	static async destroy() { }
	static async create() { }
}

module.exports = Model;
module.exports.OR = OR;
module.exports.AND = AND;