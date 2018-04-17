import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';

let WhatsNew=new Mongo.Collection('WhatsNew');
let RegUpdated=new Mongo.Collection('RegUpdated');
export {WhatsNew,RegUpdated};