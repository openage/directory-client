# directory-client

Client to interact with the user

## config

add following section to the `config/{env}.config` file

```JavaScript
"providers": {
    "directory": {
        // "url": "http://ems-api-dev.m-sas.com", // test url
        "url": "http://directory-api.mindfulsas.com", // prod url
        "tenantKey": null,
        "tenantCode": "aqua"
    }
}
```

## usage

Get a role by key

```JavaScript

const directory = require('@open-age/directory-client')

const roleKey = 'xxx....xxx' // role key of the user

// impersonates the user
const role = await directory.roles.get(roleKey)
```
