import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config.js';
import './db-dev';
import sessionStore from './app-session';
import subApp from './router';
import authenticationLayer from './api-authentication-layer';

const app = express(),
    DIST_DIR = __dirname,
    HTML_FILE = path.join(DIST_DIR, 'index.html'),
    APP_FILE = path.join(DIST_DIR, 'app.html'),
    GROUPS_VIEW_FILE = path.join(DIST_DIR, 'groups.html'),
    LOGIN_FILE = path.join(DIST_DIR, 'login.html'),
    NEW_LOGIN_FILE = path.join(DIST_DIR, 'new-login.html'),
    compiler = webpack(config),
    middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    });

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.json());// for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(sessionStore);
app.use(authenticationLayer);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
});

app.get("/app/", (req, res, next) => {
    console.log("trying to get file");
    compiler.outputFileSystem.readFile(APP_FILE, (err, result) => {
        if (err) {
            return next(err)
        } else if(!req.session.authenticated) {
            return res.status(403).send()
        }
        res.set('content-type', 'text/html')
        res.status(200).send(result)
        res.end()
    });
});

app.get("/app/groups/", (req, res, next) => {
    console.log("trying to get file");
    compiler.outputFileSystem.readFile(GROUPS_VIEW_FILE, (err, result) => {
        if (err) {
            return next(err)
        } else if(!req.session.authenticated) {
            return res.status(403).send()
        }
        res.set('content-type', 'text/html')
        res.status(200).send(result)
        res.end()
    });
});

app.get("/login/", (req, res, next) => {
    console.log("trying to get file");
    compiler.outputFileSystem.readFile(LOGIN_FILE, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html')
        res.status(200).send(result)
        res.end()
    });
});
app.get("/login/new", (req,res,next) => {
    compiler.outputFileSystem.readFile(NEW_LOGIN_FILE, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html')
        res.status(200).send(result)
        res.end()
    });
})

app.use(subApp);




