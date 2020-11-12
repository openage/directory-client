const authApi = require('../helpers/request-helper')('users')

exports.signIn = async (email, code, mobile, password, context) => {
    return authApi.post({
        email: email,
        code: code,
        mobile: mobile,
        password: password
    }, {
        path: 'signIn'
    }, context)
}
