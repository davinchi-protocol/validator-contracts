const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
var bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 5000 }));

const DB = ""
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("connecttion done"))
    .catch((err) => console.log("no onnection" + err));

const schema = new mongoose.Schema({
    userAddress: String,
    FName: String,
    LName: String,
    Email: String,
    password: String,
    Country: String,
    Phone: String,
    Ref_address: String,
    verified: String,
    Image: String,

    date: {
        type: Date,
        default: Date.now
    }



});


const collection = new mongoose.model("user", schema);



const InsertData = async () => {
    const data = new collection({
        userAddress: "123",
        FName: "Davinci",
        LName: "Test",
        Email: "admin@davinci.bz",
        password: "123",
        Country: "USA",
        Phone: "03234354339",
        Ref_address: "123"

    })
    await data.save();
}


app.get("/getdatabyaddress", async (req, res) => {

    try {
        const result = await collection.find({ userAddress: req.query.userAddress });
        if (result.length > 0) {
            const data = {
                'status': 409,
                'data': result[0]._doc.userAddress,
            }
            res.status(200).send(JSON.stringify(data));
        } else {
            const data = {
                'status': 400,
                'message': "Address does not exist"
            }
            res.status(200).send(JSON.stringify(data));
        }
    }
    catch (e) { }


})



app.post("/register", async (req, res) => {

    try {
        const data = new collection({
            userAddress: req.body.userAddress,
            FName: req.body.FName,
            LName: req.body.LName,
            Email: req.body.Email,
            password: req.body.password,
            Country: req.body.Country,
            Phone: req.body.Phone,
            Ref_address: req.body.Ref_address,
            verified: req.body.verified,
            Image: req.body.Image,

        })
        const result = await data.save();


        res.send("User is Registerd");
    }
    catch (e) { }


})


app.post("/login", async (req, res) => {
    try {
        const result = await collection.find({ Email: req.body.email });
        if (result.length > 0) {
            if (result[0].password == req.body.password) {
                const { password, ...userData } = result[0]._doc;
                const data = {
                    'status': 200,
                    'data': userData
                }
                res.status(200).send(JSON.stringify(data));
            } else {
                const data = {
                    'status': 400,
                    'message': "Password is incorrect"
                }
                res.status(400).send(JSON.stringify(data));
            }
        } else {
            const data = {
                'status': 400,
                'message': "User does not exist"
            }
            res.status(400).send(JSON.stringify(data));
        }

    }
    catch (e) {
    }
})

app.get("/getdatabymail", async (req, res) => {
    try {
        const result = await collection.find({ Email: req.query.Email });
        if (result.length > 0) {
            const data = {
                'status': 200,
                'data': result[0]._doc.email,
            }
            res.status(200).send(JSON.stringify(data));
        } else {
            const data = {
                'status': 400,
                'message': "User does not exist"
            }
            res.status(200).send(JSON.stringify(data));
        }
    }
    catch (e) {
        res.send("error")
    }
})

app.get("/get", async (req, res) => {
    try {
        const result = await collection.find({ userAddress: req.query.userAddress });
        res.send(result);
    }
    catch (e) {

    }


})

app.listen(port, () => {
    console.log("connection is live" + port);
});







