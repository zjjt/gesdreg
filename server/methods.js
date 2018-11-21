import {Meteor} from 'meteor/meteor';
import{Promise} from 'meteor/promise';
const PromiseB=require('bluebird');
import {Accounts} from 'meteor/accounts-base';
import Sequelize from 'sequelize';
import {userSQL,dispoSQL,DBSQL,DBSQLSERVER} from './graphql/connectors.js';
import {WhatsNew,RegUpdated,Historique} from '../imports/api/collections.js';
import {pubsub} from './graphql/resolvers';
import {moment} from 'meteor/momentjs:moment';
import {Email} from 'meteor/email';
import {checkRdvDateMD} from '../imports/utils/utilitaires'

const json2xls=require('json2xls');



export default ()=>{
    Meteor.methods({
        sendEmail(to,from,subject,text){
            check([to],[Array]);
            check([from,subject,text],[String]);
            this.unblock();
            Email.send({to,from,subject,html:text});
        },
        updateNewsScreenTime(){
            let currentUser=Meteor.users.findOne({_id:this.userId});
            if(currentUser && currentUser.seenUpdateXtime<3){
                console.log()
                Meteor.users.update({_id:this.userId},{
                    $set:{
                        seenUpdateXtime:currentUser.seenUpdateXtime++,
                        }
                });
                console.log("in update screentime")
                console.dir(currentUser); 
            }else if(currentUser && currentUser.seenUpdateXtime==3){
                Meteor.users.update({_id:this.userId},{
                    $set:{
                        hasSeenUpdate:true,
                        isNewsThere:false,      
                            }
                });
            }
        },
        quoiDeneuf(){ 
            const guidGenerator=()=>{
                var S4 = function() {
                   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            };
                const updates=[
                    "GESDREG (Gestion des disponibilités de règlements) version 1.5.0",
                    "Dans cette version les mises à jour suivantes ont été effectuées:",
                    "---Mise à disposition de la modification groupée par numéro d'envoi",
                    "---Recherche par Numéro d'envois",
                    "---Mise à disposition d'une interface de consultation et de validation des règlements par la banque",
                    "---Système intégré de suivi des délais de traitements des règlements",
                    "---L'annulation et/ou le refus d'un règlement peut être effectué par un gestionnaire",
                    "---Mise à jour journalière des règlements après l'exécution des batchs dans sunshine",
                    
                ];
                let newsId=guidGenerator();
                let existInCol=WhatsNew.find().fetch();
                if(existInCol.length>0){
                    WhatsNew.remove({});    
                }
                    WhatsNew.insert({
                        updates:updates,
                        newsId:newsId
                    });
                    let met=Meteor.users.find().fetch();
                    if(met.length){
                        met.map((e,i,arr)=>{
                            Meteor.users.update({username:e.username,NewsID:null},{
                                $set:{
                                    isNewsThere:true,
                                    NewsID:newsId
                                }
                             });
                        })
                        
                    }
                
        },
        checkAdminUser(username,mdp){
            if(username===Meteor.settings.ADMINLOGMDP && mdp===Meteor.settings.ADMINLOGMDP)
            return true;
            else
            return false;
        },
        async checkDelai(){
            //check tous les reglement dont la date de depot treso est renseignee et pas la date de sortie
            let d={
                regTreso:[],
                horsDelaiT:[],
                regSign:[],
                horsDelaiS:[],
            };
                await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    statut_reg_retirer:'A LA TRESO',
            },order:[['wnrgt','DESC']]}).then((res)=>{
                res.map((e,i,arr)=>{
                   // console.dir(e.dataValues);
                    let delai=moment(e.dataValues.date_depot_treso).add(3,'d');
                    if(moment(e.dataValues.date_depot_treso).isBefore(moment(delai))){
                        d.regTreso.push(e.dataValues);
                    }else if(moment(e.dataValuesdate_depot_treso).isAfter(moment(delai))){
                        d.horsDelaiT.push(e.dataValues);
                    }
                })
            });
            await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                statut_reg_retirer:'A LA SIGNATURE',
                },order:[['wnrgt','DESC']]}).then((res)=>{
                    res.map((e,i,arr)=>{
                        //console.dir(e.dataValues);
                        let delai=moment(e.dataValues.date_depot_sign).add(1,'d');
                        if(moment(e.dataValues.date_depot_sign).isBefore(moment(delai))){
                            d.regSign.push(e.dataValues);
                        }else if(moment(e.dataValues.date_depot_sign).isAfter(moment(delai))){
                            d.horsDelaiS.push(e.dataValues);
                        }
                    })
                });
                //console.dir(d);
            return d;
        },
        async checkDelaiParRapportAuClient(){
            //check tous les reglement dont la date de depot treso est renseignee et pas la date de sortie
            let d={
                rachatTotbancass:0,
                rachatTotIndiv:0,
                avanceRachatP:0,
                terme:0,
                carec:0,
                ifc:0

            };
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            let req="select * from exp.regdispo where dateRDV between 2018-07-01 and 2018-07-31";
                await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    dateRDV:{
                        $between:[moment('2018-07-16').format("YYYY-MM-DD"),moment('2018-07-20').format("YYYY-MM-DD")]
                    },
        
            },order:[['wnrgt','DESC']]})
                        .then((res)=>{
                let promises=[];
                let dispo;
                res.forEach((r)=>{
                    promises.push(
                        Promise.all([
                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                        ]).then((infosurrgt)=>{
                            //ici on a un tableau multidimensionnel i dont know why and i dont want to bother looking for an answer to that
                            dispo=r.toJSON();
                            dispo.infoSurRgt=infosurrgt;
                            //console.log(dispo.infoSurRgt[0][0])
                            let data=checkRdvDateMD(dispo);
                            let sinistre=typeof dispo.infoSurRgt!="undefined" || typeof dispo.infoSurRgt[0][0].TYPE_SINISTRE!="undefined" ||dispo.infoSurRgt[0][0].TYPE_SINISTRE!=""?dispo.infoSurRgt[0][0].TYPE_SINISTRE:'' 
                            //console.log("le sinistre est :"+dispo.infoSurRgt[0][0].TYPE_SINISTRE);
                            //console.log("le type de data est "+typeof data);
                            //console.log(data);
                            if(sinistre!='' && data){
                                console.log("le sinistre est :"+sinistre);
                                if(sinistre=="AVANCE" ||sinistre=="RACHAT PARTIEL"){
                                    if(data.alerte==="HAUTE")
                                    d.avanceRachatP++;
                                }else if(sinistre=="RACHAT TOTAL"){
                                    let codeProduit=dispo.wnupo.toString().substring(0,3);
                                    switch(codeProduit){
                                    case "110":
                                    case "112":
                                    case "116":
                                    case "120":
                                    case "122":
                                    case "130":
                                    case "140":
                                    case "162":
                                    case "166":
                                    case "168":
                                    case "210":
                                    case "212":
                                    case "216":
                                    case "218":
                                    case "220":
                                    case "224":
                                    case "230":
                                    case "234":
                                    case "241":
                                    case "242":
                                    case "243":
                                    case "246":
                                    case "247":
                                    case "248":
                                    case "260":
                                    case "310":
                                    case "312":
                                    case "330":
                                    case "331":
                                    case "332":
                                    case "333":
                                    case "334":
                                    case "360":
                                    case "791":
                                    case "793":
                                        if(data.alerte==="HAUTE")
                                        d.rachatTotIndiv++;
                                    break;
                                    case "710":
                                    case "713":
                                    case "715":
                                    case "717":
                                    case "720":
                                    case "722":
                                    case "724":
                                    case "726":
                                    case "731":
                                    case "732":
                                    case "742":
                                    case "745":
                                    case "752":
                                    case "755":
                                    case "760":
                                    case "766":
                                    case "770":
                                    case "772":
                                    case "773":
                                    case "774":
                                    case "776":
                                    case "777":
                                    case "778":
                                    case "782":
                                    case "784":
                                    case "786":
                                        if(data.alerte==="HAUTE")
                                        d.rachatTotbancass++;
                                    break;
                                    }
                                }else if(sinistre=="TERME"){
                                    if(data.alerte==="HAUTE")
                                    d.terme++;
                                }else if(sinistre=="CAREC"){
                                    if(data.alerte==="HAUTE")
                                    d.carec++;
                                }else if(sinistre=="IFC"){
                                    if(data.alerte==="HAUTE")
                                    d.ifc++;
                                }  
                            }
                            
                            return dispo;
                        })
                    );
                })
                return Promise.all(promises);
               
            });
            
            console.dir(d);
            return d;
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
                    'DATE_RDV':record[index].dateRDV,
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
                                NewsID:null,
                                codeRedac:values.codeRedac.toUpperCase(),
                                role:values.role
                            }
                        })){
                            //DBSQL.sync();
                            let message="<em>Ceci est un message automatique, veuillez ne pas y répondre.</em><br/><br/>Bonjour Monsieur/Madame,<br/><br/>Veuillez trouver ci dessous vos accès au module GESDREG en charge de la gestion des disponibilités de règlements. <br/><br/>Identifiant: <b>"+values.username+"</b><br/> Mot de passe: <b>"+values.passwordconf+"</b>. <br/><br/>Votre application est accèssible via le lien suivant: <a href='http://10.11.100.48:8082'>http://10.11.100.48:8082</a>. <br/>Pour un fonctionnement optimal veuillez ouvrir l'application avec les navigateurs <b>Google Chrome</b> ou <b>Mozilla Firefox.</b><br/><br/> Cordialement, <br/><br/><b>DSI NSIA VIE ASSURANCES</b>";
                            console.log("Valeur de la variable environment mail "+process.env.MAIL_URL);
                            Meteor.call("sendEmail",[values.email,Meteor.settings.ADMINMAIL],"info@nsiavieapplications.com","Vos identifiants sur le module GESDREG(Gestion des disponibilités de règlement)",message);
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
        updateDispos(values,rgtArray,numenv){
            //mise a jour groupee des reglement
            console.log("numenv est "+numenv);
            let prom;
            let query;
            let comment;
            const redac=Meteor.users.findOne({_id:Meteor.user()._id});
            //console.log(typeof values.date_sort_treso);
            switch(values.choixForm){
                case "MODIFIER":
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
                    if(numenv){
                        query="update exp.regdispo set date_depot_treso=:ddt, date_sort_treso=:dst, date_depot_sign=:dds,date_recep_sign_reg=:drsr,date_retrait_reg=:drr,redac=:r,statut_reg_retirer=:srr where Num_envoi=:n "; 
                        Historique.insert({
                            dateConnexion:new Date(),
                            heure:moment(Date.now()).format("HH:mm:ss"),
                            actions:"Mise a jour de date sur les reglements de l'envoi "+numenv,
                            par:redac.codeRedac
                        });
                        DBSQLSERVER.query(query,{
                            replacements:{
                               
                                ddt:values.date_depot_treso?moment(values.date_depot_treso).format("YYYY-MM-DD"):null,
                                dst:values.date_sort_treso?moment(values.date_sort_treso).format("YYYY-MM-DD"):null,
                                dds:values.date_depot_sign?moment(values.date_depot_sign).format("YYYY-MM-DD"):null,
                                drsr:values.date_recep_sign_reg?moment(values.date_recep_sign_reg).format("YYYY-MM-DD"):null,
                                drr:values.date_retrait_reg?moment(values.date_retrait_reg).format("YYYY-MM-DD"):null,
                                r:redac.codeRedac,
                                srr:statut,
                                n:numenv
                            },
                            type:DBSQLSERVER.QueryTypes.UPDATE
                        }).catch((err)=>{
                            console.log(err);
                            return err.reason;
                        });
                    }else{
                        query="update exp.regdispo set date_depot_treso=:ddt, date_sort_treso=:dst, date_depot_sign=:dds,date_recep_sign_reg=:drsr,date_retrait_reg=:drr,redac=:r,statut_reg_retirer=:srr where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d ";  
                        rgtArray.forEach((e,i,arr)=>{
                            console.log("ligne de rgt: "+i);
                            Historique.insert({
                                 dateConnexion:new Date(),
                                 heure:moment(Date.now()).format("HH:mm:ss"),
                                 actions:"Mise a jour de date sur le reglement "+e.wnrgt,
                                 par:redac.codeRedac
                             });
                             prom= Promise.await(dispoSQL.findOne({
                                 where:{
                                     wnrgt:e.wnrgt,
                                     wnupo:e.wnupo,
                                     domaine:e.domaine
                                  }}).then(p=>{
                                      //console.dir(e);
                                       //Verifications sur les dates
                                       if(e && e.infoSurRgt.length){
                                           if(!values.date_depot_treso && e.date_depot_treso)
                                           values.date_depot_treso=e.date_depot_treso;
                                           if(!values.date_depot_sign && e.date_depot_sign)
                                           values.date_depot_sign=e.date_depot_sign;
                                           if(!values.date_sort_treso && e.date_sort_treso)
                                           values.date_sort_treso=e.date_sort_treso;
                                           if(!values.date_recep_sign_reg && e.date_recep_sign_reg)
                                           values.date_recep_sign_reg=e.date_recep_sign_reg;
                                           if(!values.date_retrait_reg && e.date_retrait_reg)
                                           values.date_retrait_reg=e.date_retrait_reg;
                                         if(values.date_depot_treso 
                                             && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                             && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                             ){
                                                 throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement");
                                             }
                                             else if(values.date_depot_treso 
                                                 &&(values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                                 &&( values.date_sort_treso?moment(values.date_depot_treso).diff(moment(values.date_sort_treso))>0:false
                                                 || values.date_depot_sign? moment(values.date_depot_treso).diff(moment(values.date_depot_sign))>0:false
                                                 || values.date_recep_sign_reg? moment(values.date_depot_treso).diff(moment(values.date_recep_sign_reg))>0:false
                                                 || values.date_retrait_reg? moment(values.date_depot_treso).diff(moment(values.date_retrait_reg))>0:false
                                                 
                                                     )
                                                 
                                                 ){
                                                     throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être après la date de sortie de trésorerie ou les dates de depot et retour de signature ou encore la date du retrait du règlement 1");
                                                 }
                                             else if(values.date_sort_treso 
                                                // && moment(e.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_REGLEMENT.replace(/\//g,"-"))
                                                 && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                                 && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                             ){
                                                     throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement");
                                                 }
                                           /*  else if(p.date_depot_treso && moment(values.date_sort_treso).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))){
                                                 throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie que vous avez précédemment saisie.");
                                             }*/
                                             else if(values.date_sort_treso 
                                                &&(values.date_depot_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                                &&(values.date_depot_treso? moment(values.date_sort_treso).diff(moment(values.date_depot_treso))<0:false
                                                 ||values.date_depot_sign?  moment(values.date_sort_treso).diff(moment(values.date_depot_sign))>0:false
                                                 || values.date_recep_sign_reg? moment(values.date_sort_treso).diff(moment(values.date_recep_sign_reg))>0:false
                                                 ||values.date_retrait_reg?  moment(values.date_sort_treso).diff(moment(values.date_retrait_reg))>0:false
                                                     )
                                               
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou après les dates de depot et retour de signature ou encore la date du retrait du règlement 2");
                                                    
                                                }
                                            else if(values.date_depot_sign 
                                                && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                                && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement ");
                                                }
                                            /*else if(moment(values.date_depot_sign).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                                ||moment(values.date_depot_sign).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie ou avant la date de sortie de trésorerie qui ont été saisies précédemment.");
                                                }*/
                                            else if(values.date_depot_sign 
                                                &&(values.date_depot_treso||values.date_sort_treso||values.date_recep_sign_reg||values.date_retrait_reg)
                                                &&( values.date_depot_treso?moment(values.date_depot_sign).diff(moment(values.date_depot_treso))<0:false
                                                 ||  values.date_sort_treso?moment(values.date_depot_sign).diff(moment(values.date_sort_treso))<0:false
                                                 ||  values.date_recep_sign_reg? moment(values.date_depot_sign).diff(moment(values.date_recep_sign_reg))>0:false
                                                 || values.date_retrait_reg? moment(values.date_depot_sign).diff(moment(values.date_retrait_reg))>0:false
                                                     )
                                               
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou la date de sortie de la trésorerie ,ni après la date de retour de signature ou encore la date du retrait du règlement");
                                                    
                                                }
                                            else if(values.date_recep_sign_reg 
                                                && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                                && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement ");
                                                }
                                            /*else if(moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                                ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                                ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature.");    
                                                }*/
                                            else if(values.date_recep_sign_reg 
                                                &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_retrait_reg)
                                                &&( values.date_depot_treso?moment(values.date_recep_sign_reg).diff(moment(values.date_depot_treso))<0:false
                                                 || values.date_sort_treso? moment(values.date_recep_sign_reg).diff(moment(values.date_sort_treso))<0:false
                                                 ||  values.date_depot_sign?moment(values.date_recep_sign_reg).diff(moment(values.date_depot_sign))<0:false
                                                 ||  values.date_retrait_reg?moment(values.date_recep_sign_reg).diff(moment(values.date_retrait_reg))>0:false
                                                     )
                                                
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie et la date de dépot à la signature ,ni après la date du retrait du règlement 4");
                                                }
                                            else if(values.date_retrait_reg 
                                                && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                                && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement.");
                                                }
                                            /*else if(moment(values.date_retrait_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                                ||moment(values.date_retrait_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                                ||moment(values.date_retrait_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))
                                                ||moment(values.date_retrait_reg).isBefore(moment(p.date_recep_sign_reg).format("YYYY-MM-DD"))){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature et la date de retour de signature.");
                                                  
                                                }*/
                                            else if(values.date_retrait_reg 
                                                &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg)
                                                &&( values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_depot_treso))<0:false
                                                 || values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_sort_treso))<0:false
                                                 || values.date_depot_treso? moment(values.date_retrait_reg).diff(moment(values.date_depot_sign))<0:false
                                                 ||  values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_recep_sign_reg))<0:false
                                                     )
                                                
                                                ){
                                                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie,la date de dépot à la signature et la date de retour de signature 5");
                                                    
                                                }
                                             else{
                                                 
                                                 DBSQLSERVER.query(query,{
                                                     replacements:{
                                                         wnrgt:e.wnrgt,
                                                         wnupo:e.wnupo,
                                                         d:e.domaine,
                                                         ddt:values.date_depot_treso?moment(values.date_depot_treso).format("YYYY-MM-DD"):e.date_depot_treso?moment(e.date_depot_treso).format("YYYY-MM-DD"):null,
                                                         dst:values.date_sort_treso?moment(values.date_sort_treso).format("YYYY-MM-DD"):e.date_sort_treso?moment(e.date_sort_treso).format("YYYY-MM-DD"):null,
                                                         dds:values.date_depot_sign?moment(values.date_depot_sign).format("YYYY-MM-DD"):e.date_depot_sign?moment(e.date_depot_sign).format("YYYY-MM-DD"):null,
                                                         drsr:values.date_recep_sign_reg?moment(values.date_recep_sign_reg).format("YYYY-MM-DD"):e.date_recep_sign_reg?moment(e.date_recep_sign_reg).format("YYYY-MM-DD"):null,
                                                         drr:values.date_retrait_reg?moment(values.date_retrait_reg).format("YYYY-MM-DD"):e.date_retrait_reg?moment(e.date_retrait_reg).format("YYYY-MM-DD"):null,
                                                         r:redac.codeRedac,
                                                         srr:statut
                                                     },
                                                     type:DBSQLSERVER.QueryTypes.UPDATE
                                                 }).catch((err)=>{
                                                     console.log(err);
                                                     return err.reason;
                                                 });
     
                                             }
                                       }else{
                                         throw new Meteor.Error("bad-date","Veuillez re verifier les dates de survenance du sinistre et date de réception de la demande du règlement "+e.wnrgt+"; il se pourrait que l'une d'entre elles soit mal renseignée.");
     
                                       }
                                      
                                  }));
                           
                            
                        });
                        return prom;
                    }
                   
                   
                  
                break;
                case "MODIFIERDV":
                
                 query="update exp.regdispo set dateRDV=:rdv where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d "; 
                if(!moment(values.dateRDV).isValid()){
                    throw new Meteor.Error("bad-date","Veuillez re verifier la date de rendez-vous du règlement "+e.wnrgt+" . Elle n'est pas valide");

                }         
                
                rgtArray.forEach((e,i,arr)=>{
                    Historique.insert({
                        dateConnexion:new Date(),
                        heure:moment(Date.now()).format("HH:mm:ss"),
                        actions:"Mise a jour de date RDV sur le reglement "+e.wnrgt,
                        par:redac.codeRedac
                    });
                    console.log("ligne de rgt: "+i);
                     prom= Promise.await(dispoSQL.findOne({
                         where:{
                             wnrgt:e.wnrgt,
                             wnupo:e.wnupo,
                             domaine:e.domaine
                          }}).then(p=>{
                            DBSQLSERVER.query(query,{
                                replacements:{
                                    wnrgt:e.wnrgt,
                                    wnupo:e.wnupo,
                                    d:e.domaine,
                                    rdv:values.dateRDV
                                },
                                type:DBSQLSERVER.QueryTypes.UPDATE
                            }).catch((err)=>{
                                console.log(err);
                                return err.reason;
                            });
                          }));
                        });
                    return prom;
                break;
                case "REFUSER":
                     query="update exp.regdispo set statut_reg_retirer=:stat, Comments=:com where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d "; 
                    comment=values.comments===""||!values.comments?"Refuser par le gestionnaire "+redac.codeRedac:values.comments;
                    rgtArray.forEach((e,i,arr)=>{
                        console.log("ligne de rgt: "+i);
                        Historique.insert({
                            dateConnexion:new Date(),
                            heure:moment(Date.now()).format("HH:mm:ss"),
                            actions:"Refus du reglement "+e.wnrgt,
                            par:redac.codeRedac
                        });
                         prom= Promise.await(dispoSQL.findOne({
                             where:{
                                 wnrgt:e.wnrgt,
                                 wnupo:e.wnupo,
                                 domaine:e.domaine
                              }}).then(p=>{
                                
                                DBSQLSERVER.query(query,{
                                    replacements:{
                                        wnrgt:e.wnrgt,
                                        wnupo:e.wnupo,
                                        d:e.domaine,
                                        stat:"REFUSER",
                                        com:comment
                                    },
                                    type:DBSQLSERVER.QueryTypes.UPDATE
                                }).catch((err)=>{
                                    console.log(err);
                                    return err.reason;
                                });
                              }));
                            });
                        return prom;
                break;
                case "ANNULER":
                query="update exp.regdispo set statut_reg_retirer=:stat,Comments=:com where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d "; 
                comment=values.comments===""||!values.comments?"Annuler par le gestionnaire "+redac.codeRedac:values.comments;
                rgtArray.forEach((e,i,arr)=>{
                    console.log("ligne de rgt: "+i);
                    Historique.insert({
                        dateConnexion:new Date(),
                        heure:moment(Date.now()).format("HH:mm:ss"),
                        actions:"Annulation du reglement "+e.wnrgt,
                        par:redac.codeRedac
                    });
                     prom= Promise.await(dispoSQL.findOne({
                         where:{
                             wnrgt:e.wnrgt,
                             wnupo:e.wnupo,
                             domaine:e.domaine
                          }}).then(p=>{
                            
                            DBSQLSERVER.query(query,{
                                replacements:{
                                    wnrgt:e.wnrgt,
                                    wnupo:e.wnupo,
                                    d:e.domaine,
                                    stat:"ANNULER",
                                    com:comment
                                },
                                type:DBSQLSERVER.QueryTypes.UPDATE
                            }).catch((err)=>{
                                console.log(err);
                                return err.reason;
                            });
                          }));
                        });
                    return prom;
                break;
                default:
                throw new Meteor.Error("bad-date","Veuillez re essayer" )
                break;
            }
            
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
        updateDisposBank(values,initialValues){
            if(initialValues.statut_reg_retirer=="SORTIE"){
                const redac=Meteor.users.findOne({_id:Meteor.user()._id});
                let query="update exp.regdispo set ValBank=:v, CommentsBank=:c where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d ";
                Historique.insert({
                    dateConnexion:new date(),
                    heure:moment(date.now()).format("HH:mm:ss"),
                    actions:"Annulation du reglement "+e.wnrgt,
                    par:redac.codeRedac
                });
                let res=DBSQLSERVER.query(query,{
                                replacements:{
                                    wnrgt:initialValues.wnrgt,
                                    wnupo:initialValues.wnupo,
                                    d:initialValues.domaine,
                                    v:values.choixbank,
                                    c:values.comment
                                },
                                type:DBSQLSERVER.QueryTypes.UPDATE
                            }).catch((err)=>{
                    console.log(err);
                    return err.reason;
                });
                pubsub.publish('rgtUpdated', { reg: initialValues, wnrgt:initialValues.wnrgt })
            }else{
                throw new Meteor.Error("access-error","Vous ne pouvez pas modifier ce reglement. Veuillez contacter un administrateur");
            }
            console.dir(initialValues);
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
            
            //ca charge les reglements dans la base
               let r= DBSQLSERVER.query(query,{
                                type:DBSQLSERVER.QueryTypes.INSERT
                            })
                    return r;
           
                           // return res;
        },
       /* maj_dateRDV(toffset){
            let inforegQ="exec info_reg_dispo :numero_reg,:domaine ";
            let upQ="update exp.regdispo set dateRDV=:drdv where wnupo=:wnupo and wnrgt=:wnrgt and dateRDV IS NULL ";
             //On fait des modifs sur les champs dans la base comme le calcul de la date de RDV
            let r=Promise.await(dispoSQL.findAll({attributes:{exclude:['id']},where:{
                dateRDV:{
                    $eq:null
                },
                $or:[
                    {
                        MRGGT:'C'
                    },
                    {
                        MRGGT:'E'
                    }
                ]
           },order:[['wnrgt','DESC']],offset:toffset,limit:25000}).then((res)=>{
               if(!res.length)return;
                   let promises=[];
                   let dispo;
                   console.log("longueur de res "+res.length);
                   res.forEach((r)=>{
                       promises.push(
                           PromiseB.all([
                           DBSQLSERVER.query(inforegQ,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                           ]).spread((infosurrgt)=>{
                               dispo=r.toJSON();
                               dispo.infoSurRgt=infosurrgt;
                           
                               return dispo;
                           })
                       );
                   });
                   return PromiseB.all(promises)
                   
               }).then((dispos)=>{
                   console.log("Les dispos completes sont: "+dispos.length)
                   let nd=dispos.map((e,i,arr)=>{
                       if(e.infoSurRgt.length>1){
                           let goodelem=e.infoSurRgt[0];
                           //console.log("reglement "+e.wnrgt);
                           //console.dir(e);
                           e.infoSurRgt=[];
                           e.infoSurRgt.push(goodelem);
                       }
                       return e;
                   });
                   console.log("longueur de nd "+nd.length);
                   //On check et on calcule la date de RDV pour chaque reglement dont la dateRDV n'est pas a jour
                   nd.map((e,i,arr)=>{
                       //console.log("type de Type sINISTRE: "+typeof e.infoSurRgt[0].TYPE_SINISTRE);
                    let rdvDate;
                    if(typeof e.infoSurRgt[0]!="undefined"||typeof e.infoSurRgt[0].TYPE_SINISTRE!="undefined" || e.infoSurRgt[0].TYPE_SINISTRE!= null ){
                        switch(e.infoSurRgt[0].TYPE_SINISTRE){
                            case "RACHAT TOTAL":
                            let get4numbers=parseInt(e.wnupo.toString().substring(0,4),10);//juste pour avoir les 4 premier chiffres fuck
                                //la il ya deux cas celui des polices individuelles et des polices bancassurances
                                //INDIVIDUEL
                                if((get4numbers>1000 && get4numbers<4000)||(get4numbers>7900 &&get4numbers<8000)){
                                     rdvDate=moment(e.infoSurRgt[0].DATE_RECEPTION).add(60,'days');
                                     console.log("date reception: "+e.infoSurRgt[0].DATE_RECEPTION+" date RDV: "+moment(rdvDate).format("YYYY-MM-DD"));
                                }
                                //BANCASSURANCE
                                else if(get4numbers>7000 && get4numbers<7900){
                                    rdvDate=moment(e.infoSurRgt[0].DATE_RECEPTION).add(45,'days');
                                    console.log("date reception: "+e.infoSurRgt[0].DATE_RECEPTION+" date RDV: "+moment(rdvDate).format("YYYY-MM-DD"));
    
                                }
                            break;
                            case "RACHAT PARTIEL":
                            case "AVANCE":
                            rdvDate=moment(e.infoSurRgt[0].DATE_RECEPTION).add(21,'days');
                            console.log("date reception: "+e.infoSurRgt[0].DATE_RECEPTION+" date RDV: "+moment(rdvDate).format("YYYY-MM-DD"));
                            break;
                            default:
                             rdvDate=null;
                            break;
                           }
                          /* RegUpdated.insert({
                               wasrg:e.wasrg,
                               wnrgt:e.wnrgt,
                               wnupo:e.wnupo
                           });
                        let promises=[];
                        let dispo;
                        console.log("valeur de la daterdv: "+rdvDate);
                        let rD=moment(rdvDate,"YYYY-MM-DD",true);
                        console.log(rD);
                        if(rD.isValid()){
                            promises.push(
                                PromiseB.all([
                                DBSQLSERVER.query(upQ,{ replacements:{drdv:rD.isValid()?rD.format("YYYY-MM-DD"):null,wnupo:e.wnupo,wnrgt:e.wnrgt},type:DBSQLSERVER.QueryTypes.UPDATE}).catch((err)=>{
                                    console.log(err);
                                    return err.reason;
                                })
                                ])
                            );
                        }else{
                            console.log("date rdv not valid erreur");
                        }
                    }else{
                        console.log("erreur d'infomations infoSurRgt n'est pas fourni loop again");
                    }
                       
                    
                   });
                    //return nd;
               }));
               console.log("next round-------");
                     let o =toffset+25000;
                     console.log("valeur de o:"+o);
               
                     
                    Meteor.call("maj_dateRDV",o);
                 
               
        },*/
        
    });
};



