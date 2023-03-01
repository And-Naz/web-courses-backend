const Model = require('./model')

class Token extends Model {
	static get fileName() { return "token.json"; }
	static get primaryKey() { return "id"; }
	static get uniqueFields() { return ["id", "userId", "refreshToken"]; }
	static get allFields() { return ["id", "userId", "refreshToken"]; }

	constructor({ id, userId, refreshToken }) {
		super()
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

module.exports = Token;

// const DbConnection = require('./dbConnection')

// class Token {
// 	static _connection = new DbConnection('token.json', Token);
// 	static get db() {
// 		return _connection;
// 	}
// 	static uniqueKeys = ["userId", "refreshToken"]
// 	constructor({ userId, refreshToken }) {
// 		if (!userId) {
// 			throw new Error("User Id is required.")
// 		}
// 		if (!refreshToken) {
// 			throw new Error("RefreshToken is required.")
// 		}
// 		this.userId = userId;
// 		this.refreshToken = refreshToken;
// 	}
// }

// module.exports = Token;