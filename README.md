# AngularJS, Express, MySQL App Scaffolding

Provides configurations and template files for the [yo app-generator](https://github.com/paulius005/generator-app-generator)

Based on [Patrick Hulce's app-scaffolding](https://github.com/patrickhulce/app-scaffolding) with the addition persistent cookie authentication using the [passport-remember-me](https://github.com/jaredhanson/passport-remember-me) middleware, [sequelize-cli](https://github.com/sequelize/cli) integration, and functioning endpoints for user `login`, `register`, `logout`, and `profile`

The `bcrypt` dependency requires a Node.js version of `0.11.x` or greater.

# Instructions For Use

Install [grunt-cli](https://github.com/gruntjs/grunt-cli)
```
npm install -g grunt-cli
```

Install [sequelize-cli](https://github.com/sequelize/cli). Checkout the `.sequelizerc` file for the locations of the `config`, `migrations`, `models`, and `seeders` after running the `app-generator`
```
npm install -g sequelize-cli
```


Go to your new project directory, and run:

```
yo app-generator [PATH TO]/express-webapp.yaml
```

Open `server/db/config/config.json` and change the database name to whatever you would like your database to be named. Add other configuration settings such as `production` here as well. 

Create your database in MySQL. `db.sequelize.sync();` inside of `server/server.js` will create your `users`, and `tokens` tables.

Inside the root directory of the project run:

`grunt bower`, `grunt build`

Run the server by running: `grunt`

If you would like to turn on debugging, inside of `Gruntfile.js` add `'nodeArgs': ['--debug'],` under `options`
