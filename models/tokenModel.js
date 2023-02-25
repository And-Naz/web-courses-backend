const DbConnection = require('./dbConnection')

class Token {
	static _connection = new DbConnection('token.json', Token);
	static get db() {
		return _connection;
	}
	static uniqueKeys = ["userId", "refreshToken"]
	constructor({ userId, refreshToken }) {
		if (!userId) {
			throw new Error("User Id is required.")
		}
		if (!refreshToken) {
			throw new Error("RefreshToken is required.")
		}
		this.userId = userId;
		this.refreshToken = refreshToken;
	}
}

module.exports = Token;