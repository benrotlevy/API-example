const express = require("express");
const Joi = require("joi");
const {
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser,
} = require("../db");

const usersRoute = express.Router();

usersRoute.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send();
    }
});

function handleWrongId(req, res, next) {
    const idSchema = Joi.number().min(1);
    const { error } = idSchema.validate(req.params.id);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

usersRoute.get("/:id", handleWrongId, async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (user) {
            res.json(user);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
});

function handleBodyValidation(req, res, next) {
    const userSchema = Joi.object({
        name: Joi.string().min(2),
        age: Joi.number().min(1),
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

usersRoute.post("/", handleBodyValidation, async (req, res) => {
    try {
        const user = await createUser(req.body);
        if (user) {
            res.status(201).json(user);
            return;
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send();
    }
});

usersRoute.put(
    "/:id",
    handleWrongId,
    handleBodyValidation,
    async (req, res) => {
        try {
            const user = await editUser(req.params.id, req.body);
            if (user) {
                res.json(user);
                return;
            }
            res.status(404).send();
        } catch (error) {
            res.status(500).send();
        }
    }
);

usersRoute.delete("/:id", handleWrongId, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        if (user) {
            res.json(user);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
});
module.exports = usersRoute;
