
exports.roles = require('./api/roles')
exports.getRole = this.roles.get
exports.getRoleById = this.roles.get

exports.sessions = require('./api/sessions')
exports.getSessionById = this.sessions.get

exports.auth = require('./api/auth')
exports.organizations = require('./api/organizations')
exports.employees = require('./api/employees')
exports.students = require('./api/students')
exports.tenants = require('./api/tenants')
