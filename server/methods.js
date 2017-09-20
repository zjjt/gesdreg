import {Meteor} from 'meteor/meteor';
import{Promise} from 'meteor/promise';
import {Accounts} from 'meteor/accounts-base';
import Sequelize from 'sequelize';
import {userSQL,dispoSQL,DBSQL,DBSQLSERVER} from '../imports/api/graphql/connectors.js';
import {WhatsNew} from '../imports/api/collections.js';
import {moment} from 'meteor/momentjs:moment';
import {Email} from 'meteor/email';

const json2xls=require('json2xls');




export default ()=>{
    Meteor.methods({
        sendEmail(to,from,subject,text){
            check([to,from,subject,text],[String]);
            this.unblock();
            Email.send({to,from,subject,html:text});
        },
        updateNewsScreenTime(){
            let currentUser=Meteor.users.findOne({_id:this.userId});
            if(currentUser && currentUser.seenUpdateXtime<3){
                Meteor.users.update(currentUser._id,{
                    $set:{
                        hasSeenUpdate:false,
                        seenUpdateXtime:currentUser.seenUpdateXtime++,
                        isNewsThere:true,
                              
                            }
                });
                console.dir(currentUser); 
            }else if(currentUser && currentUser.seenUpdateXtime==3){
                Meteor.users.update(currentUser._id,{
                    $set:{
                                
                        hasSeenUpdate:true,
                        isNewsThere:false,
                                
                            }
                });
            }
        },
        quoiDeneuf(){ 
                const updates=[
                    "GESDREG (Gestion des disponibilités de règlements) version 0.5 Beta",
                    "Dans cette version la recherche pour les gestionnaires a été amélioré:",
                    "---Mise à jour groupée par selection multiple des règlements",
                    "---Recherche par intervalle de règlement",
                    "---Mise en place d'une distinction visuelle entre les règlements selon leur statut dans le système",
                    "---Tri et rangement des règlements par numéro de règlements ",
                    "Les ajouts contenus dans le cahier de charge seront intégrés au fur et à mesure"
                ];

                let existInCol=WhatsNew.find().fetch();
                if(existInCol.length>0){
                    WhatsNew.remove({});
                    WhatsNew.insert({
                        updates:updates
                    });
                    let met=Meteor.users.findOne();
                    if(met){
                        Meteor.users.update({
                        $set:{
                            isNewsThere:true
                        }
                     });
                    }
                    
                }else{
                    WhatsNew.insert({
                        updates:updates
                    });
                    let met=Meteor.users.findOne();
                    if(met){
                        Meteor.users.update({
                        $set:{
                            isNewsThere:true
                        }
                     });
                    }
                }
        },
        checkAdminUser(username,mdp){
            if(username===Meteor.settings.ADMINLOGMDP && mdp===Meteor.settings.ADMINLOGMDP)
            return true;
            else
            return false;
        },
        exportToExcel(EXL){

           let jsonArray=[];

           EXL.forEach((instance,index,record)=>{

                if(record[index].domaine==="I")domaine="INDIVIDUEL";
                if(record[index].domaine==="G")domaine="GROUPE";
                if(record[index].domaine==="R")domaine="RENTE";

               let tempArr={
                    'DOMAINE':domaine,
                    'NUMERO_DU_BENEFICIAIRE':record[index].wasrg,
                    'NUMERO_POLICE':record[index].wnupo,
                    'NUMERO_REGLEMENT':record[index].wnrgt,
                    'NUMERO_CHEQUE':record[index].infoSurRgt[0]?record[index].infoSurRgt[0].NUMERO_CHEQUE!=''?record[index].infoSurRgt[0].NUMERO_CHEQUE:'Aucun numero':'Aucun numero',
                    'MONTANT':record[index].MNTGT,
                    'MODE_REGLEMENT':record[index].MRGGT,
                    'NOM_DU_BENEFICIAIRE':record[index].nom_beneficiaire,
                    'LIBELLE_SINISTRE':record[index].infoSurRgt[0]?record[index].infoSurRgt[0].LIBELLE_SINISTRE:null,
                    'CAUSE_SINISTRE':record[index].infoSurRgt[0]?record[index].infoSurRgt[0].CAUSE_SINISTRE:null,
                    'TYPE_SINISTRE':record[index].infoSurRgt[0]?record[index].infoSurRgt[0].TYPE_SINISTRE:null,
                    'DATE_RECEPTION':record[index].infoSurRgt[0]?record[index].infoSurRgt[0].DATE_RECEPTION:null,
                    'DATE_NAISSANCE_BENEFICIAIRE':record[index].date_naiss?moment(record[index].date_naiss).format("DD-MM-YYYY"):"NON DEFINIE",
                    'DATE_DEPOT_TRESO':record[index].date_depot_treso?moment(record[index].date_depot_treso).format("DD-MM-YYYY"):"NON DEFINIE",
                    'DATE_SORT_TRESO':record[index].date_sort_treso?moment(record[index].date_sort_treso).format("DD-MM-YYYY"):"NON DEFINIE",
                    'DATE_DEPOT_SIGNATURE':record[index].date_depot_sign?moment(record[index].date_depot_sign).format("DD-MM-YYYY"):"NON DEFINIE",
                    'DATE_RECEPTION_SIGNATURE':record[index].date_recep_sign_reg?moment(record[index].date_recep_sign_reg).format("DD-MM-YYYY"):"NON DEFINIE",
                    'DATE_RETRAIT_REGLEMENT':record[index].date_retrait_reg?moment(record[index].date_retrait_reg).format("DD-MM-YYYY"):"NON DEFINIE",
                    'STATUT_DU_REGLEMENT':record[index].statut_reg_retirer,
                    'REDACTEUR':record[index].redac==="ADM"?"Administrateur":record[index].redac
               }
               jsonArray.push(tempArr);
           });
           
           let xls=json2xls(jsonArray);
           return xls;
        },
        createNewUser(values){
            let codeFound=Meteor.users.findOne({codeRedac:values.codeRedac.toUpperCase()});
            if(codeFound){
                 throw new Meteor.Error("Veuillez re vérifier, il se pourrait que le code rédacteur existe déja");
                 //return false;
            }
            //-----------------------------
            if( Accounts.createUser({
                        username:values.username,
                        password:values.password
                    })){
                        let nuser=Meteor.users.findOne({username:values.username});
                        if(Meteor.users.update(nuser._id,{
                            $set:{
                                uncrypted:values.passwordconf,
                                nom:values.nom,
                                prenoms:values.prenom,
                                fullname: values.nom+' '+values.prenom,
                                email:values.email,
                                hasSeenUpdate:false,
                                seenUpdateXtime:0,
                                isNewsThere:false,
                                codeRedac:values.codeRedac.toUpperCase(),
                                role:values.role
                            }
                        })){
                            //DBSQL.sync();
                            let message="Ceci est un message automatique, veuillez ne pas y répondre.<br/><br/>Bonjour Monsieur/Madame,<br/><br/>Veuillez trouver ci dessous vos accès au module GESDREG en charge de la gestion des disponibilités de règlements. <br/><br/>Identifiant: <b>"+values.username+"</b><br/> Mot de passe: <b>"+values.passwordconf+"</b>. <br/><br/>Votre application est accèssible via le lien suivant: http://nvmob-srv:8082. <br/>Pour un fonctionnement optimal veuillez ouvrir l'application avec les navigateur <b>Google Chrome ou Mozilla Firefox.</b><br/><br/> Cordialement, <br/><br/><b>DSI NSIA VIE ASSURANCES</b>";
                            console.log("Valeur de la variable environment mail "+process.env.MAIL_URL);
                            Meteor.call("sendEmail",values.email,"info@nsiavieapplications.com","Vos identifiants sur le module GESDREG(Gestion des disponibilités de règlement)",message);
                              return userSQL.create({
                                    ulogin:values.username,
                                    mdp:nuser.services.password.bcrypt.substring(0,8)+values.passwordconf,//values.passwordconf,
                                    nom:values.nom,
                                    prenom:values.prenom,
                                    email:values.email,
                                    redac:values.codeRedac.toUpperCase(),
                                    role:values.role
                                }).then((err,res)=>{
                                    if(err){
                                        
                                       // throw new Meteor.Error("Veuillez re vérifier, il se pourrait que le code rédacteur existe déja");
                                        return false;
                                    }
                                    else
                                    return true;
                                    //DBSQL.close();
                                
                             }).catch((err)=>{
                                throw new Meteor.Error("Veuillez re vérifier, il se pourrait que le code rédacteur existe déja");
                             });
                            //return true;
                        }
                        else{
                            Meteor.users.remove({username:values.username});
                            throw new Meteor.Error("Veuillez re vérifier vos champs");
                            
                        }
                    }else{
                       throw new Meteor.Error("Veuillez re vérifier vos champs, cet utilisateur existe deja");
                    }
             
            
        },
        createDispo(values){
            const redac=Meteor.users.findOne({_id:Meteor.userId})
            console.log(Meteor.userid);
            console.dir(values);
            return dispoSQL.create({
                wasrg:values.wasrg,
                wnrgt:values.wnrgt,
                date_depot_treso:values.date_depot_treso,
                date_sort_treso:values.date_sort_treso,
                date_depot_sign:values.date_depot_sign,
                date_recep_sign_reg:values.date_recep_sign_reg,
                redac:redac.codeRedac,
                statut_reg_retirer:"EN COURS",
                domaine:values.domaine,
            }).then(()=>{
                return true;
            });
        },
        updateDispos(values,rgtArray){
            //mise a jour groupee des reglement
            let prom;
            console.dir(values);
            let statut="EN COURS";
            if(values.date_depot_treso){
                statut="A LA TRESO";
               }
               if(values.date_sort_treso){
                statut="SORTIE DE TRESO";
               }
               if(values.date_depot_sign){
                statut="A LA SIGNATURE";
               }
               if(values.date_recep_sign_reg){
                statut="PRET";
               }
               if(values.date_retrait_reg){
                   statut="SORTIE"
               }
               const redac=Meteor.users.findOne({_id:Meteor.user()._id});
               let query="update exp.regdispo set date_depot_treso=:ddt, date_sort_treso=:dst, date_depot_sign=:dds,date_recep_sign_reg=:drsr,date_retrait_reg=:drr,redac=:r,statut_reg_retirer=:srr where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d ";               
               rgtArray.forEach((e,i,arr)=>{
                   console.log("ligne de rgt: "+i);
                    prom= Promise.await(dispoSQL.findOne({
                        where:{
                            wnrgt:e.wnrgt,
                            wnupo:e.wnupo,
                            domaine:e.domaine
                         }}).then(p=>{
                              //Verifications sur les dates
                             if(values.date_depot_treso 
                                 && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                 && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                 ){
                                     throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date du règlement");
                                 }
                                 else if(values.date_depot_treso 
                                     &&(values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                     && (
                                         moment(values.date_depot_treso).isAfter(values.date_sort_treso)
                                         ||moment(values.date_depot_treso).isAfter(values.date_depot_sign)
                                         ||moment(values.date_depot_treso).isAfter(values.date_recep_sign_reg)
                                         ||moment(values.date_depot_treso).isAfter(values.date_retrait_reg)
                                     )
                                     ){
                                         throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être après la date de sortie de trésorerie ou les dates de depot et retour de signature ou encore la date du retrait du règlement");
                                     }
                                 else if(values.date_sort_treso 
                                    // && moment(e.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_REGLEMENT.replace(/\//g,"-"))
                                     && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                     && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                 ){
                                         throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date du règlement");
                                     }
                               /*  else if(p.date_depot_treso && moment(values.date_sort_treso).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))){
                                     throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie que vous avez précédemment saisie.");
                                 }*/
                                 else if(values.date_sort_treso 
                                    &&(values.date_depot_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                    && (
                                        moment(values.date_sort_treso).isBefore(values.date_depot_treso)
                                        ||(values.date_depot_sign && moment(values.date_sort_treso).isAfter(values.date_depot_sign))
                                        ||(values.date_recep_sign_reg && moment(values.date_sort_treso).isAfter(values.date_recep_sign_reg))
                                        ||(values.date_retrait_reg && moment(values.date_sort_treso).isAfter(values.date_retrait_reg))
                                    )
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou après les dates de depot et retour de signature ou encore la date du retrait du règlement ");
                                        
                                    }
                                else if(values.date_depot_sign 
                                    && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                    && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date du règlement ");
                                    }
                                /*else if(moment(values.date_depot_sign).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                    ||moment(values.date_depot_sign).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie ou avant la date de sortie de trésorerie qui ont été saisies précédemment.");
                                    }*/
                                else if(values.date_depot_sign 
                                    &&(values.date_depot_treso||values.date_sort_treso||values.date_recep_sign_reg||values.date_retrait_reg)
                                    && (
                                        moment(values.date_depot_sign).isBefore(values.date_depot_treso)
                                        ||moment(values.date_depot_sign).isBefore(values.date_sort_treso)
                                        ||(values.date_recep_sign_reg && moment(values.date_depot_sign).isAfter(values.date_recep_sign_reg))
                                        ||(values.date_retrait_reg && moment(values.date_depot_sign).isAfter(values.date_retrait_reg))
                                    )
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou la date de sortie de la trésorerie ,ni après la date de retour de signature ou encore la date du retrait du règlement");
                                        
                                    }
                                else if(values.date_recep_sign_reg 
                                    && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                    && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date du règlement ");
                                    }
                                /*else if(moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                    ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                    ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature.");    
                                    }*/
                                else if(values.date_recep_sign_reg 
                                    &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_retrait_reg)
                                    && (
                                        moment(values.date_recep_sign_reg).isBefore(values.date_depot_treso)
                                        ||moment(values.date_recep_sign_reg).isBefore(values.date_sort_treso)
                                        ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_sign)
                                        ||(values.date_retrait_reg && moment(values.date_recep_sign_reg).isAfter(values.date_retrait_reg))
                                    )
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie et la date de dépot à la signature ,ni après la date du retrait du règlement");
                                    }
                                else if(values.date_retrait_reg 
                                    && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                    && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date du règlement.");
                                    }
                                /*else if(moment(values.date_retrait_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                    ||moment(values.date_retrait_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                    ||moment(values.date_retrait_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))
                                    ||moment(values.date_retrait_reg).isBefore(moment(p.date_recep_sign_reg).format("YYYY-MM-DD"))){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature et la date de retour de signature.");
                                      
                                    }*/
                                else if(values.date_retrait_reg 
                                    &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg)
                                    && (
                                        moment(values.date_retrait_reg).isBefore(values.date_depot_treso)
                                        ||moment(values.date_retrait_reg).isBefore(values.date_sort_treso)
                                        ||moment(values.date_retrait_reg).isBefore(values.date_depot_sign)
                                        ||moment(values.date_retrait_reg).isBefore(values.date_recep_sign_reg)
                                    )
                                    ){
                                        throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie,la date de dépot à la signature et la date de retour de signature");
                                        
                                    }
                                 else{
                                     DBSQLSERVER.query(query,{
                                         replacements:{
                                             wnrgt:e.wnrgt,
                                             wnupo:e.wnupo,
                                             d:e.domaine,
                                             ddt:values.date_depot_treso?values.date_depot_treso:null,
                                             dst:values.date_sort_treso?values.date_sort_treso:null,
                                             dds:values.date_depot_sign?values.date_depot_sign:null,
                                             drsr:values.date_recep_sign_reg?values.date_recep_sign_reg:null,
                                             drr:values.date_retrait_reg?values.date_retrait_reg:null,
                                             r:redac.codeRedac,
                                             srr:statut
                                         },
                                         type:DBSQLSERVER.QueryTypes.UPDATE
                                     }).catch((err)=>{
                                         console.log(err);
                                         return err.reason;
                                     });
                                 }
                         }));
                  
                   
               });
               
               return prom;
        },
        updateDispo(newval,initialValues){
            console.dir(newval);
            let statut="EN COURS";
            newval.date_depot_treso=newval.date_depot_treso?newval.date_depot_treso:initialValues.date_depot_treso?initialValues.date_depot_treso:null;
                    newval.date_sort_treso=newval.date_sort_treso?newval.date_sort_treso:initialValues.date_sort_treso?initialValues.date_sort_treso:null;
                    newval.date_depot_sign=newval.date_depot_sign?newval.date_depot_sign:initialValues.date_depot_sign?initialValues.date_depot_sign:null;
                    newval.date_recep_sign_reg= newval.date_recep_sign_reg? newval.date_recep_sign_reg:initialValues.date_recep_sign_reg?initialValues.date_recep_sign_reg:null;
                    newval.date_retrait_reg=newval.date_retrait_reg?newval.date_retrait_reg:initialValues.date_retrait_reg?initialValues.date_retrait_reg:null;
                    /*let statut=!newval.statut?initialValues.statut_reg_retirer:"EN COURS";
                    newval.statut=newval.date_retrait_reg && !newval.date_recep_sign_reg?"SORTIE":newval.date_recep_sign_reg && !newval.date_retrait_reg?"PRET":"EN COURS";*/
           if(newval.date_depot_treso){
            statut="A LA TRESO";
           }
           if(newval.date_sort_treso){
            statut="SORTIE DE TRESO";
           }
           if(newval.date_depot_sign){
            statut="A LA SIGNATURE";
           }
           if(newval.date_recep_sign_reg){
            statut="PRET";
           }
           if(newval.date_retrait_reg){
               statut="SORTIE"
           }
            const redac=Meteor.users.findOne({_id:Meteor.user()._id});
             let query="update exp.regdispo set date_depot_treso=:ddt, date_sort_treso=:dst, date_depot_sign=:dds,date_recep_sign_reg=:drsr,date_retrait_reg=:drr,redac=:r,statut_reg_retirer=:srr where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d ";
                let res=DBSQLSERVER.query(query,{
                                replacements:{
                                    wnrgt:newval.wnrgt,
                                    wnupo:newval.wnupo,
                                    d:newval.domaine,
                                    ddt:newval.date_depot_treso,
                                    dst:newval.date_sort_treso,
                                    dds:newval.date_depot_sign,
                                    drsr:newval.date_recep_sign_reg,
                                    drr:newval.date_retrait_reg,
                                    r:redac.codeRedac,
                                    srr:statut
                                },
                                type:DBSQLSERVER.QueryTypes.UPDATE
                            }).catch((err)=>{
                    console.log(err);
                    return err.reason;
                });
            /*dispoSQL.findOne({where:{wnrgt:newval.wnrgt,domaine:newval.domaine}}).then((e)=>{
                e.update({
                    date_depot_treso:newval.date_depot_treso,
                    date_sort_treso:newval.date_sort_treso,
                    date_depot_sign:newval.date_depot_sign,
                    date_recep_sign_reg:newval.date_recep_sign_reg,
                    date_retrait_reg:newval.date_retrait_reg,
                    redac:redac.codeRedac,
                    statut_reg_retirer:statut
                    
                }).catch((err)=>{
                    console.log(err);
                    return err.reason;
                });
            });*/
            ///////////////////////////            
        },
        voirInfoReg(args){
                 let query="exec info_reg_dispo :numero_reg,:domaine ";
                let res=DBSQLSERVER.query(query,{
                                replacements:{
                                    numero_reg:args.wnrgt,
                                    domaine:args.domaine
                                },
                                type:DBSQLSERVER.QueryTypes.SELECT
                            });
                            return res;
        },
        maj_database(){
            let query="exec chargement_reg_module ";
                let res=DBSQLSERVER.query(query,{
                                type:DBSQLSERVER.QueryTypes.INSERT
                            });
                            return res;
        },
        
    });
};



