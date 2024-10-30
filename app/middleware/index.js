const authJwt = require("./auth");
const verifySignUp = require("./verifySignUp");

module.exports = {
    verifyToken: authJwt,
    checkDuplicateEmail: verifySignUp.checkDuplicateEmail
};
