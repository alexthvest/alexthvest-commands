# @alexthvest/commands

Commands system with roles and type converters

## Installation

`npm install @alexthvest/commands --save`

## Usage

``` js
    const { Executor } = require('@alexthvest/commands');

    const executor = new Executor({
        commands: [], // List of commands
        converters: [] // List of type converters
        defaultRole: null // Default role
    });

    // role - some Role
    // context - additional context for command
    executor.execute('some input string', role, context)
        .catch(console.error);
```

## API Documentation

* [Executor(options)](#Executor)
* [Command(options)](#Command)
* [Param](#Param)
* [Converter(type, handler)](#Converter)
* [Role(options)](#Role)

<a name="Executor"></a>
### Executor(options)

| Name | Type | Description |
| ---- | ---- | ----------- |
| commands | <code>Command[]</code> | List of commands |
| converters | <code>Converter[]</code> | List of converters |
| defaultRole | <code>Role</code> | Default role if execute method role is null |

<a name="Command"></a>
### Command(options)

| Name | Type | Description |
| ---- | ---- | ----------- |
| command | <code>String | RegExp</code> | Command |
| commands | <code>Command[]</code> | List of sub commands |
| params | <code>Object</code> | List of commands parameters |
| execute | <code>Function(object)</object> | Command action method |

<a name="Param"></a>
### Param

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | <code>Any<code> | Parameter type |
| isParams | <code>Boolean</code> | (like C# params) variable number of arguments |

<a name="Converter"></a>
### Converter(type, handler)

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | <code>Any</code> | Converter type |
| handler | <code>Function(string)</code> | Converter handler |

<a name="Role"></a>
### Role(options)

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | <code>String</code> | Role name |
| extend | <code>Role[]</code> | Parent roles |
| commands | <code>Command[]</code> | List of available commands |