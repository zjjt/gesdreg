import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import publications from './publications/User.js';
import methods from './methods';

Meteor.startup(()=>{
   // Meteor.users._ensureIndex({codeRedac:1},{unique:true});
    publications();
    methods();

});
