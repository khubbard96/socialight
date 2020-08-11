import express from 'express';

const app = express();

/*
 Logic to authenitcate an express-session. If authentication 
*/
const authenticateSession = function(session) {

    return true;
}

app.all("/api/*", (req, res, next) => {
    let authenticated = authenticateSession(req.session);
    if(authenticated) {
        next();
    } else {
        //send a 403 by default if authentication fails
        res.status(403).send();
    }
});

export default app;
