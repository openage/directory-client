const authApi = require('../helpers/request-helper')('users')

exports.signIn = async (model, context) => {
    return authApi.post(model, {
        path: 'signIn'
    }, context)
}
