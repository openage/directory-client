'use strict'

const directoryConfig = require('config').get('providers').directory
const logger = require('@open-age/logger')('@open-age/directory-client')
const Client = require('node-rest-client-promise').Client
const client = new Client()

let parsedConfig = (config) => {
    config = config || {}

    return {
        url: config.url || directoryConfig.url,
        tenantKey: config.api_key || directoryConfig.api_key,
        lastSyncDate: config.lastSyncDate
    }
}

const injectHeader = (headers, context) => {
    if (!context) {
        return
    }

    if (context.session) {
        headers['x-session-id'] = context.session.id
    }

    if (context.id) {
        headers['x-context-id'] = context.id
    }

    if (context.role) {
        headers['x-role-key'] = context.role.key
    } else if (context.user && context.user.role) {
        headers['x-role-key'] = context.user.role.key
    }

    if (context.organization) {
        headers['x-organization-code'] = context.organization.code
    }

    if (context.tenant) {
        headers['x-tenant-code'] = context.tenant.code
    }
}

/**
 *
 * @param {*} roleKey
 * @param {*} context
 */
const getRole = (roleKey, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:getMyRole')

    const key = roleKey || directoryConfig.key
    const id = 'my'

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': key
        }
    }

    injectHeader(args.headers, context)

    const url = `${config.url}/roles/${id}`
    log.debug(`getting role from ${url}`)

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            log.end()
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }
            return resolve(data.data)
        })
    })
}

/**
 * gets role from providers.directory.url/roles
 * @param {*} id
 * @param {*} context
 */
const getRoleById = (id, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:getRoleById')

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': config.tenantKey
        }
    }

    injectHeader(args.headers, context)

    return new Promise((resolve, reject) => {
        const url = `${config.url}/roles/${id}`

        return client.get(url, args, (data, response) => {
            log.end()
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }

            return resolve(data.data)
        })
    })
}

/**
 * gets role from providers.directory.url/sessions
 * @param {*} id
 * @param {*} context
 */
const getSessionById = (id, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:getSessionById')

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': config.tenantKey
        }
    }

    injectHeader(args.headers, context)

    return new Promise((resolve, reject) => {
        const url = `${config.url}/sessions/${id}`

        return client.get(url, args, (data, response) => {
            log.end()
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }

            return resolve(data.data)
        })
    })
}

exports.getRole = getRole
exports.getRoleById = getRoleById
exports.getSessionById = getSessionById

exports.roles = {
    get: getRole
}

exports.sessions = {
    get: getSessionById
}
