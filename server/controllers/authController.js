const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db');
        const {email, password} = req.body;

        //when working with SQL, when an object comes back from SQL, with an email, id, password property
        //so user will be an array with one object
        let [user] = await db.check_user(email);
        //[user] use user OR user use user[0]
        if(user){
            return res.status(400).send("Email already registered")
            //the return acts like a break statement
        }
        
        let sale = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt) //password comes from req.body
        let newUser = await db.register_user([email, hash]) 

        //if you use [newUser] then you don't need to do newUser[0].id, you can just do newUser.id
        req.session.user = {
            id: newUser[0].id,
            email: newUser[0].email //access first argument in the array
        }
        
        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const db = req.app.get('db');
        const {email, password} = req.body;

        let user = await db.check_user(email);
        if(!user[0]){ //if we haven't found a user 
            return res.status(400).send("Incorrect login") //Ambiguous message for security 
        } //we don't need an else, it can be free standing

        let authenticated = bcrypt.compareSync(password, user[0].user_password)

        if(!authenticated){
            return res.send(400).send("Incorrect login")
        }

        //req.session.user needs to have email and id
        //so deleting the user_password off of user is the same as creating the session with id and email
        delete user[0].user_password //if we pop off we can make it equal to the next
        req.session.user = user[0] //remove the thing you dont want and replace it 
        res.status(200).send(req.session.user)
    },

    logout: (req, res) => {
        req.session.destroy();
        req.sendStatus(200); //this will send OK
    },

    //user does not have to re-login just because their browser refreshed
    getUser: (req, res) => {
        if(req.session.user){
            res.status(200).send(req.session.user)
        }else{
            res.status(204).send('Please log in') //204 means no content
        }
    }

}