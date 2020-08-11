import session from "express-session";
import redis from "redis";
const redisStore = require('connect-redis')(session);
const client = redis.createClient({ host: '192.168.0.101', port: 6379 });

const sessionStore = session({
    secret: '7k0pIFErPukR1nmn',
    // create new redis store.
    store: new redisStore({client: client}),
    saveUninitialized: false,
    resave: false
});

export default sessionStore;