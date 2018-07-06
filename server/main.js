import { Meteor } from 'meteor/meteor';
import './graphql/graphqlServer';
import publications from './publications/User.js';
import WhatsNewPub from './publications/WhatsNew.js';
import {userSQL,dispoSQL,DBSQL,DBSQLSERVER} from './graphql/connectors.js';
import methods from './methods';

Meteor.startup(()=>{
   // Meteor.users._ensureIndex({codeRedac:1},{unique:true});
    publications();
    WhatsNewPub();
    methods();
    Meteor.call("quoiDeneuf",()=>{
        console.log("Mises à jour chargées");
    })
   turnAround();
});


function turnAround(){
    if(Meteor.isServer){
        
        /* Meteor.setInterval(()=>{
                checkSQLandDoMAJ();
            }, 13000);*/
    }
}
function checkSQLandDoMAJ(){
            console.log("in cleaning function");
            let meteorUsers=Meteor.users.find().fetch();
            let i=0;
            if(meteorUsers.length){
                meteorUsers.forEach((muser)=>{
                    userSQL.findAll({attributes:{exclude:['id']},where:{
                        ulogin:muser.username,
                        //mdp:muser.services.password.bcrypt.substring(0,8)+muser.uncrypted,
                        redac:muser.codeRedac
                    }}).then(Meteor.bindEnvironment((err)=>{
                        if(err.length<=0){
                            //on ne la pas retrouver donc on efface l'element meteor
                            Meteor.users.remove({_id:muser._id});
                        console.dir(err);
                            //console.log("unused user account "+muser.username+" deleted");
                        }else{
                            //console.dir(err);
                            console.log("found no account to delete");
                        }
                    }));
                });
            }else{
                //on check si il ya des utilisateurs existants dans sql server si oui on les duplique et les cree dans mongo
                userSQL.findAll({attributes:{exclude:['id']}}).then(Meteor.bindEnvironment((res)=>{
                        if(!res.length){
                            //on ne la pas retrouver donc on efface l'element meteor
                            console.log("found no account to copy from in sql server");
                        //console.dir(err);
                            //console.log("unused user account "+muser.username+" deleted");
                        }else{
                           res.map((e,arr,i)=>{
                            Accounts.createUser({
                                username:e.ulogin,
                                password:e.mdp.substring(8)
                            });

                            let nuser=Meteor.users.findOne({username:e.ulogin});

                            Meteor.users.update(nuser._id,{
                                    $set:{
                                        uncrypted:e.mdp.substring(8),
                                        nom:e.nom,
                                        prenoms:e.prenom,
                                        email:e.email,
                                        fullname: e.nom+' '+e.prenom,
                                        codeRedac:e.redac.toUpperCase(),
                                        role:e.role
                                    }
                                });
                                if(e.nom=="zehi"){
                                    let message="<p><em>Ceci est un message automatique, veuillez ne pas y répondre.</em></p><br/><p>Bonjour Monsieur/Madame,</p><p>Veuillez trouver ci dessous vos accès au module <b>GESDREG</b> en charge de la gestion des disponibilités de règlements. </p><br/><p>Identifiant:<b> "+values.username+"</b><br/>Mot de passe:<b> "+values.passwordconf+"</b></p><p>Votre application est accèssible via le lien suivant:<a href='http://nvmob-srv:8082'>http://nvmob-srv:8082</a></p><p>Pour un fonctionnement optimal veuillez ouvrir l'application avec les navigateur <b>Google Chrome ou Mozilla Firefox</b></p><br/><br/><p>Cordialement, DSI NSIA VIE ASSURANCES</p>";
                                    Meteor.call("sendEmail",values.email,"info@nsiavieapplications.com","Vos identifiants sur le module GESDREG(Gestion des disponibilités de règlement)",message);
                                }
                                let muser=Meteor.users.findOne({username:e.ulogin});
                                if(muser){
                                    console.log("inserted in mongo users "+(++i));
                                }
                                    
                           });  
                        }
                    }));
            }
           
        }