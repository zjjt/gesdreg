import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import Sequelize from 'sequelize';
import {userSQL,dispoSQL,DBSQL,DBSQLSERVER} from '../imports/api/graphql/connectors.js';
import {moment} from 'meteor/momentjs:moment';

const json2xls=require('json2xls');




export default ()=>{
    Meteor.methods({
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
                                codeRedac:values.codeRedac.toUpperCase(),
                            }
                        })){
                            //DBSQL.sync();
                              return userSQL.create({
                                    ulogin:values.username,
                                    mdp:values.passwordconf,
                                    nom:values.nom,
                                    prenom:values.prenom,
                                    redac:values.codeRedac.toUpperCase()
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
        updateDispo(newval,initialValues){
            console.dir(newval);
            let statut="EN COURS";
            newval.date_depot_treso=newval.date_depot_treso?newval.date_depot_treso:null;
                    newval.date_sort_treso=newval.date_sort_treso?newval.date_sort_treso:null;
                    newval.date_depot_sign=newval.date_depot_sign?newval.date_depot_sign:null;
                    newval.date_recep_sign_reg= newval.date_recep_sign_reg? newval.date_recep_sign_reg:null;
                    newval.date_retrait_reg=newval.date_retrait_reg?newval.date_retrait_reg:null;
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
            const redac=Meteor.users.findOne({_id:Meteor.userId});
            dispoSQL.findOne({where:{wnrgt:newval.wnrgt,wasrg:newval.wasrg}}).then((e)=>{
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
            });
            /////////////////////////////              
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


