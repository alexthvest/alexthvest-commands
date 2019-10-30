const { Command, Converter, Role, Executor } = require('@alexthvest/commands');

class User {
    constructor(name) {
        this.name = name;
    }
}

const userConverter = new Converter(User, value => new User(value));

const create = new Command({
    command: 'create',
    params: {
        name: {
            type: String,
            isParams: true
        }
    },
    execute: (ctx) => {
        const { name } = ctx.params;
        console.log(`New guild created: ${name.join(' ')}`);
    }
});

const invite = new Command({
    command: 'invite',
    params: {
        user: User
    },
    execute: (ctx) => {
        const { user } = ctx.params;
        console.log(`New user is invited to guild: ${user.name}`);
    }
});

const guild = new Command({
    command: 'guild',
    commands: [create, invite]
})

const userRole = new Role({
    name: 'user',
    commands: [guild]
});

const adminRole = new Role({
    name: 'admin',
    extend: [userRole],
    commands: []
});

const executor = new Executor({
    defaultRole: userRole,
    commands: [guild],
    converters: [userConverter]
});

executor.execute('guild create My New Guild').catch(console.error);
executor.execute('guild invite alexthvest').catch(console.error);