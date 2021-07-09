const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require('uuid');

const { authSchema, updateSchema } = require("../helpers/validationSchema");



const getUsers = (req, res) => {
    User.findAll({
        where: {
            isDeleted: false
        }
    })
        .then((user) => res.send(user))
        .catch((err) => console.log(err));
};

const createUser = async (req, res) => {
    const user = req.body;
    const { error } = authSchema.validate(user);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        const userWithId = { id: uuidv4(), ...user, isDeleted: false };

        User.create(userWithId)
            .then((user) => {
                res.send(`User : ${user.login} added successfully`)
            })
            .catch((err) => console.log(err));
    }
};

const getUserById = (req, res) => {
    const { id } = req.params;

    User.findOne({ where: { id: id, isDeleted: false } })
        .then((userWithId) => {
            if (userWithId) {
                res.send(userWithId);
            }
            else {
                res.send(`User with id : ${id} not found`);
            }
        })
        .catch(err => res.send(err));
};

const deleteUser = (req, res) => {
    const { id } = req.params;

    User.update({ isDeleted: true }, { where: { id: id } })
        .then(updatedUserData => {
            if (updatedUserData == 1) {
                res.send(`User with id : ${id} deleted successfully`);
            }
            else res.send(`User with id : ${id} Not found`);
        })
        .catch(err => console.log(err));
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const { error } = updateSchema.validate(updatedData);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {

        User.update(updatedData, { where: { id: id } })
            .then(updatedUserData => {
                if (updatedUserData == 1) {
                    res.send(`User with id : ${id} Updated successfully`);
                }
                else res.send(`User with id : ${id} Not found`);
            })
            .catch(err => console.log(err));

    }

};

const getAutoSuggestUsers = (req, res) => {
    const { loginSubString, limit } = req.params;

    User.findAll({
        where: {
            login: {
                [Op.like]: `%${loginSubString}%`
            },

        },
        limit: limit
    })
        .then((user) => res.send(user))
        .catch((err) => console.log(err));
};

module.exports = {
    getUsers,
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    getAutoSuggestUsers
};
