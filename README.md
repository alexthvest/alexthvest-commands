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

    const userConverter = new Converter(User, (value, context) => new User(value));

    const create = new Command('create', {
        aliases: ['создать'],
        params: {
            name: {
                type: String,
                isParams: true,
                validate: (value, context) => {
                    const name = value.join(' ');
                    console.log(name);
                    return (name.length >= 6 && name.length <= 15) || 'Guild name length must be >= 6 and <= 15';
                }
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
        access: (params, context) => context.user.isCreator || 'You are not a creator of this guild',
        execute: (params, context) => console.log(`Guild removed`)
    })

    const guild = new Command('guild', {
        commands: [create, invite, remove]
    })

    const executor = new Executor({
        commands: [guild],
        converters: [userConverter]
    });

    executor.execute('guild создать My New Guild').catch(console.error);
    executor.execute('guild invite alexthvest').catch(console.error);
    executor.execute('guild remove', { user: { isCreator: false } }).catch(console.error);
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
| options.execute | Function(params, context) | Command action method |
| options.access | Function(params, context): boolean or string | Command access checking method, returns boolean or error message |

<a name="Param"></a>
### Param

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | Any | Parameter type |
| isParams | Boolean | (like C# params) variable number of arguments |
| validate | Function(value, context): boolean or string | Parameter validate function, returns boolean or error message |

<a name="Converter"></a>
### Converter(type, handler)

| Name | Type | Description |
| ---- | ---- | ----------- |
| type | Any | Converter type |
| handler | Function(value, context) | Converter handler |