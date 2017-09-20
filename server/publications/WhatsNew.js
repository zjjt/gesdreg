
import {Meteor} from 'meteor/meteor';
import {WhatsNew} from '../../imports/api/collections.js';

export default WhatsNewPub=()=>{
    Meteor.publish('latestNews',function(){
        return WhatsNew.find();
       
    });
}