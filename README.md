# @alexthvest/commands

Commands system for bots

## Installation

### Yarn
```
yarn add @alexthvest/commands
```

### NPM
```
npm i @alexthvest/commands
```

## Usage

Examples: https://github.com/AlexVest/alexthvest-commands/tree/master/examples

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
| options.access | Function(context): boolean or string | Command access checking method, returns boolean or error message |
| options.validate | Function(params, context): boolean or string | Parameters validation method |

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
| handler | Function(value, context): {error?: string, value?: any} | Converter handler |