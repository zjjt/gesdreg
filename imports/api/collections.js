import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';

let WhatsNew=new Mongo.Collection('WhatsNew');
let RegUpdated=new Mongo.Collection('RegUpdated');
let Historique=new Mongo.Collection('Historique');
export {WhatsNew,RegUpdated,Historique};