import express from 'express';
const app = express();
import User from "./user";

import Datastore from 'nedb';
var db = {
    messages: new Datastore({filename: "db/messages.db", autoload: true}),
}

app.post("/login/",(req,res,next) => {
    console.log(req.body);
    req.session.authenticated = true;
    res.status(200).send();
});
/*
 * New user information verfication. 
 */
app.post("/login/new",(req,res,next) => {
    const MIN_PASS_LENTH = 8, MAX_PASS_LENGTH = 64;
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phoneNumber;
    let pass = req.body.password;
    let passConfirm = req.body.passwordConfirm;

    let newUser = new User({
        name: name,
        countryCode: "US",
        phone: phone,
        email: email,
        hashedPassword: User.getHashedPassword(pass, passConfirm),
    });

    newUser.save(function(err) {
        if(err) {
            if(err.errors) {
                let errMsg = Object.values(err.errors)[0]
            }
            console.log(err);
            res.status(400).send();
        } else {
            res.status(200).send();
        }
    })
});
app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('login');
    });

});



/** messages **/
app.get("/groups/:groupid/messages/",(req, res)=> {
    console.log("trying to get messageS");
    db.messages.find({}, function(err, docs) {
        if(!err) {
            res.send({
                "total":1,
                "page":1,
                "perPage":10,
                "messages":docs
            });
        } else {
            console.log("Error: " + err);
        }
    });
});

app.post("/groups/:groupid/messages/",(req,res) => {
    db.messages.insert(req.body, function(err, newDocs) {
        if(!err) {
            res._id = newDocs._id;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(newDocs));
            res.end();
        } else {
            console.log(err);
        }

    });
});

app.get("/groups/:groupid/messages/:messageid",(req, res) => {
    db.messages.find({}, function(err, docs) {
        res.send({
            "message":docs
        });
    })
});

/** groups **/
app.get("/groups/", (req,res) => {
    db.groups.find({}, function(err, docs){
        if(!err) {
            res.send({
                "total":docs.length,
                "groups":docs
            });
        } else {
            console.log("Error: " + err);
        }
    });
});

app.get("/groups/:groupid", (req,res) => {
    db.groups.find({}, function(err, docs) {
        if(!err) {
            res.send({
                "group":docs,
            });
        } else {
            console.log("Error: " + err);
        }
    });
});

app.post("/groups/", (req, res) => {
    db.groups.insert(req.body, function(err, newDocs) {
        res._id = newDocs._id;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(newDocs));
        res.end();
    });
});

app.put("/groups/:groupid", (req,res) => {
    db.groups.update({}, req.body, {}, function(err, num) {
        if(err) {
            console.log(err);
        }
    });
});

app.delete("/groups/:groupid", (req,res) => {
    db.groups.remove({},{}, function(err, num) {
        if(err) console.log(err);
    })
})




export default app;

