const api = require('../helpers/request-helper')('tenants')

exports.get = async (id, context) => {
    return api.get(id, null, context)
}
