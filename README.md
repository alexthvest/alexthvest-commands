# @alexthvest/commands

Commands system with type converters and access system

## Installation

`npm install @alexthvest/commands --save`

## Usage

``` js
    const { Command, Converter, Executor } = require('@alexthvest/commands');

    class User {
        constructor(name) {
            this.name = name;
        }
    }

    const userConverter = new Converter(User, value => new User(value));

    const create = new Command('create', {
        params: {
            name: {
                type: String,
                isParams: true
            }
        },
        execute: (params, context) => console.log(`New guild created: ${params.name.join(' ')}`)
    });

    const invite = new Command('invite', {
        params: {
            user: User
        },
        execute: (params, context) => console.log(`New user is invited to guild: ${params.user.name}`)
    });

    const remove = new Command('remove', {
        access: (params, context) => context.user.isCreator,
        execute: (params, context) => console.log(`Guild removed`)
    })

    const guild = new Command('guild', {
        commands: [create, invite, remove]
    })

    const executor = new Executor({
        commands: [guild],
        converters: [userConverter]
    });

    executor.execute('guild create My New Guild').catch(console.error);
    executor.execute('guild invite alexthvest').catch(console.error);
    executor.execute('guild remove', { user: { isCreator: true } }).catch(console.error);
```

## API Documentation

* [Executor(options)](#Executor)
* [Command(command, options)](#Command)
* [Param](#Param)
* [Converter(type, handler)](#Converter)

<a name="Executor"></a>
### Executor(options)

| Name | Type | Description |
| ---- | ---- | ----------- |
| options.commands | Command[] | List of commands |
| options.converters | Converter[] | List of converters |

<a name="Command"></a>
### Command(command, options)

| Name | Type | Description |
| ---- | ---- | ----------- |
| command | String | RegExp | Command |
| options.commands | Command[] | List of sub commands |
| options.params | Object&lt;String, Param&gt; | List of commands parameters |
| options.execute | Function(object, object) | Command action method |
| options.access | Function(object, object): boolean | Command access checking method |

<a name="Param"></a>
### Param

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | Any | Parameter type |
| isParams | Boolean | (like C# params) variable number of arguments |

<a name="Converter"></a>
### Converter(type, handler)

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | Any | Converter type |
| handler | Function(string) | Converter handler |