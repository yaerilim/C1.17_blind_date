//import hangoutRouter from '../../app/routing/hangout_router';
//import express from 'express';
import mongoose from 'mongoose';
var Promise = require('bluebird');

var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
//var User = require('./fb_user');
//var User = require('../../app/models/user');
import User from '../../app/models/user';

// load the auth variables
var configAuth = require('../../config'); // use this one for testing

module.exports = function(passport) {

// passport session setup ==================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

// FACEBOOK ================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
        //function (req, token, refreshToken, done) {
            function (req, token, refreshToken, profile, done) {
        console.log('id', profile.id);
        console.log('token', token);
        console.log('familyName', profile.name.familyName);
        console.log('givenName', profile.name.givenName);
        console.log('gender', profile.gender);
        console.log('emails', profile.emails[0].value);
        console.log('picture', profile.photos[0].value);
//console.log('done', done);
            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    //User.findOne({}, function (err, user) {
                    User.findOne({'fbToken': profile.id}, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                             //if (!user.facebook.token) {
                            //     user.facebook.token = token;
                                 user.given_name = profile.name.givenName;
                                user.family_name = profile.name.familyName;
                                 user.email = (profile.emails[0].value || '').toLowerCase();
                                user.profile_picture = (profile.photos[0].value);
                                user.gender = profile.gender;


                                user.save(function (err) {
                                    if (err) {
                                        return done(err);
                                    } else {
                                        return done(null, user);
                                    }
                                });
                            //}

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.fbToken = profile.id;
                            //newUser.facebook.token = token;
                             //newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.given_name = profile.name.givenName;
                            newUser.family_name = profile.name.familyName;
                             newUser.email = (profile.emails[0].value || '').toLowerCase();
                            newUser.profile_picture = (profile.photos[0].value);
                            newUser.gender = profile.gender;



                            newUser.save(function (err) {
                                if (err) //{
                                    return done(err);
                                //} else {
                                    return done(null, newUser);
                                //}
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.fbToken = profile.id;
                    //user.facebook.token = token;
                     //user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.given_name = profile.name.givenName;
                    user.family_name = profile.name.familyName;
                     user.email = (profile.emails[0].value || '').toLowerCase();
                    user.profile_picture = (profile.photos[0].value);
                    user.gender = profile.gender;



                    user.save(function (err) {
                        if (err) //{
                            return done(err);
                        //} else{
                            return done(null, user);
                        //}

                    });

                }
            });

        }));
};