/// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';

import * as $$ from '../config.app';

/**
 *  !! MIDDLEWARE FUNCTION (2-way) !!\
 *  Verifies your identity through a jwt token and proceeds to the next middleware.\
 *  Request Headers:\
 *      x-access-token: The JWT signed Token.\
 * \
 *  On no token provided:\
 *  [401] - status: 401\
 *          msg: No token provided.\
 *          auth: false\
 *          token: null\
 * \
 *  On false token:\
 *  [500] - status: 500\
 *          msg: Failed to authenticate token.\
 *          auth: false\
 *          token: The false token provided.\
 * \
 *  On Success:\
 *  Attaches UserID to the request and it continues to next middleware.
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = <string>req.headers['x-access-token'];
    if (!token) return res.status(401).json({ status: 401, auth: false, token: null, msg: 'No token provided.' });

    verify(token, $$.api_secret, (err, decoded) => {
        if (err) return res.status(500).json({ status: 500, auth: false, token, msg: 'Failed to authenticate token.' });

        req.UserID = decoded.id;
        next();
    });
}

/**
 *  !! MIDDLEWARE FUNCTION (in-way) !!\ 
 *  Signs a token for the user and sends it back. Lasts 8 hours.\
 *  Request Variables:\
 *      user\
 * \
 *  On Success:\
 *  [200] - status: 200\
 *          msg: User authenticated with success.\
 *          auth: true\
 *          token: Newly signed and valid token.\
 */
export function signToken(req: Request, res: Response, next: NextFunction) {
    console.log(1)
    const token = sign({ id: req.user._id }, $$.api_secret, { expiresIn: 28800 });
    console.log(token)
    res.status(200).json({
        status: 200,
        msg: 'User authenticated with success.',
        auth: true,
        token,
        user: req.user.id
    });
}

// [] TODO: Add signToken Middleware
// [] TODO: Create config file for env
// [] TODO: Implement CRUD operations
// [] TODO: Update CRUD with JWT
//    TODO: Handle fault on DBSchema
//    TODO: Implement products
//    TODO: Implement Shopping Lists
//    TODO: Test ? Production : Development
// [] TODO: Check 5 times .gitingnore
//    TODO: Remove node_modules
//    TODO: Send to github
//    TODO: Send to azure