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
    execute: (params, context) => console.log(`New guild created: ${params.name.join(' ')}`);
});

const invite = new Command('invite', {
    params: {
        user: User
    },
    execute: (params, context) => console.log(`New user is invited to guild: ${params.user.name}`);
});

const remove = new Command('remove', {
    access: (params, context) => context.user.isCreator,
    execute: (params, context) => console.log(`Guild removed`)
})

const guild = new Command('guild', {
    commands: [create, invite]
})

const executor = new Executor({
    commands: [guild],
    converters: [userConverter]
});

executor.execute('guild create My New Guild').catch(console.error);
executor.execute('guild invite alexthvest').catch(console.error);
executor.execute('guild remove', { user: { isCreator: true } }).catch(console.error);