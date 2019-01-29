const express = require(`express`);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');

const register =require('./controllers/register');
const signin =require('./controllers/signin');

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'sanguliupo',
    password : '',
    database : 'smart-brain'
  }
});



const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'banana',
			entries: 0,
			joined: new Date()
		}
	]
};

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res)=>{signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res)=>{register.handleRegister(req, res, db, bcrypt)});	

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
	.then(user=>{
		if(user.length){
			res.json(user[0]);
		}else{
			res.status(400).json('Not found')
		}
	})
	.catch (err=>res.status(400).json('error getting user'))
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	  .increment('entries', 1)
	  .returning('entries')
	  .then(entries=>{
	  	res.json(entries[0]);
	  })
	  .catch(err=>res.status(400).json('unable to get enrtries'))
  })


// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
	console.log(`app is running on port 3000`);
});

/*
/-->res=this is working
/signin-->POST = success/fail
/register -->POST = user
/profile/:userId -->GET =user
/image --> PUT -->user



*/
