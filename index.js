'use strict'

const directoryConfig = require('config').get('providers.directory')
const logger = require('@open-age/logger')('open-age.directory-client')
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

const getRole = (roleKey, roleId) => {
    let log = logger.start('getMyRole')

    const key = roleKey || directoryConfig.tenantKey
    const id = roleId || 'my'

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': key
        }
    }

    const url = `${config.url}/api/roles/${id}`
    log.info(`getting role from ${url}`)

    return new Promise((resolve, reject) => {
        return client.get(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }
            return resolve(data.data)
        })
    })
}

const getRoleById = (id) => {
    logger.start('getRoleById')

    let config = parsedConfig()
    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': config.tenantKey
        }
    }

    return new Promise((resolve, reject) => {
        const url = `${config.url}/api/employees/${id}`

        return client.get(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                return reject(new Error())
            }

            return resolve(data.data)
        })
    })
}

exports.getRole = getRole
exports.getRoleById = getRoleById

exports.roles = {
    get: getRole
}
