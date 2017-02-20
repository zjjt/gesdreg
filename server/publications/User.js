
import {Meteor} from 'meteor/meteor';

export default()=>{
    Meteor.publish('users',(_id)=>{
        return Meteor.users.find({_id});
    });
}