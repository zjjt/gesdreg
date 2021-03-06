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
import {checkRdvDateMD, frenchDateToEn,englishDateToFr} from '../imports/utils/utilitaires';
import {Excel} from 'meteor/netanelgilad:excel';
const fs = require('fs');
const axios = require('axios');
const json2xls=require('json2xls');
const wsSMS="http://10.11.100.48:8084/sendSMS";
const nodeoutlook = require('nodemailer');
let transporter = nodeoutlook.createTransport({
    host :process.env.SMTP_HOST,
    port :process.env.SMTP_PORT,
    secure : false , // true for 465, false for other ports
    auth:false,
    logger: true,
    debug: true,
    tls: {rejectUnauthorized: false},
});



export default ()=>{
    Meteor.methods({
        sendEmail(to,from,subject,text){
            check([to],[Array]);
            check([from,subject,text],[String]);
            this.unblock();
           // Email.send({to,from,subject,html:text});
            transporter.sendMail({
                from,
                to,
                cc: process.env.CCMAIL,
                bcc:process.env.BCCMAIL,
                subject,
                html: text,
                onError: (e) => console.log(e),
                onSuccess: (i) => console.log(i)// html body
            });
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
                    "GESDREG (Gestion des disponibilités de règlements) version 2.0.0",
                    "Dans cette version les mises à jour suivantes ont été effectuées:",
                    "---Possibilité d'exclusion des règlements par numéro de règlement",
                    "---Insertion des codes rejets des envois",
                    "---Intégration des règlements manuels par fichier Excel",
                    "---Affichage des chèques annulés ou non valides",
                    "---Interface banquaire mise à jour",
                    
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
            /*//check tous les reglement dont la date de depot treso est renseignee et pas la date de sortie
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
            return d;*/
        },
        async checkDelaiParRapportAuClient(){/*
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
            return d;*/
            return true;
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
        updateDisposManuel(){
            let lieuderetrait="Siège Nsia Vie Assurances";
            var excel = new Excel('xlsx');
            const pathToFile=process.env.PWD+'/FICHIERS/rgtmanuel/rgtmanuel.xlsx';
            var workbook = excel.readFile(pathToFile,{cellDates: true,dateNF:"dd/MM/yyyy"}); 
            //console.dir(workbook);
            var sheet = workbook.Sheets.Feuil1;
            var options = {};
            const redac=Meteor.users.findOne({_id:Meteor.user()._id});

            // Generate the JSON like so:
            var workbookJson = excel.utils.sheet_to_json( sheet, options );
            //console.dir(workbookJson);
            //before inserting we should check to see if this pqrticulqr rgt and police and domaine
            //already exists if it does we update the line else we insert a new one
            let message=`<p>Bonjour cher tous, <br/>Les envois de sms de disponibilités des règlements ont été effectués ce jour via GESDREG suite à une mise à jour de ${redac.codeRedac}</p>`;
            let nbrgt4sms=0;
            let query="insert into exp.regdispo (date_depot_treso,date_sort_treso,date_depot_sign,date_recep_sign_reg,date_retrait_reg,redac,statut_reg_retirer,wnupo,wnrgt,MNTGT,nom_beneficiaire,domaine,Num_envoi,cheque,MRGGT,banque,Comments) values (:ddt,:dst,:dds,:drsr,:drr,:r,:srr,:p,:rgt,:mnt,:nb,:dom,:nenv,:c,:mrggt,:ban,:com)";
            workbookJson.map((e,i)=>{
                let queryU="update exp.regdispo set";
                console.log("in the loop manuel");
                console.log("contents of e is");
                console.dir(e);
                if(!e.DOMAINE){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le domaine n'est pas renseigné.");
                    return;
                }
                if(e.MODE_REGLEMENT=='C' && (e.CHEQUE==""||isNaN(e.CHEQUE))){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le numéro de chèque est mal renseigné.");
                    return;
                }
                //pour l'envoi de sms il faut verifier que la date de reception est renseignee pour les chèques
                //en fonction du modèle des feedbacks reçu de la DRCP
                if(e.MODE_REGLEMENT=='C' && e.DATE_SORTIE_SIGNATURE!="" && typeof e.DATE_RECEPTION_DEMANDE=="undefined"){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.la date de réception de la demande doit être renseignés pour l'envoi du sms.");
                    return;
                }

                if(e.MODE_REGLEMENT=='B' && (e.ENVOI==""||isNaN(e.ENVOI))){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le numéro d'envoi est mal renseigné.");
                    return;
                }
                if(e.PRESTATION==""||!e.PRESTATION){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le champs PRESTATION n'est pas renseigné.");
                    return;
                }
                /*if(e.REGLEMENT!='88888' ||parseInt(e.REGLEMENT)!=88888 ){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le numéro de reglement doit être 88888.");
                    return;
                }*/
                if(isNaN(e.POLICE) ){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le numéro de police est mal renseigné.");
                    return;
                }
                if(isNaN(e.MONTANT) ){
                    throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le numéro de police est mal renseigné.");
                    return;
                }
                let statut="EN COURS";
                    if(e.DATE_ENTREE_TRESO){
                        
                        statut="A LA TRESO";
                    }
                   if(e.DATE_SORTIE_TRESO){
                       
                    statut="SORTIE DE TRESO";
                   }
                   if(e.DATE_ENTREE_SIGNATURE){
                    
                    statut="A LA SIGNATURE";
                   }
                   if(e.DATE_SORTIE_SIGNATURE){
                    
                    statut="PRET";
                   }
                   if(e.DATE_RETRAIT){
                    
                       statut="SORTIE"
                   }
                   if(typeof e.COMMENTAIRE!="undefined" && e.COMMENTAIRE.includes("REJET")){
                    statut="REJET"
                    }
                Historique.insert({
                    dateConnexion:new Date(),
                    heure:moment(Date.now()).format("HH:mm:ss"),
                    actions:"Insertion des reglements manuel",
                    par:redac.codeRedac
                });
                // check if rgt exists already
                let checkQ="select * from exp.regdispo where wnrgt=:rgt and wnupo=:p and domaine=:dom";
                let countRes=Promise.await(DBSQLSERVER.query(checkQ,{
                    replacements:{
                        rgt:e.REGLEMENT,
                        p:e.POLICE,
                        dom:e.DOMAINE
                    },
                    type:DBSQLSERVER.QueryTypes.SELECT
                }).then((resultat)=>{
                    console.dir(resultat);
                    console.log("the rgt exists "+resultat.length+" times");
                    if(resultat.length>0 && resultat[resultat.length-1].statut_reg_retirer!=="REJET"){
                        if(typeof e.COMMENTAIRE=="undefined"||!e.COMMENTAIRE.includes("MAJ")){
                            throw new Meteor.Error("bad-rgt","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.la ligne a déjà été intégrée.");
                            return;
                        }
                       

                        //update the rgt here we build the query and the updateoptions
                        let updateOptions={};
                        if(typeof e.BENEFICIAIRE!="undefined"||e.BENEFICIAIRE!=""){
                            queryU+=" nom_beneficiaire=:nb,";
                            updateOptions['nb']=e.BENEFICIAIRE!=""?e.BENEFICIAIRE:resultat[0].nom_beneficiaire?resultat[0].nom_beneficiaire:null;
                        }
                        if(typeof e.ENVOI!="undefined"||e.ENVOI!=""){
                            queryU+=" Num_envoi=:nenv,";
                            updateOptions['nenv']=e.ENVOI?parseInt(e.ENVOI):resultat[0].Num_envoi?resultat[0].Num_envoi:null;
                        }       
                        if(typeof e.CHEQUE!="undefined"||e.CHEQUE!=""){
                            queryU+=" cheque=:c,";
                            updateOptions['c']=e.CHEQUE?parseInt(e.CHEQUE):resultat[0].cheque?resultat[0].cheque:null;
                        }
                        if(typeof e.MONTANT!="undefined"||e.MONTANT!=""){
                            queryU+=" MNTGT=:mnt,";
                            updateOptions['mnt']=e.MONTANT?parseInt(e.MONTANT):resultat[0].MNTGT?resultat[0].MNTGT:null;
                        }
                        if(typeof e.BANQUE!="undefined"||e.BANQUE!=""){
                            queryU+=" banque=:ban,";
                            updateOptions['ban']=e.BANQUE?e.BANQUE:resultat[0].banque?resultat[0].banque:null;
                        }
                        if(typeof e.MODE_REGLEMENT!="undefined"||e.MODE_REGLEMENT!=""){
                            queryU+=" MRGGT=:mrggt,";
                            updateOptions['mrggt']=e.MODE_REGLEMENT?e.MODE_REGLEMENT:resultat[0].MRGGT?resultat[0].MRGGT:null;
                        }
                        if(typeof e.POLICE!="undefined"||e.POLICE!=""){
                            queryU+=" wnupo=:p,";
                            updateOptions['p']=e.POLICE?parseInt(e.POLICE):resultat[0].wnupo?resultat[0].wnupo:null;
                        }
                        if(typeof e.REGLEMENT!="undefined"||e.REGLEMENT!=""){
                            queryU+=" wnrgt=:rgt,";
                            updateOptions['rgt']=e.REGLEMENT?parseInt(e.REGLEMENT):resultat[0].wnrgt?resultat[0].wnrgt:null;
                        }
                        if(typeof e.DOMAINE!="undefined"||e.DOMAINE!=""){
                            queryU+=" domaine=:dom,";
                            updateOptions['dom']=e.DOMAINE?e.DOMAINE:resultat[0].domaine?resultat[0].domaine:null;
                        }
                        if(typeof e.DATE_ENTREE_TRESO!="undefined"||e.DATE_ENTREE_TRESO!=""){
                            queryU+=" date_depot_treso=:ddt,";
                            console.log("date depot treso du fichier");
                            console.log(moment(e.DATE_ENTREE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"));
                            updateOptions['ddt']=typeof e.DATE_ENTREE_TRESO!="undefined"?moment(e.DATE_ENTREE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"):resultat[0].date_depot_treso?resultat[0].date_depot_treso:null;
                        }
                        if(typeof e.DATE_SORTIE_TRESO!="undefined"||e.DATE_SORTIE_TRESO!=""){
                            queryU+=" date_sort_treso=:dst,";
                            console.log("date sortie treso du fichier");
                            console.log(moment(e.DATE_SORTIE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"));
                            updateOptions['dst']=typeof e.DATE_SORTIE_TRESO!="undefined"?moment(e.DATE_SORTIE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"):resultat[0].date_sort_treso?resultat[0].date_sort_treso:null;
                        }
                        if(typeof e.DATE_ENTREE_SIGNATURE!="undefined"||e.DATE_ENTREE_SIGNATURE!=""){
                            queryU+=" date_depot_sign=:dds,";
                            console.log("date entree signature du fichier");
                            console.log(moment(e.DATE_ENTREE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"));
                            updateOptions['dds']=typeof e.DATE_ENTREE_SIGNATURE!="undefined"?moment(e.DATE_ENTREE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"):resultat[0].date_depot_sign?resultat[0].date_depot_sign:null;
                        }
                        if(typeof e.DATE_SORTIE_SIGNATURE!="undefined"||e.DATE_SORTIE_SIGNATURE!=""){
                            queryU+=" date_recep_sign_reg=:drsr,";
                            
                            console.log("date sortie signature du fichier");
                            console.log(moment(e.DATE_SORTIE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"));
                            updateOptions['drsr']=typeof e.DATE_SORTIE_SIGNATURE!="undefined"?moment(e.DATE_SORTIE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"):resultat[0].date_recep_sign_reg?resultat[0].date_recep_sign_reg:null;
                        }
                        if(typeof e.DATE_RETRAIT!="undefined"||e.DATE_RETRAIT!=""){
                            queryU+=" date_retrait_reg=:drr,";
                            console.log("date retrait du fichier");
                            console.log(moment(e.DATE_RETRAIT, "DD/MM/YYYY").format("YYYY-MM-DD"));
                            updateOptions['drr']=typeof e.DATE_RETRAIT!="undefined"?moment(e.DATE_RETRAIT, "DD/MM/YYYY").format("YYYY-MM-DD"):resultat[0].date_retrait_reg?resultat[0].date_retrait_reg:null;
                        }
                        
                        if(typeof e.COMMENTAIRE!="undefined"||e.COMMENTAIRE!=""){
                            if(e.COMMENTAIRE.includes("REJET")){
                                statut="REJET";
                                queryU+=" statut_reg_retirer=:srr,Comments='"+e.COMMENTAIRE+'%MAN%$'+e.PRESTATION+"!',redac=:r,";
                                updateOptions['srr']=e.COMMENTAIRE.includes("REJET")?statut:resultat[0].statut_reg_retirer;
                            }else{
                                updateOptions['srr']= statut; 
                                queryU+=` statut_reg_retirer=:srr,Comments='${typeof e.COMMENTAIRE!="undefined"?e.COMMENTAIRE+'%MAN%$'+e.PRESTATION+'!':e.MODE_REGLEMENT=="C"?"LIEU:Siège Nsia Vie Assurances"+'%MAN%$'+e.PRESTATION+'!':'%MAN%$'+e.PRESTATION+'!'}',redac=:r,`;
                            }
                            

                        }
                        //suprrime la derniere virgule avant le where
                        queryU=queryU.replace(/.$/,"");
                        queryU+=` where wnrgt=:rgt and domaine=:dom and wnupo=:p`;
                        updateOptions['r']=redac.codeRedac;
                        
                        console.log("about to update rgt manuel");
                        DBSQLSERVER.query(queryU,{
                            replacements:updateOptions,
                            type:DBSQLSERVER.QueryTypes.UPDATE
                        }).catch((err)=>{
                            console.log(err);
                            throw new Meteor.Error("bad-coderej","Une erreur est survenue lors de la mise à jour veuillez vérifier votre fichier");
                            return err.reason;
                        });
                        //envoi des sms suite a mise a jour via fichier
                        let sms="";
                        let canSendmap={ok:false,typergt:""};
                        let lelieu="";
                        if(e.MODE_REGLEMENT=="C" && e.DATE_SORTIE_SIGNATURE!="" && resultat[resultat.length-1].statut_reg_retirer!="PRET"||resultat[resultat.length-1].statut_reg_retirer!="SORTIE"){
                            canSendmap.ok=true;
                            canSendmap.typergt="C";
                            sms=`cher(e) client(e), le chèque pour votre prestation du ${e.DATE_RECEPTION_DEMANDE} est disponible pour retrait à ${lelieu}.Infoline 22419800`;
                            if(typeof e.COMMENTAIRE!="undefined"||e.COMMENTAIRE!=""){
                                if(e.COMMENTAIRE.includes("LIEU:")){
                                    lelieu=e.COMMENTAIRE.substring(e.COMMENTAIRE.lastIndexOf(':')+1).trim();
                                    console.log("le lieu en update "+lelieu);
                                }
                            }else{
                                lelieu="LIEU:Siège Nsia Vie Assurances".substring(5).trim();
                            }
                        }else if(e.MODE_REGLEMENT=="E" &&  e.DATE_RETRAIT!="" && resultat[resultat.length-1].statut_reg_retirer!="SORTIE"){
                            canSendmap.ok=true;
                            canSendmap.typergt="E";
                            sms=`Cher(e) client(e), le règlement de votre prestation a été fait sur votre compte mobile money le ${e.DATE_RETRAIT!=""?e.DATE_RETRAIT:" "}. Merci de votre fidélité. Infoline 22419800`;

                        }else if(e.MODE_REGLEMENT=="B" && e.DATE_RETRAIT!="" && resultat[resultat.length-1].statut_reg_retirer!="SORTIE"){
                            canSendmap.ok=true;
                            canSendmap.typergt="B";
                            sms=`le règlement de votre prestation a été effectué par virement bancaire sur votre compte le ${e.DATE_RETRAIT}.Merci de votre fidélité. Infoline 22419800`;

                        }
                        //vrai envoi de sms pour les mises à jour de rgt
                        if(typeof e.TELEPHONE!="undefined"){
                            nbrgt4sms++;
                            if(canSendmap.ok){
                                if(process.env.SMSONOFF==="YES"){
                                    axios.post(wsSMS,{
                                        username:"GESDREG",
                                        password:"GESDREG",
                                        telephone:e.TELEPHONE,
                                        expeditor:"Nsia Vie CI",
                                        typeEnvoi:`Disponibilié des règlements ${canSendmap.typergt=="C"?"cheques":canSendmap.typergt=="B"?"bancaires":"mobiles"} du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                        sms:sms,
                                    }).then((r)=>{
                                        console.log("envoi des sms");
                                        console.dir(r.data);
                                        let json=r.data;
                                        if(json.status===200){
                                            //envoi a l'api GESMS effectué
                                            message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                        }else{
                                            message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                        }
                                        message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                        //on envoi le rapport d4envoi des sms par mail
                                        //if(nbrgt4sms>0)
                                        Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],process.env.CCMAIL,`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
    
                                    });
                                }
                            }
                        }
                        
                    }else{
                        console.log("about to insert rgt manuel");
                            if(resultat.length<2){
                                DBSQLSERVER.query(query,{
                                    replacements:{
                                    
                                        ddt:e.DATE_ENTREE_TRESO?moment(e.DATE_ENTREE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"):null,
                                        dst:e.DATE_SORTIE_TRESO?moment(e.DATE_SORTIE_TRESO, "DD/MM/YYYY").format("YYYY-MM-DD"):null,
                                        dds:e.DATE_ENTREE_SIGNATURE?moment(e.DATE_ENTREE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"):null,
                                        drsr:e.DATE_SORTIE_SIGNATURE?moment(e.DATE_SORTIE_SIGNATURE, "DD/MM/YYYY").format("YYYY-MM-DD"):null,
                                        drr:e.DATE_RETRAIT?moment(e.DATE_RETRAIT, "DD/MM/YYYY").format("YYYY-MM-DD"):null,
                                        r:redac.codeRedac,
                                        srr:statut,
                                        p:e.POLICE,
                                        rgt:e.REGLEMENT,
                                        mnt:e.MONTANT,
                                        nb:e.BENEFICIAIRE,
                                        dom:e.DOMAINE,
                                        nenv:e.ENVOI?parseInt(e.ENVOI):null,
                                        c:e.CHEQUE?parseInt(e.CHEQUE):null,
                                        mrggt:e.MODE_REGLEMENT,
                                        ban:e.BANQUE?e.BANQUE:null,
                                        com:typeof e.COMMENTAIRE!="undefined"?e.COMMENTAIRE+'%MAN%$'+e.PRESTATION+'!':e.MODE_REGLEMENT=="C"?"LIEU:Siège Nsia Vie Assurances"+'%MAN%$'+e.PRESTATION+'!':'%MAN%$'+e.PRESTATION+'!',
                                    },
                                    type:DBSQLSERVER.QueryTypes.INSERT
                                }).catch((err)=>{
                                    console.log(err);
                                    throw new Meteor.Error("bad-coderej","Une erreur est survenue lors de la mise à jour veuillez vérifier votre fichier");
                                    return err.reason;
                                });
                                
                                //on fait l'envoi des sms et du mail rapport
                                if(typeof e.TELEPHONE!="undefined"){
                                    let sms="";
                                    let lelieu="";
                                    if(e.MODE_REGLEMENT=="C"){
                                        if(statut=="PRET"){
                                            if(typeof e.COMMENTAIRE=="undefined"||!e.COMMENTAIRE.includes("LIEU:"))
                                            lelieu="LIEU:Siège Nsia Vie Assurances".substring(5).trim();
                                            else lelieu=e.COMMENTAIRE.substring(e.COMMENTAIRE.lastIndexOf(':')+1).trim();
                                            console.log("le lieu en update "+lelieu);
                                                //ENVOI POUR LES CHEQUES
                                                //si la mise a jour mettra le reglement cheque a PRET donc disponible on peut proceder a l'envoi du sms
                                                    //get the string after it
                                                    nbrgt4sms++;
                                                    sms=`cher(e) client(e), le chèque pour votre prestation du ${e.DATE_RECEPTION_DEMANDE} est disponible pour retrait à ${lelieu}.Infoline 22419800`;
                                                    let getphonequery="select dbo.contact_id(:wasrg) as TELEPHONE";
                                                    if(process.env.SMSONOFF==="YES"){
                                                        axios.post(wsSMS,{
                                                            username:"GESDREG",
                                                            password:"GESDREG",
                                                            telephone:e.TELEPHONE,
                                                            expeditor:"Nsia Vie CI",
                                                            typeEnvoi:`Disponibilié des règlements cheques du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                            sms:sms,
                                                        }).then((r)=>{
                                                            console.log("envoi des sms");
                                                            console.dir(r.data);
                                                            let json=r.data;
                                                            if(json.status===200){
                                                                //envoi a l'api GESMS effectué
                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                            }else{
                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                            }
                                                            message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                            //on envoi le rapport d4envoi des sms par mail
                                                            //if(nbrgt4sms>0)
                                                            Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],process.env.CCMAIL,`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
            
                                                        });
                                                    }
                

                                                
                                            
                                        }
                                    }else if(e.MODE_REGLEMENT=="B"){
                                        if(statut=="SORTIE"){
                                            nbrgt4sms++;
                                            sms=`le règlement de votre prestation a été effectué par virement bancaire sur votre compte le ${e.DATE_RETRAIT}.Merci de votre fidélité. Infoline 22419800`;
                                            if(process.env.SMSONOFF==="YES"){
                                                axios.post(wsSMS,{
                                                    username:"GESDREG",
                                                    password:"GESDREG",
                                                    telephone:e.TELEPHONE,
                                                    expeditor:"Nsia Vie CI",
                                                    typeEnvoi:`Disponibilié des règlements bancaires du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                    sms:sms,
                                                }).then((r)=>{
                                                    console.log("envoi des sms");
                                                    console.dir(r.data);
                                                    let json=r.data;
                                                    if(json.status===200){
                                                        //envoi a l'api GESMS effectué
                                                        message+=`<p>Client:${resultat.nom_beneficiaire} | police:${resultat.wnupo} | règlement:${resultat.wnrgt} | mode de règlement:${resultat.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                    }else{
                                                        message+=`<p>Client:${resultat.nom_beneficiaire} | police:${resultat.wnupo} | règlement:${resultat.wnrgt} | mode de règlement:${resultat.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                    }
                                                    message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                    //on envoi le rapport d4envoi des sms par mail
                                                    //if(nbrgt4sms>0)
                                                    Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],process.env.CCMAIL,`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
    
                                                });
                                            }
                                        
                                        }
                                    }else if(e.MODE_REGLEMENT=="E"){
                                        if(statut=="SORTIE"){
                                            nbrgt4sms++;
                                            sms=`Cher(e) client(e), le règlement de votre prestation a été fait sur votre compte mobile money le ${e.DATE_RETRAIT}. Merci de votre fidélité. Infoline 22419800`;
                                            if(process.env.SMSONOFF==="YES"){
                                                axios.post(wsSMS,{
                                                    username:"GESDREG",
                                                    password:"GESDREG",
                                                    telephone:e.TELEPHONE,
                                                    expeditor:"Nsia Vie CI",
                                                    typeEnvoi:`Disponibilié des règlements mobiles du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                    sms:sms,
                                                }).then((r)=>{
                                                    console.log("envoi des sms");
                                                    console.dir(r.data);
                                                    let json=r.data;
                                                    if(json.status===200){
                                                        //envoi a l'api GESMS effectué
                                                        message+=`<p>Client:${resultat.nom_beneficiaire} | police:${resultat.wnupo} | règlement:${resultat.wnrgt} | mode de règlement:${resultat.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                    }else{
                                                        message+=`<p>Client:${resultat.nom_beneficiaire} | police:${resultat.wnupo} | règlement:${resultat.wnrgt} | mode de règlement:${resultat.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                    }
                                                    message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                    //on envoi le rapport d4envoi des sms par mail
                                                    //if(nbrgt4sms>0)
                                                    Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],process.env.CCMAIL,`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
    
                                                });
                                            }
                                        }
                                    }
                                }
                                
                                
                            }else{
                                throw new Meteor.Error("bad-coderej","Veuillez vérifier la ligne "+(i+2)+" du fichier des règlements manuels.le règlement existe déjà");

                            }
                    }

                }));
                return countRes;
                
            });
            

           

        },
        updateDispos(values,rgtArray,numenv){
            //mise a jour groupee des reglement
            console.log("numenv est "+numenv);
            let prom;
            let query;
            let checkStatutQuery;
            let comment;
            let getPoliceQuery="select wnupo,MNTGT from exp.regdispo";
            const redac=Meteor.users.findOne({_id:Meteor.user()._id});
            let message=`<p>Bonjour cher tous, <br/>Les envois de sms de disponibilités des règlements ont été effectués ce jour via GESDREG suite à une mise à jour de ${redac.codeRedac}</p>`;
            let nbrgt4sms=0;
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
                   if(values.coderej){
                    if(values.coderej.includes("REJET")){
                        statut="REJET"
                    }
                   }
                   
                   /*if(values.delreg){
                       console.log("contents of delreg");
                       console.dir(values.delreg);
                       var rgtEx = values.delreg.match(/\d+/g).map(Number);
                       console.log("les rgt a exclure sont:");
                       console.dir(rgtEx);
                       query="and wnrgt not in (";
                       rgtEx.map((e,i)=>{
                        if(i==rgtEx.length-1){
                            query+=e+')';
                        }else{
                            query+=e+',';
                        }
                       });
                       console.log(query);
                       //return;
                   }*/
                   console.log("values.statut");
                   console.log(values.statut);
                    if(numenv){
                        query="update exp.regdispo set"; 
                        checkStatutQuery="select * from exp.regdispo";
                        let queryOpts={};
                        if(values.date_depot_treso){
                            queryOpts.ddt=moment(values.date_depot_treso).format("YYYY-MM-DD");
                            query+=" date_depot_treso=:ddt,";
                        }
                        if(values.date_sort_treso){
                            queryOpts.dst=moment(values.date_sort_treso).format("YYYY-MM-DD");
                            query+=" date_sort_treso=:dst,";
                        }
                        if(values.date_depot_sign){
                            queryOpts.dds=moment(values.date_depot_sign).format("YYYY-MM-DD");
                            query+=" date_depot_sign=:dds,";
                        }
                        if(values.date_recep_sign_reg){
                            queryOpts.drsr=moment(values.date_recep_sign_reg).format("YYYY-MM-DD");
                            query+=" date_recep_sign_reg=:drsr,";
                        }
                        if(values.date_retrait_reg){
                            queryOpts.drr=moment(values.date_retrait_reg).format("YYYY-MM-DD");
                            query+=" date_retrait_reg=:drr,";
                        }
                        console.log("statut value");
                        console.log(values.statut);
                        query+=" redac=:r,statut_reg_retirer=:srr";
                        queryOpts.r=redac.codeRedac;
                        queryOpts.srr=values.statut?values.statut:statut;
                        queryOpts.cdr=values.coderej?values.coderej:'';
                        queryOpts.n=numenv;
                        let cdr="";
                        if(values.coderej && values.coderej!=""){
                            if(typeof parseInt(values.coderej,10) !="number"){
                                throw new Meteor.Error("bad-coderej","Veuillez re verifier le code rejet renseigné.Seulement les nombres sont acceptés.");

                            }
                            query+=`,Comments=:cdr`;
                        }
                        query+=" where Num_envoi=:n";
                        getPoliceQuery+=" where Num_envoi=:n";
                        checkStatutQuery+=" where statut_reg_retirer <>'SORTIE' and Num_envoi=:n";

                        // rgtArray.map((e,i,arr)=>{
                        //     if(i==arr.length-1){
                        //         query+=`${e.wnrgt})`;
                        //         getPoliceQuery+=`${e.wnrgt})`;
                        //         return;
                        //     }
                        //     query+=`${e.wnrgt},`;
                        //     getPoliceQuery+=`${e.wnrgt},`;
                        // });
                        if(values.delreg){
                            var rgtEx = values.delreg.match(/\d+/g).map(Number);
                            query+=" and wnrgt not in (";
                            getPoliceQuery+=" and wnrgt not in (";
                            checkStatutQuery+=" and wnrgt not in (";
                            rgtEx.map((e,i)=>{
                                if(i==rgtEx.length-1){
                                    query+=e+')';
                                    getPoliceQuery+=e+')';
                                    checkStatutQuery+=e+')';
                                }else{
                                    query+=e+',';
                                    getPoliceQuery+=e+',';
                                    checkStatutQuery+=e+',';
                                }
                            });
                            console.log(query+"\n"+checkStatutQuery);
                           // query+="and wnrgt not in ()";
                           
                        }
                        Historique.insert({
                            dateConnexion:new Date(),
                            heure:moment(Date.now()).format("HH:mm:ss"),
                            actions:"Mise a jour de date sur les reglements de l'envoi "+numenv,
                            par:redac.codeRedac
                        });
                        //faire l'envoi des sms et mail ici pour les numeros d'envois
                        //avant d'executer l'update on verifie que le statut des reglements de l'envoi
                        //n'est pas déjà à sortie
                         
                         let promises=[];
                         promises.push(Promise.all([DBSQLSERVER.query(checkStatutQuery,{
                            replacements:{
                                n:numenv
                            },
                            type:DBSQLSERVER.QueryTypes.SELECT
                        }).then((arr)=>{
                            if(arr.length>0){
                                //on peut donc procéder à la mise à jour 
                                DBSQLSERVER.query(query,{
                                    replacements:queryOpts,
                                    type:DBSQLSERVER.QueryTypes.UPDATE
                                }).catch((err)=>{
                                    console.log(err);
                                    return err.reason;
                                });
                                //on boucle donc sur le tableau renvoyé pour effectuer les envoi de sms
                                arr.map((e)=>{
                                    //vrai envoi de sms
                                    nbrgt4sms++;
                                    let sms=`le règlement de votre prestation a été effectué par virement bancaire sur votre compte le ${moment(values.date_retrait_reg).format("DD-MM-YYYY")}.Merci de votre fidélité. Infoline 22419800`;
                                    let getphonequery="select dbo.contact_id(:wasrg) as TELEPHONE";
                                    DBSQLSERVER.query(getphonequery,{
                                            replacements:{
                                                wasrg:e.wasrg,   
                                            },
                                            type:DBSQLSERVER.QueryTypes.SELECT
                                        }).then((phoneR)=>{
                                            
                                            console.log("numero de telephone est: "+phoneR[0].TELEPHONE);
                                            let number='';
                                            if(isNaN(parseInt(phoneR[0].TELEPHONE))){
                                                console.log("numero non valide");
                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${phoneR.TELEPHONE} | envoi de sms effectué: NON | sms:${sms}</p>`;
                                            }else if(phoneR[0].TELEPHONE.length>8){
                                                if(phoneR[0].TELEPHONE.includes("/")){
                                                    //get the strings before and after the /
                                                    let numarray=phoneR[0].TELEPHONE.split('/');
                                                    //verifie que l'on a affaire a de bons numeros mobile et non des fixes
                                                    if(!numarray[0].startsWith("22")||!numarray[0].startsWith("21")||!numarray[0].startsWith("20")||!numarray[0].startsWith("23")||!numarray[0].startsWith("24")){
                                                        //on peut envoyer le sms sur ce numero
                                                        number=numarray[0];
                                                    }else if(!numarray[1].startsWith("22")||!numarray[1].startsWith("21")||!numarray[1].startsWith("20")||!numarray[1].startsWith("23")||!numarray[1].startsWith("24")){
                                                        //on envoi sur le deuxieme numero en base
                                                        number=numarray[1];
                                                    }
                                                }
                                            }else{
                                                if(!phoneR[0].TELEPHONE.startsWith("22")||!phoneR[0].TELEPHONE.startsWith("21")||!phoneR[0].TELEPHONE.startsWith("20")||!phoneR[0].TELEPHONE.startsWith("23")||!phoneR[0].TELEPHONE.startsWith("24")){
                                                    //on peut envoyer le sms sur ce numero
                                                    number=phoneR[0].TELEPHONE;
                                                }
                                            }
                                            
                                            if(process.env.SMSONOFF==="YES"){
                                                axios.post(wsSMS,{
                                                    username:"GESDREG",
                                                    password:"GESDREG",
                                                    telephone:number,
                                                    expeditor:"Nsia Vie CI",
                                                    typeEnvoi:`Disponibilié des règlements bancaires du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                    sms:sms,
                                                }).then((r)=>{
                                                    console.log("envoi des sms");
                                                    console.dir(r.data);
                                                    let json=r.data;
                                                    if(json.status===200){
                                                        //envoi a l'api GESMS effectué
                                                        message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                    }else{
                                                        message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                    }
                                                    message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                    //on envoi le rapport d4envoi des sms par mail
                                                    //if(nbrgt4sms>0)
                                                    Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],process.env.CCMAIL,`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
                                        
                                                });
                                            }
                                            
                                        });
                                });
                                
                            }
                        }).catch((err)=>{
                            console.log(err);
                            return err.reason;
                        })]));
                        
                        //ici on fait un recapitulatif du total des lignes de lenvoi et leur montant
                        promises.push(Promise.all([DBSQLSERVER.query(getPoliceQuery,{
                            replacements:{
                                n:numenv
                            },
                            type:DBSQLSERVER.QueryTypes.SELECT
                        })]).then((v)=>{
                            //console.log("value of v");
                            //console.dir(v);
                            //calcul des valeurs de retour nbligne et montant cumul
                            let endres={};
                            endres.lignes=v[0].length;
                            endres.montant=0;
                            v[0].map((e,i,arr)=>{
                                console.dir(e);
                                endres.montant+=parseInt(e.MNTGT)
                            });
                            console.dir(endres);
                            return endres;
                        }));
                        return Promise.all(promises); 
                        
                    }else{
                        query="update exp.regdispo set";
                        let queryOpts={};
                        if(values.date_depot_treso){
                            queryOpts.ddt=moment(values.date_depot_treso).format("YYYY-MM-DD");
                            query+=" date_depot_treso=:ddt,";
                        }
                        if(values.date_sort_treso){
                            queryOpts.dst=moment(values.date_sort_treso).format("YYYY-MM-DD");
                            query+=" date_sort_treso=:dst,";
                        }
                        if(values.date_depot_sign){
                            queryOpts.dds=moment(values.date_depot_sign).format("YYYY-MM-DD");
                            query+=" date_depot_sign=:dds,";
                        }
                        if(values.date_recep_sign_reg){
                            queryOpts.drsr=moment(values.date_recep_sign_reg).format("YYYY-MM-DD");
                            query+=" date_recep_sign_reg=:drsr,";
                        }
                        if(values.date_retrait_reg){
                            queryOpts.drr=moment(values.date_retrait_reg).format("YYYY-MM-DD");
                            query+=" date_retrait_reg=:drr,";
                        }
                        
                        query+=" comments=:com,redac=:r,statut_reg_retirer=:srr where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d ";
                        queryOpts.com=values.coderej?values.coderej:"LIEU:Siège Nsia Vie Assurances";
                        queryOpts.r=redac.codeRedac;
                        queryOpts.srr=values.statut?values.statut:statut;
                        if(values.delreg){
                            var rgtEx = values.delreg.match(/\d+/g).map(Number);
                            query+="and wnrgt not in (";
                            rgtEx.map((e,i)=>{
                                if(i==rgtEx.length-1){
                                    query+=e+')';
                                }else{
                                    query+=e+',';
                                }
                            });
                            console.log(query);
                           // query+="and wnrgt not in ()";
                        }
                        rgtArray.forEach((e,i,arr)=>{
                            console.log("ligne de rgt: "+i);
                            Historique.insert({
                                 dateConnexion:new Date(),
                                 heure:moment(Date.now()).format("HH:mm:ss"),
                                 actions:"Mise a jour de date sur le reglement "+e.wnrgt,
                                 par:redac.codeRedac
                             });
                             queryOpts.wnrgt=e.wnrgt;
                             queryOpts.wnupo=e.wnupo;
                             queryOpts.d=e.domaine;
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
                                        //  if(values.date_depot_treso 
                                        //      && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                        //      && moment(values.date_depot_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                        //      ){
                                        //          throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement");
                                        //      }
                                        //      else if(values.date_depot_treso 
                                        //          &&(values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                        //          &&( values.date_sort_treso?moment(values.date_depot_treso).diff(moment(values.date_sort_treso))>0:false
                                        //          || values.date_depot_sign? moment(values.date_depot_treso).diff(moment(values.date_depot_sign))>0:false
                                        //          || values.date_recep_sign_reg? moment(values.date_depot_treso).diff(moment(values.date_recep_sign_reg))>0:false
                                        //          || values.date_retrait_reg? moment(values.date_depot_treso).diff(moment(values.date_retrait_reg))>0:false
                                                 
                                        //              )
                                                 
                                        //          ){
                                        //              throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot à la trésorerie du règlement "+e.wnrgt+" . Elle ne peut être après la date de sortie de trésorerie ou les dates de depot et retour de signature ou encore la date du retrait du règlement 1");
                                        //          }
                                        //      else if(values.date_sort_treso 
                                        //         // && moment(e.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_REGLEMENT.replace(/\//g,"-"))
                                        //          && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                        //          && moment(values.date_sort_treso).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                        //      ){
                                        //              throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement");
                                        //          }
                                        //    /*  else if(p.date_depot_treso && moment(values.date_sort_treso).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))){
                                        //          throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie que vous avez précédemment saisie.");
                                        //      }*/
                                        //      else if(values.date_sort_treso 
                                        //         &&(values.date_depot_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
                                        //         &&(values.date_depot_treso? moment(values.date_sort_treso).diff(moment(values.date_depot_treso))<0:false
                                        //          ||values.date_depot_sign?  moment(values.date_sort_treso).diff(moment(values.date_depot_sign))>0:false
                                        //          || values.date_recep_sign_reg? moment(values.date_sort_treso).diff(moment(values.date_recep_sign_reg))>0:false
                                        //          ||values.date_retrait_reg?  moment(values.date_sort_treso).diff(moment(values.date_retrait_reg))>0:false
                                        //              )
                                               
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de sortie de trésorerie du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou après les dates de depot et retour de signature ou encore la date du retrait du règlement 2");
                                                    
                                        //         }
                                        //     else if(values.date_depot_sign 
                                        //         && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                        //         && moment(values.date_depot_sign).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement ");
                                        //         }
                                        //     /*else if(moment(values.date_depot_sign).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_depot_sign).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie ou avant la date de sortie de trésorerie qui ont été saisies précédemment.");
                                        //         }*/
                                        //     else if(values.date_depot_sign 
                                        //         &&(values.date_depot_treso||values.date_sort_treso||values.date_recep_sign_reg||values.date_retrait_reg)
                                        //         &&( values.date_depot_treso?moment(values.date_depot_sign).diff(moment(values.date_depot_treso))<0:false
                                        //          ||  values.date_sort_treso?moment(values.date_depot_sign).diff(moment(values.date_sort_treso))<0:false
                                        //          ||  values.date_recep_sign_reg? moment(values.date_depot_sign).diff(moment(values.date_recep_sign_reg))>0:false
                                        //          || values.date_retrait_reg? moment(values.date_depot_sign).diff(moment(values.date_retrait_reg))>0:false
                                        //              )
                                               
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de dépot pour signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de dépot à la trésorerie ou la date de sortie de la trésorerie ,ni après la date de retour de signature ou encore la date du retrait du règlement");
                                                    
                                        //         }
                                        //     else if(values.date_recep_sign_reg 
                                        //         && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                        //         && moment(values.date_recep_sign_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" .Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement ");
                                        //         }
                                        //     /*else if(moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_recep_sign_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature.");    
                                        //         }*/
                                        //     else if(values.date_recep_sign_reg 
                                        //         &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_retrait_reg)
                                        //         &&( values.date_depot_treso?moment(values.date_recep_sign_reg).diff(moment(values.date_depot_treso))<0:false
                                        //          || values.date_sort_treso? moment(values.date_recep_sign_reg).diff(moment(values.date_sort_treso))<0:false
                                        //          ||  values.date_depot_sign?moment(values.date_recep_sign_reg).diff(moment(values.date_depot_sign))<0:false
                                        //          ||  values.date_retrait_reg?moment(values.date_recep_sign_reg).diff(moment(values.date_retrait_reg))>0:false
                                        //              )
                                                
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retour de signature du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie et la date de dépot à la signature ,ni après la date du retrait du règlement 4");
                                        //         }
                                        //     else if(values.date_retrait_reg 
                                        //         && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_RECEPTION)
                                        //         && moment(values.date_retrait_reg).isBefore(e.infoSurRgt[0].DATE_SURVENANCE_SINISTRE)
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement du règlement "+e.wnrgt+" . Elle ne peut être avant la date de survenance du sinistre ou la date de réception du règlement.");
                                        //         }
                                        //     /*else if(moment(values.date_retrait_reg).isBefore(moment(p.date_depot_treso).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_retrait_reg).isBefore(moment(p.date_sort_treso).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_retrait_reg).isBefore(moment(p.date_depot_sign).format("YYYY-MM-DD"))
                                        //         ||moment(values.date_retrait_reg).isBefore(moment(p.date_recep_sign_reg).format("YYYY-MM-DD"))){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature et la date de retour de signature.");
                                                  
                                        //         }*/
                                        //     else if(values.date_retrait_reg 
                                        //         &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg)
                                        //         &&( values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_depot_treso))<0:false
                                        //          || values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_sort_treso))<0:false
                                        //          || values.date_depot_treso? moment(values.date_retrait_reg).diff(moment(values.date_depot_sign))<0:false
                                        //          ||  values.date_depot_treso?moment(values.date_retrait_reg).diff(moment(values.date_recep_sign_reg))<0:false
                                        //              )
                                                
                                        //         ){
                                        //             throw new Meteor.Error("bad-date","Veuillez re verifier la date de retrait du règlement "+e.wnrgt+" . Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie,la date de dépot à la signature et la date de retour de signature 5");
                                                    
                                        //         }
                                        //      else{

                                                 DBSQLSERVER.query(query,{
                                                     replacements:queryOpts,
                                                     type:DBSQLSERVER.QueryTypes.UPDATE
                                                 }).catch((err)=>{
                                                     console.log(err);
                                                     return err.reason;
                                                 });
                                                //on verifie aue le sms n'a pas encore ete envoyer
                                                if(e.statut_reg_retirer!="PRET"||e.statut_reg_retirer!="SORTIE"){
                                                    console.log("lauching sms procedure");
                                                    if(values.statut=="PRET" ||values.date_recep_sign_reg){
                                                        //ENVOI POUR LES CHEQUES
                                                        if(typeof values.coderej=="undefined"||!values.coderej)
                                                        values.coderej="LIEU:Siège Nsia Vie Assurances";
                                                        //si la mise a jour mettra le reglement cheque a PRET donc disponible on peut proceder a l'envoi du sms
                                                        if(typeof values.coderej!="undefined" && values.coderej.includes("LIEU:")){
                                                            //get the string after it
                                                            nbrgt4sms++;
                                                            let lelieu=values.coderej.substring(5).trim();
                                                            let sms="";
                                                            if(e.MRGGT=="C"){
                                                                sms=`cher(e) client(e), le chèque pour votre prestation du ${englishDateToFr(e.infoSurRgt[0].DATE_RECEPTION)} est disponible pour retrait à ${lelieu}.Infoline 22419800`;
                                                            }
                                                            let getphonequery="select dbo.contact_id(:wasrg) as TELEPHONE";
                                                            DBSQLSERVER.query(getphonequery,{
                                                                    replacements:{
                                                                        wasrg:e.wasrg,   
                                                                    },
                                                                    type:DBSQLSERVER.QueryTypes.SELECT
                                                                }).then((phoneR)=>{
                                                                    console.log("numero de telephone est: "+phoneR[0].TELEPHONE);
                                                                    let number='';
                                                                    if(isNaN(parseInt(phoneR[0].TELEPHONE))){
                                                                        console.log("numero non valide");
                                                                        message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${phoneR[0].TELEPHONE} | envoi de sms effectué: NON | sms:${sms}</p>`;
                                                                    }else if(phoneR[0].TELEPHONE.length>8){
                                                                        if(phoneR[0].TELEPHONE.includes("/")){
                                                                            //get the strings before and after the /
                                                                            let numarray=phoneR[0].TELEPHONE.split('/');
                                                                            //verifie que l'on a affaire a de bons numeros mobile et non des fixes
                                                                            if(!numarray[0].startsWith("22")||!numarray[0].startsWith("21")||!numarray[0].startsWith("20")||!numarray[0].startsWith("23")||!numarray[0].startsWith("24")){
                                                                                //on peut envoyer le sms sur ce numero
                                                                                number=numarray[0];
                                                                            }else if(!numarray[1].startsWith("22")||!numarray[1].startsWith("21")||!numarray[1].startsWith("20")||!numarray[1].startsWith("23")||!numarray[1].startsWith("24")){
                                                                                //on envoi sur le deuxieme numero en base
                                                                                number=numarray[1];
                                                                            }
                                                                        }
                                                                    }else{
                                                                        if(!phoneR[0].TELEPHONE.startsWith("22")||!phoneR[0].TELEPHONE.startsWith("21")||!phoneR[0].TELEPHONE.startsWith("20")||!phoneR[0].TELEPHONE.startsWith("23")||!phoneR[0].TELEPHONE.startsWith("24")){
                                                                            //on peut envoyer le sms sur ce numero
                                                                            number=phoneR[0].TELEPHONE;
                                                                        }
                                                                    }
                                                                    if(process.env.SMSONOFF==="YES"){
                                                                        axios.post(wsSMS,{
                                                                            username:"GESDREG",
                                                                            password:"GESDREG",
                                                                            telephone:number,
                                                                            expeditor:"Nsia Vie CI",
                                                                            typeEnvoi:`Disponibilié des règlements cheques du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                                            sms:sms,
                                                                        }).then((r)=>{
                                                                            console.log("envoi des sms");
                                                                            console.dir(r.data);
                                                                            let json=r.data;
                                                                            if(json.status===200){
                                                                                //envoi a l'api GESMS effectué
                                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                                            }else{
                                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                                            }
                                                                            message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                                            //on envoi le rapport d4envoi des sms par mail
                                                                            //if(nbrgt4sms>0)
                                                                            Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],"thibaut.zehi@groupensia.com",`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
                                                                
                                                                        });
                                                                    }
                                                                    
                                                                });
                        
            
                                                        }
                                                    }else if((values.statut=="SORTIE"||values.date_retrait_reg)&& e.MRGGT!="B"){
                                                        //ENVOI DES SMS MOBILE MONEY
                                                        let sms="";
                                                        nbrgt4sms++;
                                                        if(e.MRGGT=="E"){
                                                          sms=`Cher(e) client(e), le règlement de votre prestation a été fait sur votre compte mobile money le ${values.date_retrait_reg?moment(values.date_retrait_reg).format("DD-MM-YYYY"):englishDateToFr(e.date_retrait_reg)}. Merci de votre fidélité. Infoline 22419800`;
                                                        }
                                                        let getphonequery="select dbo.contact_id(:wasrg) as TELEPHONE";
                                                            DBSQLSERVER.query(getphonequery,{
                                                                    replacements:{
                                                                        wasrg:e.wasrg,   
                                                                    },
                                                                    type:DBSQLSERVER.QueryTypes.SELECT
                                                                }).then((phoneR)=>{
                                                                    console.log("numero de telephone est: "+phoneR[0].TELEPHONE);
                                                                    let number='';
                                                                    if(isNaN(parseInt(phoneR[0].TELEPHONE))){
                                                                        console.log("numero non valide");
                                                                        message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${phoneR[0].TELEPHONE} | envoi de sms effectué: NON | sms:${sms}</p>`;
                                                                    }else if(phoneR[0].TELEPHONE.length>8){
                                                                        if(phoneR[0].TELEPHONE.includes("/")){
                                                                            //get the strings before and after the /
                                                                            let numarray=phoneR[0].TELEPHONE.split('/');
                                                                            //verifie que l'on a affaire a de bons numeros mobile et non des fixes
                                                                            if(!numarray[0].startsWith("22")||!numarray[0].startsWith("21")||!numarray[0].startsWith("20")||!numarray[0].startsWith("23")||!numarray[0].startsWith("24")){
                                                                                //on peut envoyer le sms sur ce numero
                                                                                number=numarray[0];
                                                                            }else if(!numarray[1].startsWith("22")||!numarray[1].startsWith("21")||!numarray[1].startsWith("20")||!numarray[1].startsWith("23")||!numarray[1].startsWith("24")){
                                                                                //on envoi sur le deuxieme numero en base
                                                                                number=numarray[1];
                                                                            }
                                                                        }
                                                                    }else{
                                                                        if(!phoneR[0].TELEPHONE.startsWith("22")||!phoneR[0].TELEPHONE.startsWith("21")||!phoneR[0].TELEPHONE.startsWith("20")||!phoneR[0].TELEPHONE.startsWith("23")||!phoneR[0].TELEPHONE.startsWith("24")){
                                                                            //on peut envoyer le sms sur ce numero
                                                                            number=phoneR[0].TELEPHONE;
                                                                        }
                                                                    }
                                                                    
                                                                    if(process.env.SMSONOFF==="YES"){
                                                                        axios.post(wsSMS,{
                                                                            username:"GESDREG",
                                                                            password:"GESDREG",
                                                                            telephone:number,
                                                                            expeditor:"Nsia Vie CI",
                                                                            typeEnvoi:`Disponibilié des règlements mobiles du ${moment(Date.now()).format("DD-MM-YYY")}`,
                                                                            sms:sms,
                                                                        }).then((r)=>{
                                                                            console.log("envoi des sms");
                                                                            console.dir(r.data);
                                                                            let json=r.data;
                                                                            if(json.status===200){
                                                                                //envoi a l'api GESMS effectué
                                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: OUI | sms:${sms}</p>`;
    
                                                                            }else{
                                                                                message+=`<p>Client:${e.nom_beneficiaire} | police:${e.wnupo} | règlement:${e.wnrgt} | mode de règlement:${e.MRGGT} | téléphone:${number} | envoi de sms effectué: NON | sms:${sms}</p>`;
    
                                                                            }
                                                                            message+="<p>Cordialement.<br/>Cet email est auto-généré</p>"
                                                                            //on envoi le rapport d4envoi des sms par mail
                                                                            //if(nbrgt4sms>0)
                                                                            Meteor.call("sendEmail",[redac.email,Meteor.settings.ADMINMAIL],"thibaut.zehi@groupensia.com",`Envoi des sms de disponibilité de règlement via GESDREG du ${moment(Date.now()).format("DD-MM-YYYY")}`,message);
                                                                
                                                                        });
                                                                    }
                                                                    
                                                                });
                                                    }
                                                }

     
                                            // }
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
                case "REJET":
                     query="update exp.regdispo set statut_reg_retirer=:stat, Comments=:com where wnupo=:wnupo and wnrgt=:wnrgt and domaine=:d "; 
                    comment=values.comments===""||!values.comments?"REJET par le gestionnaire "+redac.codeRedac:values.comments;
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
                                        stat:"REJET",
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



