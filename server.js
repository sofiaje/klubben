import express from "express";
import { MongoClient, ObjectId } from "mongodb";


const app = express();
const port = 3003;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const client = new MongoClient('mongodb://127.0.0.1:27017')
await client.connect()
const db = client.db('club')
const memberCollection = db.collection('members')

app.use(express.urlencoded({ extended: true }));


// --------------------------------- show members  -----------------------------


app.get('/', async (req, res) => {
    res.render('index')
})


app.get('/members', async (req, res) => {
    const sort = req.query.sort;

    let sortQuery = {}

    if (sort === "asc") {
        sortQuery = {name: 1}
    } else if (sort === "desc") {
        sortQuery = {name: -1}
    }

    const members = await memberCollection.find({}).sort(sortQuery).toArray()
    res.render('members', { members })
})


// --------------------------------- show one member  -------------------------


app.get('/member/:id', async (req, res) => {
    const member = await memberCollection.findOne({ _id: new ObjectId(req.params.id) });

    res.render('member', {
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        city: member.city,
        date: member.date.toLocaleDateString('sv-SE'),
        _id: member._id
    })
})


// --------------------------------- delete user  ---------------------------

app.post('/remove', async (req, res) => { 
    // console.log(req.body)
    await memberCollection.deleteOne({ _id: new ObjectId(req.body.userId) })
    res.redirect('/members')
})

// --------------------------------- become member  ---------------------------------

app.get('/form', async (req, res) => {
    res.render('form')
})



app.post('/form', async (req, res) => {
    // console.log(req.body)
    await memberCollection.insertOne({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        city: req.body.city,
        date: new Date(req.body.date)
    })
    res.redirect('/members')
})


// --------------------------------- update user info  ---------------------------

app.post('/update', async (req, res) => {
    // console.log(req.body)
    await memberCollection.updateOne({ _id: new ObjectId(req.body.userId) }, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            city: req.body.city,
        }
    })
    res.redirect('/members')
})


// --------------------------------- listen  ---------------------------------

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})