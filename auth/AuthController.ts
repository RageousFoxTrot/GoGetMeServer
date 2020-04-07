/// @ts-nocheck
import { hashSync, compareSync } from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

import { UserModel } from '../models';

/**
 *  !! MIDDLEWARE FUNCTION (2-way) !!\
 *  Create user on DB Server and attaches it to the
 *  request by user.\
 *  Body needed.\
 *  Request Headers:\
 *      Content-Type: application/x-www-form-urlencoded\
 * \
 *  On no body provided:\
 *  [406] - status: 406\
 *          msg: False requester.\
 * \
 *  On DB Server error:\
 *  [500] - status: 500\
 *          msg: There was an error registring the user.\
 * \
 *  On Success:\
 *  Request is attached the user and it continues to next middleware.
 */
export function register(req: Request, res: Response, next: NextFunction) {
    const _ = req.body;
    
    if (!_.pwd) return res.status(406).json({ status: 406, msg: 'False requester.' });
    const hash = hashSync(_.pwd, 12);

    req.bday = new Date();
    req.bday.setTime(_.bday);
    UserModel.create({
        name: _.name || _.fname + ' ' + _.lname,
        birthday: req.bday,
        description: _.desc,
        email: _.email,
        uid: _.uid,
        pwd: hash
    }, (err: any, user: any) => {
        if (err || !user) return res.status(500).json({ status: 500, msg: 'There was an error registring the user.' });

        req.user = user;
        next();
    });
}

/**
 *  !! MIDDLEWARE FUNCTION (2-way) !!\
 *  Checks if credentials are correct, if so proceeds to the next middleware.\
 *  Body needed.\
 *  Request Headers:\
 *      Content-Type: application/x-www-form-urlencoded\
 * \
 *  On bad body provided:\
 *  [406] - status: 406\
 *          msg: False requester.\
 * \
 *  On DB Server error:\
 *  [500] - status: 500\
 *          msg: There was an error logging the user.\
 *          auth: false\
 * \
 *  On DB Server not finding the requested user:\
 *  [404] - status: 404\
 *          msg: User could not be found.\
 *          auth: false\
 * \
 *  On password don't match:\
 *  [401] - status: 401\
 *          msg: Login error.\
 *          auth: false\
 *          token: null\
 * \
 *  On Success:\
 *  User is attached to the request and it continues to next middleware.
 */
export function login(req, res, next) {
    if (!(req.body.email || req.body.uid || req.body.pwd)) return res.status(406).json({ status: 406, msg: 'False requester.' });

    UserModel.findOne({ uid: req.body.uid }, (err, user) => {
        if (err) return res.status(500).json({ status: 500, auth:false, msg: 'There was an error logging the user.' });
        if (!user) return res.status(404).json({ status: 404, auth: false, msg: 'No such user.' });

        const pwdValid = compareSync(req.body.pwd, (<any>user).pwd);
        if (!pwdValid) return res.status(401).json({ status: 401, auth: false, msg: 'Login error.', token: null });

        req.user = user;
        next();
    });
}