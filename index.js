const express = require("express");
const cors = require("cors");

const userRoutes = require("./app/routes/user.routes.js");

const app = express();

require('dotenv').config();
const PORT = process.env.HTTP_PORT;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const User = db.users;
const predefinedUsers = require('./app/data-access/data.js');

User.sync({
    force: true
}).then(() => {
    console.log('table created');
})
    .then(() => {
        User.bulkCreate(predefinedUsers);
    })
    .catch(err => console.log(err));

app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server is up and running at http://localhost:${PORT}`));
