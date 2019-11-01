# @alexthvest/commands

Commands system with type converters and access system

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

Example: https://github.com/AlexVest/alexthvest-commands/tree/master/example

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