'use strict'

const directoryConfig = require('config').get('providers').directory
const logger = require('@open-age/logger')('@open-age/directory-client')
const Client = require('node-rest-client-promise').Client
const client = new Client()

const headerHelper = require('../helpers/header-helper')

const validator = require('validator')

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
const getByKey = async (roleKey, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:roles:getByKey')

    let config = parsedConfig(context)
    let args = {
        headers: config.headers
    }

    args.headers['x-role-key'] = roleKey

    const url = `${config.url}/roles/my`
    log.debug(`getting role from ${url}`)

    let response = await client.getPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data
}

/**
 * gets role from providers.directory.url/roles
 * @param {*} id
 * @param {*} context
 */
const getById = async (id, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:roles:getById')

    let config = parsedConfig(context)
    let args = {
        headers: headerHelper.build(context)
    }

    const url = `${config.url}/roles/${id}`
    log.debug(`getting role from ${url}`)

    let response = await client.getPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data
}

/**
 * gets role from providers.directory.url/roles
 * @param {*} code
 * @param {*} context
 */
const getRoleByCode = async (code, context) => {
    let log = logger
    if (context && context.logger) {
        log = context.logger
    }
    log = log.start('directory-client:roles:getByCode')

    let config = parsedConfig(context)
    let args = {
        headers: headerHelper.build(context)
    }

    const url = `${config.url}/roles/${code}`
    log.debug(`getting role from ${url}`)

    let response = await client.getPromise(url, args)
    if (!response.data.isSuccess) {
        context.logger.error(response.data.message || response.data.error)
        throw new Error(response.data.message || response.data.error)
    }

    return response.data.data

    // return new Promise((resolve, reject) => {
    //     const url = `${config.url}/roles/${code}`
    //     log.debug(`getting role from ${url}`)
    //     return client.get(url, args, (data, response) => {
    //         log.end()
    //         if (!data || !data.isSuccess) {
    //             return reject(new Error())
    //         }

    //         return resolve(data.data)
    //     })
    // })
}

exports.get = async (query, context) => {
    if (typeof query === 'string') {
        if (validator.isMongoId(query)) {
            return getById(query, context)
        } else if (query.length === 36) {
            return getByKey(query, context)
        } else {
            return getRoleByCode(query, context)
        }
    } else if (query.id) {
        return getById(query.id, context)
    } else if (query.key) {
        return getByKey(query.key, context)
    } else if (query.code) {
        return getRoleByCode(query.code, context)
    }
}
