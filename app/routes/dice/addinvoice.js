// app/routes/dice/addinvoice.js

const debug = require("debug")("lncliweb:routes:dice");
const logger = require("winston");

module.exports = function (dice) {
	return function (req, res) {
		if (req.session.user) {
			dice.addInvoice(req.session.user, req.body.value).then(function (response) {
				res.json(response);
			}, function (err) {
				res.send(err);
			});
		} else {
			return res.sendStatus(403); // forbidden
		}
	};
};
