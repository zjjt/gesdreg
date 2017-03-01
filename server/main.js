import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import publications from './publications/User.js';
import {userSQL,dispoSQL,DBSQL,DBSQLSERVER} from '../imports/api/graphql/connectors.js';
import methods from './methods';

Meteor.startup(()=>{
   // Meteor.users._ensureIndex({codeRedac:1},{unique:true});
    publications();
    methods();
   turnAround();
});


function turnAround(){
    if(Meteor.isServer){
         Meteor.setInterval(()=>{
                checkSQLandDoMAJ();
            }, 13000);
    }
}
function checkSQLandDoMAJ(){
            console.log("in cleaning function");
            let meteorUsers=Meteor.users.find().fetch();
            let i=0;
            meteorUsers.forEach((muser)=>{
                userSQL.findAll({attributes:{exclude:['id']},where:{
                    ulogin:muser.username,
                    mdp:muser.services.password.bcrypt.substring(0,8)+muser.uncrypted,
                    redac:muser.codeRedac
                }}).then(Meteor.bindEnvironment((err)=>{
                    if(err.length<=0){
                        //on ne la pas retrouver donc on efface l'element meteor
                        Meteor.users.remove({_id:muser._id});
                       console.dir(err);
                        //console.log("unused user account "+muser.username+" deleted");
                    }else{
                        console.dir(err);
                        console.log("found no account to delete");
                    }
                }));
            });
        }