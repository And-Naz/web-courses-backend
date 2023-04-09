const Model = require('./model')

class Token extends Model {
	static get fileName() { return "token"; }
	static get primaryKey() { return "id"; }
	static get uniqueFields() { return ["id", "userId", "refreshToken"]; }
	static get allFields() { return ["id", "userId", "refreshToken"]; }
	get model() { return Token; }
	constructor({ id, userId, refreshToken }) {
		super();
		if (!id) {
			throw new Error("Id is required.")
		}
		if (!userId) {
			throw new Error("User Id is required.")
		}
		if (!refreshToken) {
			throw new Error("RefreshToken is required.")
		}
		this.id = id;
		this.userId = userId;
		this.refreshToken = refreshToken;
	}
}

module.exports = Token.init();