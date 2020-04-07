"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// @ts-nocheck
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../auth");
/**
 *  [X] C - Create   [POST]      [201, 401]\
 *  [X] R - Read     [GET]       [200, 401]\
 *  [X] U - Update   [PATCH]     [200, 406]\
 *  [X] D - Delete   [DELETE]    [200, 410]
 */
exports.UserRouter = express_1.Router();
/**
 *  User retrival.
 *  GET: /:id - /apis/users/:id
 *  [id](URL PATH) - UserModel's id
 *  Middleware:
 *      .|/auth/TokenController.ts
 *          - verifyToken
 *
 *  On DB Server error:
 *  [500] - status: 500
 *          msg: Server error.
 *          user: null
 *
 *  On DB Server failing to create user:
 *  [401] - status: 404
 *          msg: User could not be found.
 *          user: null
 *
 *  On Success:
 *  [201] - status: 201
 *          msg: User retrieved with success.
 *          user: Retrieved sanitazed user from DB Server.
 */
exports.UserRouter.get('/:id', auth_1.verifyToken, (req, res, next) => {
    models_1.UserModel.findOne({ _id: req.params.id }, { pwd: 0, creationdate: 0, __v: 0 }, (err, user) => {
        if (err)
            return res.status(500).json({
                status: 500,
                msg: 'Server error.',
                user: null
            });
        if (!user)
            return res.status(401).json({
                status: 404,
                msg: 'User could not be found.',
                user: null
            });
        return res.status(200).json({
            status: 200,
            msg: 'User retrived with sucess.',
            user: user
        });
    });
});
/**
 *  Verifies user and returns a signed token.
 *  POST: /login - /apis/users/login
 *  Body needed.
 *  Response Headers:
 *      Content-Type: application/x-www-form-urlencoded
 *  Middleware:
 *      .|/auth/AuthController.ts
 *          - login
 *      .|/auth/TokenController.ts
 *          - signToken
 */
exports.UserRouter.post('/login', auth_1.login, auth_1.signToken);
/**
 *  User creation.
 *  POST: /create - /apis/users/create
 *  Body needed.
 *  Response Headers:
 *      Content-Type: application/x-www-form-urlencoded
 *  Middleware:
 *      .|/auth/AuthController.ts
 *          - register
 *      .|/auth/TokenController.ts
 *          - signToken
 */
exports.UserRouter.post('/create', auth_1.register, auth_1.signToken);
/**
 *  User update data.
 *  PATCH: /:id - /apis/users/:id
 *  [id](URL PATH) - UserModel's id
 *  Body needed.
 *  Response Headers:
 *      Content-Type: application/x-www-form-urlencoded
 *  Middleware:
 *      .|/auth/TokenController.ts
 *          - verifyToken
 *
 *  On no body provided:
 *  [406] - status: 406
 *          msg: No user data provided to be updated.
 *          user: null
 *
 *  On DB Server error:
 *  [500] - status: 500
 *          msg: Server error.
 *          user: null
 *
 *  On DB Server not finding the requested user:
 *  [406] - status: 406
 *          msg: User could not be found.
 *          user: null
 *
 *  On DB Server failing to update the user document:
 *  [406] - status: 406
 *          msg: User data was unable to be updated.
 *          user: User retrieved from search.
 *
 *  On Success:
 *  [200] - status: 200
 *          msg: User data was updated with success.
 *          user: Updated user from DB Server.
 */
exports.UserRouter.patch('/:id', auth_1.verifyToken, (req, res, next) => {
    const _ = req.body;
    if (!_)
        return res.status(406).json({
            status: 406,
            msg: 'No user data provided to be updated.',
            user: null
        });
    models_1.UserModel.findById(req.params.id, (err, user) => {
        if (err)
            return res.status(500).json({
                status: 500,
                msg: 'Server error.',
                user: null
            });
        if (!user)
            return res.status(406).json({
                status: 406,
                msg: 'User could not be found.',
                user: null
            });
        if (_.name)
            user.set('name', _.name);
        if (_.birthday) {
            req.bday = new Date();
            req.bday.setTime(_.bday);
            user.set('birthday', req.bday);
        }
        if (_.desc)
            user.set('description', _.desc);
        user.save()
            .then(u => res.status(200).json({
            status: 200,
            msg: 'User data was updated with success.',
            user: u
        }))
            .catch(err => res.status(406).json({
            status: 406,
            msg: 'User data was unable to be updated.',
            user: user
        }));
    });
});
/**
 *  User termination.
 *  DELETE: /terminate/:id - /apis/users/terminate/:id
 *  [id](URL PATH) - UserModel's id
 *  Middleware:
 *      .|/auth/TokenController.ts
 *          - verifyToken
 *
 *  On DB Server failing:
 *  [500] - status: 500
 *          msg: Server error.
 *          user: null
 *
 *  On DB Server not finding the requested user:
 *  [410] - status: 500
 *          msg: User could not be found.
 *          user: null
 *
 *  On Success and user is deleted:
 *  [200] - status: 200
 *          msg: User was terminated with success.
 *          user: Document retrived from DB Server matching the requested id for one more use.
 */
exports.UserRouter.delete('/terminate/:id', auth_1.verifyToken, (req, res, next) => {
    models_1.UserModel.findByIdAndDelete(req.params.id, (err, user) => {
        if (err)
            return res.status(500).json({
                status: 500,
                msg: 'Server error.',
                user: null
            });
        if (!user)
            res.status(410).json({
                status: 410,
                msg: 'User could not be found.',
                user: null
            });
        return res.status(200).json({
            status: 200,
            msg: 'User was terminated with success.',
            user
        });
    });
});
