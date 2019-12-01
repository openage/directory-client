'use strict'

const directoryConfig = require('config').get('providers').directory
const logger = require('@open-age/logger')('@open-age/directory-client')
const Client = require('node-rest-client-promise').Client
const client = new Client()

let parsedConfig = (context) => {
    let config = {
        headers: {
            'Content-Type': 'application/json'
        },
        url: directoryConfig.url,
        role: {
            key: directoryConfig.api_key
        }
    }

    context = context || {}

    let tenant = context.tenant

    if (tenant) {
        config.headers['x-tenant-code'] = context.tenant.code

        let services = tenant.services = []

        let directoryService = services.find(s => s.code === 'directory')

        if (directoryService) {
            config.url = directoryService.url
            config.lastSyncDate = directoryService.lastSyncDate
        }

        let owner = tenant.owner
        if (owner) {
            config.role = owner.role
        }
    }

    if (context.session) {
        config.headers['x-session-id'] = context.session.id
    }

    if (context.id) {
        config.headers['x-context-id'] = context.id
    }

    let role = context.role

    if (!role && context.user && context.user.role) {
        role = context.user.role
    }

    if (!role) {
        role = config.role
    }

    if (role) {
        config.headers['x-role-key'] = role.key
    }

    if (context.organization) {
        config.headers['x-organization-code'] = context.organization.code
    }

    return config
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

    let config = parsedConfig(context)
    let args = {
        headers: config.headers
    }

    args.headers['x-role-key'] = roleKey

    const url = `${config.url}/roles/my`
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

    let config = parsedConfig(context)
    let args = {
        headers: config.headers
    }

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

    let config = parsedConfig(context)
    let args = {
        headers: config.headers
    }

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
