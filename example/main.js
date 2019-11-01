const { Command, Converter, Executor } = require('../lib');

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