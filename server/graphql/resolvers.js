import {Meteor} from 'meteor/meteor';
import {DBSQL,DBSQLSERVER,userSQL,dispoSQL} from './connectors.js';
import {formatNumberInMoney,uniq,checkRdvDate} from '../../imports/utils/utilitaires';
import {withFilter } from 'graphql-subscriptions';
import Sequelize from 'sequelize';
const Promise=require('bluebird');
import { PubSub } from 'graphql-subscriptions';
/*sqlServconn.run((err)=>{
    if(err)
        throw err;
        console.log(sqlServconn.tables);
});*/
/*DBSQL.sync();
DBSQL.authenticate().then(()=>{
    console.log('Connection MySql etablie');
}).catch(()=>{
    console.log('Impossible de se connecter a Mysql,veuillez reverifier');
});*/
//==============
DBSQLSERVER.sync();
DBSQLSERVER.authenticate().then(()=>{
    console.log('Connection MsSql etablie');
}).catch((e)=>{
    console.dir(e);
    console.log('Impossible de se connecter a MsSql,veuillez reverifier');
});

export const pubsub = new PubSub();
 const resolvers={
    Query:{
        user(_,args){
            if(args.username){
                return Meteor.users.find({username:args.username}).fetch();
            }else if(args.username==="allstar"){
                return Meteor.users.find({}).fetch();
            }else{
                return [];
            }
        },
        userSQL(_,args){
            if(args.nom &&(args.orderDesc||!args.orderDesc)){
                return userSQL.findAll({attributes:{exclude:['id']},where:{
                    nom:{
                            $like:'%'+args.nom+'%'
                         }
                }});
            }else if(args.orderDesc){
                return userSQL.findAll({attributes:{exclude:['id']},order:[['nom','DESC']]});
            }else{
                return userSQL.findAll({attributes:{exclude:['id']},order:[['nom','ASC']]});
            }
        },
        async listeDispo(_,args){
            console.log("in list dispo");
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            let chequeQuery="select Dbo.check_etat_cheq(:numcheque) as chequeState";   
           // let chainer=new Sequelize.Utils.QueryChainer();
            //si on a la date,et pas de statut,de domaine,de num_regl et on ne veut pas afficher seulment ceux kon a edite et non ordoner par num_regl
            if(args.typeDate && args.date && !args.statut && !args.domaine && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd ){
                let l=null;
                switch(args.typeDate){
                    case "date_naiss":
                        
                         l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],
                            where:{
                                date_naiss:args.date,
                            },offset:args.offset,limit:args.limit

                        }).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    e.cheque=e.cheque==null?0:e.cheque;
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;
                
                   
                    case "date_depot_treso":
                    
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_treso:args.date,
                            
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    e.cheque=e.cheque==null?0:e.cheque;
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;
                    case "date_sort_treso":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_sort_treso:args.date,
                            
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;
                    case "date_depot_sign":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_sign:args.date,
                           
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;
                    case "date_recep_sign_reg":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_recep_sign_reg:args.date,
                            
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_retrait_reg":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_retrait_reg:args.date,
                            
                    },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                            case "dateRDV":
                            l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                                    dateRDV:args.date,
                                    
                            },offset:args.offset,limit:args.limit}).then((res)=>{
                                        let promises=[];
                                        let dispo;
                                        res.forEach((r)=>{
                                            promises.push(
                                                Promise.all([
                                                DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((infosurrgt)=>{
                                                    dispo=r.toJSON();
                                                    infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                        infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                                    dispo.infoSurRgt=infosurrgt;
                                                    dispo.etat=checkRdvDate(dispo);
                                                    if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                                    return dispo;
                                                })
                                            );
                                            if(r.cheque && !r.Comments.includes("%MAN%")){
                                                promises.push(
                                                    Promise.all([
                                                        DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                        ]).spread((chequeState)=>{
                                                            dispo=r.toJSON();
                                                            dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                            return dispo;
                                                        })
                                                   );
                                               }
                                        });
                                        return Promise.all(promises)
                                        
                                    }).then((dispos)=>{
                                        let nd=dispos.map((e,i,arr)=>{
                                            if(e.infoSurRgt.length>1){
                                                let goodelem=e.infoSurRgt[0];
                                                //console.log("reglement "+e.wnrgt);
                                                //console.dir(e);
                                                e.infoSurRgt=[];
                                                e.infoSurRgt.push(goodelem);
                                            }
                                            if(e.chequeState==null ||!e.cheque)
                                                e.chequeState="INCONNU";
                                            return e;
                                        });
                                        //console.dir(nd);
                                        
                                         return nd;
                                    }); 
                                    return l; 
                }
                
            }else if(args.typeDate && args.date && args.statut && !args.domaine && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
                let l=null;
                switch(args.typeDate){
                    case "date_naiss":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_naiss:args.date,
                            statut_reg_retirer:args.statut
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_depot_treso":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_treso:args.date,
                            statut_reg_retirer:args.statut
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_sort_treso":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_sort_treso:args.date,
                             statut_reg_retirer:args.statut
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_depot_sign":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_sign:args.date,
                           statut_reg_retirer:args.statut 
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_recep_sign_reg":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_recep_sign_reg:args.date,
                            statut_reg_retirer:args.statut 
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                    case "date_retrait_reg":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_retrait_reg:args.date,
                             statut_reg_retirer:args.statut
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            return l;
                            case "dateRDV":
                             l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                                     dateRDV:args.date,
                                     statut_reg_retirer:args.statut
                                },offset:args.offset,limit:args.limit}).then((res)=>{
                                        let promises=[];
                                        let dispo;
                                        res.forEach((r)=>{
                                            promises.push(
                                                Promise.all([
                                                DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((infosurrgt)=>{
                                                    dispo=r.toJSON();
                                                    infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                        infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                                    dispo.infoSurRgt=infosurrgt;
                                                    dispo.etat=checkRdvDate(dispo);
                                                    if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                                    return dispo;
                                                })
                                            );
                                            if(r.cheque && !r.Comments.includes("%MAN%")){
                                                promises.push(
                                                    Promise.all([
                                                        DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                        ]).spread((chequeState)=>{
                                                            dispo=r.toJSON();
                                                            dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                            return dispo;
                                                        })
                                                   );
                                               }
                                        });
                                        return Promise.all(promises)
                                        
                                    }).then((dispos)=>{
                                        let nd=dispos.map((e,i,arr)=>{
                                            if(e.infoSurRgt.length>1){
                                                let goodelem=e.infoSurRgt[0];
                                                //console.log("reglement "+e.wnrgt);
                                                //console.dir(e);
                                                e.infoSurRgt=[];
                                                e.infoSurRgt.push(goodelem);
                                            }
                                            if(e.chequeState==null ||!e.cheque)
                                                e.chequeState="INCONNU";
                                            return e;
                                        });
                                        //console.dir(nd);
                                        
                                         return nd;
                                    });
                                    return l;
                }
                
            }else if(args.typeDate && args.date  && args.statut && args.domaine && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
                console.log(args.typeDate);
                let l=null;
                switch(args.typeDate){
                    case "date_naiss":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_naiss:args.date,
                            statut_reg_retirer:args.statut,
                            domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;
                    case "date_depot_treso":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_treso:args.date,
                            statut_reg_retirer:args.statut,
                            domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l; 
                    case "date_sort_treso":
                    l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_sort_treso:args.date,
                             statut_reg_retirer:args.statut,
                             domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;  
                    case "date_depot_sign":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_depot_sign:args.date,
                           statut_reg_retirer:args.statut ,
                           domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l; 
                    case "date_recep_sign_reg":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_recep_sign_reg:args.date,
                            statut_reg_retirer:args.statut ,
                            domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                //console.dir(nd);
                                 return nd;
                            });
                            return l;   
                    
                    case "date_retrait_reg":
                     l=await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                            date_retrait_reg:args.date,
                             statut_reg_retirer:args.statut,
                             domaine:args.domaine
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                               let nd=dispos.map((e,i,arr)=>{
                                if(e.infoSurRgt.length>1){
                                    let goodelem=e.infoSurRgt[0];
                                    //console.log("reglement "+e.wnrgt);
                                    //console.dir(e);
                                    e.infoSurRgt=[];
                                    e.infoSurRgt.push(goodelem);
                                }
                                if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                return e;
                            });
                            //console.dir(nd);
                             return nd;
                            });
                            return l;
                            case "dateRDV":
                            l= await dispoSQL.findAll({attributes:{exclude:['id']},order:[['wnrgt','DESC']],where:{
                                     dateRDV:args.date,
                                     statut_reg_retirer:args.statut,
                                     domaine:args.domaine
                                },offset:args.offset,limit:args.limit}).then((res)=>{
                                        let promises=[];
                                        let dispo;
                                        res.forEach((r)=>{
                                            promises.push(
                                                Promise.all([
                                                DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((infosurrgt)=>{
                                                    dispo=r.toJSON();
                                                    infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                        infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                                    dispo.infoSurRgt=infosurrgt;
                                                    dispo.etat=checkRdvDate(dispo);
                                                    if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                                    return dispo;
                                                })
                                            );
                                            if(r.cheque && !r.Comments.includes("%MAN%")){
                                                promises.push(
                                                    Promise.all([
                                                        DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                        ]).spread((chequeState)=>{
                                                            dispo=r.toJSON();
                                                            dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                            return dispo;
                                                        })
                                                   );
                                               }
                                            
                                        });
                                        return Promise.all(promises)
                                        
                                    }).then((dispos)=>{
                                       // console.dir(dispos);
                                       let nd=dispos.map((e,i,arr)=>{
                                        if(e.infoSurRgt.length>1){
                                            let goodelem=e.infoSurRgt[0];
                                            //console.log("reglement "+e.wnrgt);
                                            //console.dir(e);
                                            e.infoSurRgt=[];
                                            e.infoSurRgt.push(goodelem);
                                        }
                                        if(e.chequeState==null ||!e.cheque)
                                            e.chequeState="INCONNU";
                                        return e;
                                    });
                                    //console.dir(nd);
                                     return nd;
                                    });
                                    return l;
                    
                }
                
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
                console.log("son type est "+typeof args.numenv+"dans la requete du numero denvoi "+args.numenv);
               let l= await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             Num_envoi:parseInt(args.numenv,10)
                        },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                console.dir(dispos);
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                return nd;
                            });
                            return l;
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && !args.numenv && args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
                console.log("son type est "+typeof args.numregl);
               let l= await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             wnrgt:parseInt(args.numregl,10)
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                console.dir(dispos);
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                return nd;
                            });
                            return l;
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && !args.numenv && !args.numregl && args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
                let l=await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             wnupo:args.numpol
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                              let nd=dispos.map((e,i,arr)=>{
                                if(e.infoSurRgt.length>1){
                                    let goodelem=e.infoSurRgt[0];
                                    //console.log("reglement "+e.wnrgt);
                                    //console.dir(e);
                                    e.infoSurRgt=[];
                                    e.infoSurRgt.push(goodelem);
                                }
                                if(e.chequeState==null ||!e.cheque)
                                    e.chequeState="INCONNU";
                                return e;
                            });
                            return nd;
                            });
                            return l;
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && !args.numenv && !args.numregl && !args.numpol && args.nomtotal && !args.numreglStart && !args.numreglEnd){
               let l= await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 }
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                    
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                               let nd=dispos.map((e,i,arr)=>{
                                if(e.infoSurRgt.length>1){
                                    let goodelem=e.infoSurRgt[0];
                                    //console.log("reglement "+e.wnrgt);
                                    //console.dir(e);
                                    e.infoSurRgt=[];
                                    e.infoSurRgt.push(goodelem);
                                }
                                if(e.chequeState==null ||!e.cheque)
                                    e.chequeState="INCONNU";
                                return e;
                            });
                            return nd;
                            });
                            return l;
            }
            else if(!args.typeDate && !args.date && args.statut && !args.domaine && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
               let l= await dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             statut_reg_retirer:args.statut
                        },offset:args.offset,limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                            infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises).catch(reason=>{console.log(reason)})
                                
                            }).then((dispos)=>{
                                console.dir(dispos);
                                let nd=dispos.map((e,i,arr)=>{
                                    if(e.infoSurRgt.length>1){
                                        let goodelem=e.infoSurRgt[0];
                                        //console.log("reglement "+e.wnrgt);
                                        //console.dir(e);
                                        e.infoSurRgt=[];
                                        e.infoSurRgt.push(goodelem);
                                    }
                                    if(e.chequeState==null ||!e.cheque)
                                        e.chequeState="INCONNU";
                                    return e;
                                });
                                return nd;
                            });
                            return l;
            }
            else if(!args.typeDate && !args.date && !args.statut && args.domaine && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && !args.numreglStart && !args.numreglEnd){
               let l= await dispoSQL.findAll({
                    attributes:{exclude:['id']},
                    where:{domaine:args.domaine},
                    order:[['wnrgt','DESC']],
                    offset:args.offset,
                    limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                // console.dir(dispos);
                //on enleve les doublons dans l'array de inforeg dispo
                let nd=dispos.map((e,i,arr)=>{
                    if(e.infoSurRgt.length>1){
                        let goodelem=e.infoSurRgt[0];
                        //console.log("reglement "+e.wnrgt);
                        //console.dir(e);
                        e.infoSurRgt=[];
                        e.infoSurRgt.push(goodelem);
                    }
                    if(e.chequeState==null ||!e.cheque)
                        e.chequeState="INCONNU";
                    return e;
                });
                return nd;
                });
                return l;
            }
            else if(!args.typeDate && !args.date && !args.statut && !args.domaine  && !args.numenv && !args.numregl && !args.numpol && !args.nomtotal && args.numreglStart && args.numreglEnd){
               let l= await  dispoSQL.findAll({
                    attributes:{exclude:['id']},
                    where:{
                        wnrgt:{
                            $between:[args.numreglStart,args.numreglEnd]
                        }
                    },
                    order:[['wnrgt','DESC']],
                    offset:args.offset,
                    limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                // console.dir(dispos);
                //on enleve les doublons dans l'array de inforeg dispo
                let nd=dispos.map((e,i,arr)=>{
                    if(e.infoSurRgt.length>1){
                        let goodelem=e.infoSurRgt[0];
                        //console.log("reglement "+e.wnrgt);
                        //console.dir(e);
                        e.infoSurRgt=[];
                        e.infoSurRgt.push(goodelem);
                    }
                    if(e.chequeState==null ||!e.cheque)
                        e.chequeState="INCONNU";
                    return e;
                });
                return nd;
                });
                return l;
            }
            else{
                console.log("in list dispo else");
                //on affiche tout et on ordonne par date de la demande
               let l= await dispoSQL.findAll({
                                        attributes:{exclude:['id']},
                                        order:[['wnrgt','DESC']],
                                        offset:args.offset,
                                        limit:args.limit}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                            infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                    if(r.cheque && !r.Comments.includes("%MAN%")){
                                        promises.push(
                                            Promise.all([
                                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                                ]).spread((chequeState)=>{
                                                    dispo=r.toJSON();
                                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                                    return dispo;
                                                })
                                           );
                                       }
                                    /*promises.push(                                        Promise.all([                                            DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})                                            ]).spread((chequeState)=>{                                                dispo=r.toJSON();                                                dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;                                                return dispo;                                            })                                       );*/
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                               //on enleve les doublons dans l'array de inforeg dispo
                               let nd=dispos.map((e,i,arr)=>{
                                if(e.infoSurRgt.length>1){
                                    let goodelem=e.infoSurRgt[0];
                                    //console.log("reglement "+e.wnrgt);
                                    //console.dir(e);
                                    e.infoSurRgt=[];
                                    e.infoSurRgt.push(goodelem);
                                }
                                if(e.chequeState==null ||!e.cheque)
                                    e.chequeState="INCONNU";
                                return e;
                            });
                            return nd;
                            });
               return l;
            }
            
        },
        consultDispo(_,args){
            console.log("in consult dispo");
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            let uquery="select * from exp.reguser where redac like :red"; 
            let chequeQuery="select Dbo.check_etat_cheq(:numcheque) as chequeState";   
            //Avec une restriction sur lq date de rgt
            if(args.startDate && args.endDate && !args.numpolice && !args.numrgt && !args.numenv && !args.numcheque && !args.nomtotal && !args.birthdate){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_depot_treso:{
                           $between:[args.startDate,args.endDate]
                        }
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                   });
            }
            else if(args.startDate && args.endDate && args.numpolice && !args.numrgt && !args.numenv && !args.numcheque && !args.birthdate && !args.nomtotal){
                
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    date_depot_treso:{
                           $between:[args.startDate,args.endDate]
                        }
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                   });
 
            }
            else if(args.startDate && args.endDate && args.numpolice && !args.numrgt && !args.numenv && !args.numcheque && args.birthdate && !args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    date_naiss:args.birthdate,
                    date_depot_treso:{
                           $between:[args.startDate,args.endDate]
                        }
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                   });
 
            }
            else if(args.startDate && args.endDate && args.numpolice && args.birthdate && args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    nom_beneficiaire:{
                        $like:'%'+args.nomtotal+'%'
                    },
                    date_naiss:args.birthdate,
                    date_depot_treso:{
                           $between:[args.startDate,args.endDate]
                        }
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                   });
 
            }
            else if(!args.startDate && !args.endDate && args.numpolice && args.birthdate && !args.numrgt && !args.numenv && !args.nomtotal && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    date_naiss:args.birthdate,
                    // statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numpolice && !args.birthdate && !args.numrgt && !args.numenv && args.nomtotal && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && args.birthdate && !args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    // statut_reg_retirer:'PRET'
            },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                let promises=[];
                let dispo;
                res.forEach((r)=>{
                    promises.push(
                        Promise.all([
                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                        ]).spread((redac)=>{
                            dispo=r.toJSON();
                            dispo.infosRedac=redac;
                            return dispo;
                        })
                    );
                    if(r.cheque && !r.Comments.includes("%MAN%")){
                        promises.push(
                            Promise.all([
                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                ]).spread((chequeState)=>{
                                    dispo=r.toJSON();
                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                    return dispo;
                                })
                           );
                       }
                    promises.push(
                        Promise.all([
                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                        ]).spread((infosurrgt)=>{
                            dispo=r.toJSON();
                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                            infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                            dispo.infoSurRgt=infosurrgt;
                            dispo.etat=checkRdvDate(dispo);
                            if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                            return dispo;
                        })
                    );
                });
                return Promise.all(promises)
                
            }).then((dispos)=>{
                let nd=dispos.map((e,i,arr)=>{
                    if(e.infoSurRgt.length>1){
                        let goodelem=e.infoSurRgt[0];
                        //console.log("reglement "+e.wnrgt);
                        //console.dir(e);
                        e.infoSurRgt=[];
                        e.infoSurRgt.push(goodelem);
                    }
                    if(e.chequeState==null ||!e.cheque)
                        e.chequeState="INCONNU";
                    return e;
                });
                return nd;
            });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && args.birthdate && args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && !args.birthdate && args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                    // statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numpolice && args.birthdate && args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    date_naiss:args.birthdate,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numpolice && !args.birthdate && !args.nomtotal && !args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && !args.birthdate && !args.nomtotal && args.numrgt && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && !args.birthdate && !args.nomtotal && !args.numrgt && args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    Num_envoi:parseInt(args.numenv),
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numpolice && !args.birthdate && !args.nomtotal && !args.numrgt && !args.numenv && args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    cheque:parseInt(args.numcheque),
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        if(r.cheque && !r.Comments.includes("%MAN%")){
                            promises.push(
                                Promise.all([
                                    DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                    ]).spread((chequeState)=>{
                                        dispo=r.toJSON();
                                        dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                        return dispo;
                                    })
                               );
                           }
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
                    let nd=dispos.map((e,i,arr)=>{
                        if(e.infoSurRgt.length>1){
                            let goodelem=e.infoSurRgt[0];
                            //console.log("reglement "+e.wnrgt);
                            //console.dir(e);
                            e.infoSurRgt=[];
                            e.infoSurRgt.push(goodelem);
                        }
                        if(e.chequeState==null ||!e.cheque)
                            e.chequeState="INCONNU";
                        return e;
                    });
                    return nd;
                });
 
            }else{
                console.log("in consult dispo else");
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                   //statut_reg_retirer:'PRET'
                   redac:{
                       $not:"ADM"
                   }
               },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                   let promises=[];
                   let dispo;
                   res.forEach((r)=>{
                       
                       promises.push(
                           Promise.all([
                           DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                           ]).spread((redac)=>{
                               dispo=r.toJSON();
                               dispo.infosRedac=redac;
                               return dispo;
                           })
                       );
                       if(r.cheque && !r.Comments.includes("%MAN%")){
                        promises.push(
                            Promise.all([
                                DBSQLSERVER.query(chequeQuery,{ replacements:{numcheque:r.cheque},type:DBSQLSERVER.QueryTypes.SELECT})
                                ]).spread((chequeState)=>{
                                    dispo=r.toJSON();
                                    dispo.chequeState=chequeState[0].chequeState==null?"INCONNU":chequeState[0].chequeState;
                                    return dispo;
                                })
                           );
                       }
                       
                       promises.push(
                           Promise.all([
                           DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                           ]).spread((infosurrgt)=>{
                               dispo=r.toJSON();
                               infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                               infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                               dispo.infoSurRgt=infosurrgt;
                               dispo.etat=checkRdvDate(dispo);
                               if(typeof dispo.etat == "undefined")
                                   dispo.etat={
                                       nbj:-1,
                                       alerte:"ERROR"
                                       };
                               return dispo;
                           })
                       );
                   });
                   return Promise.all(promises)
                   
               }).then((dispos)=>{
                let nd=dispos.map((e,i,arr)=>{
                    if(e.infoSurRgt.length>1){
                        let goodelem=e.infoSurRgt[0];
                        //console.log("reglement "+e.wnrgt);
                        //console.dir(e);
                        e.infoSurRgt=[];
                        e.infoSurRgt.push(goodelem);
                    }
                    if(e.chequeState==null ||!e.cheque)
                        e.chequeState="INCONNU";
                    return e;
                });
                return nd;
               });
           }
        },

        
        consultDispoBank(_,args){
            console.log("in consultDispoBank");
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            let uquery="select * from exp.reguser where redac like :red"; 
            //Avec une restriction sur lq date de rgt
            if(args.startDate && args.endDate && !args.numrgt && !args.nomtotal && !args.birthdate && !args.numpolice && args.banque && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_retrait_reg:{
                           $between:[args.startDate,args.endDate]
                        },
                        statut_reg_retirer:'SORTIE',
                        banque:args.banque,
                        /*$or:[
                            {
                                statut_reg_retirer:'SORTIE'
                            },
                            {
                                statut_reg_retirer:'REFUSER'
                            }
                        ]*/
                        
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                   infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
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
                       //console.dir(nd);
                       
                        return nd;
                   });
            }
            else if(args.startDate && args.endDate && args.numrgt && !args.birthdate && args.banque && !args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){

                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numrgt),
                    date_retrait_reg:{
                           $between:[args.startDate,args.endDate]
                        },
                        statut_reg_retirer:'SORTIE',
                        banque:args.banque,
                        /*$or:[
                            {
                                wnupo:{
                                    $like:'731%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'732%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'724%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7245%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'784%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7845%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'760%'
                                }
                            },
                        ]*/
                       /* $or:[
                            {
                                statut_reg_retirer:'SORTIE'
                            },
                            {
                                statut_reg_retirer:'REFUSER'
                            }
                        ]*/
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
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
                       //console.dir(nd);
                       
                        return nd;
                   });
 
            }
            else if(args.startDate && args.endDate && args.numrgt && args.banque && args.birthdate && !args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    date_naiss:args.birthdate,
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                   /* $or:[
                        {
                            statut_reg_retirer:'SORTIE'
                        },
                        {
                            statut_reg_retirer:'REFUSER'
                        }
                    ],*/
                    date_retrait_reg:{
                           $between:[args.startDate,args.endDate]
                        },
                        /*$or:[
                            {
                                wnupo:{
                                    $like:'731%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'732%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'724%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7245%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'784%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7845%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'760%'
                                }
                            },
                        ]*/
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
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
                       //console.dir(nd);
                       
                        return nd;
                   });
 
            }
            else if(args.startDate && args.endDate && args.banque && args.numrgt && args.birthdate && args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    nom_beneficiaire:{
                        $like:'%'+args.nomtotal+'%'
                    },
                    date_naiss:args.birthdate,
                    date_retrait_reg:{
                           $between:[args.startDate,args.endDate]
                        },
                        statut_reg_retirer:'SORTIE',
                        banque:args.banque,
                        /*$or:[
                            {
                                wnupo:{
                                    $like:'731%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'732%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'724%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7245%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'784%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'7845%'
                                }
                            },
                            {
                                wnupo:{
                                    $like:'760%'
                                }
                            },
                        ]*/
                        /*$or:[
                            {
                                statut_reg_retirer:'SORTIE'
                            },
                            {
                                statut_reg_retirer:'REFUSER'
                            }
                        ]*/
               },order:[['wnrgt','DESC']]}).then((res)=>{
                       let promises=[];
                       let dispo;
                       res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                           promises.push(
                               Promise.all([
                               DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                               ]).spread((infosurrgt)=>{
                                   dispo=r.toJSON();
                                   infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                    infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                   dispo.infoSurRgt=infosurrgt;
                                   dispo.etat=checkRdvDate(dispo);
                                   if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                   return dispo;
                               })
                           );
                       });
                       return Promise.all(promises)
                       
                   }).then((dispos)=>{
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
                       //console.dir(nd);
                       
                        return nd;
                   });
 
            }
            else if(!args.startDate && !args.endDate && args.numrgt && args.banque && args.birthdate && !args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    date_naiss:args.birthdate,
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                    /*$or:[
                        {
                            statut_reg_retirer:'SORTIE'
                        },
                        {
                            statut_reg_retirer:'REFUSER'
                        }
                    ]*/
                    // statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numrgt && args.banque && !args.birthdate && args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                                 /*$or:[
                                    {
                                        wnupo:{
                                            $like:'731%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'732%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'724%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'7245%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'784%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'7845%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'760%'
                                        }
                                    },
                                 ]*/
                   /* $or:[
                            {
                                statut_reg_retirer:'SORTIE'
                            },
                            {
                                statut_reg_retirer:'REFUSER'
                            }
                    ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numrgt && args.banque && !args.birthdate && !args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                   /* $or:[
                            {
                                statut_reg_retirer:'SORTIE'
                            },
                            {
                                statut_reg_retirer:'REFUSER'
                            }
                    ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && args.birthdate && args.banque && !args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                    /*$or:[
                        {
                            statut_reg_retirer:'SORTIE'
                        },
                        {
                            statut_reg_retirer:'REFUSER'
                        }
                    ]*/
                    // statut_reg_retirer:'PRET'
            },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                let promises=[];
                let dispo;
                res.forEach((r)=>{
                    promises.push(
                        Promise.all([
                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                        ]).spread((redac)=>{
                            dispo=r.toJSON();
                            dispo.infosRedac=redac;
                            return dispo;
                        })
                    );
                    promises.push(
                        Promise.all([
                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                        ]).spread((infosurrgt)=>{
                            dispo=r.toJSON();
                            infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                            infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                            dispo.infoSurRgt=infosurrgt;
                            dispo.etat=checkRdvDate(dispo);
                            if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                            return dispo;
                        })
                    );
                });
                return Promise.all(promises)
                
            }).then((dispos)=>{
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
                //console.dir(nd);
                
                 return nd;
            });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && args.birthdate && args.banque && args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                                 /*$or:[
                                    {
                                        wnupo:{
                                            $like:'731%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'732%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'724%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'7245%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'784%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'7845%'
                                        }
                                    },
                                    {
                                        wnupo:{
                                            $like:'760%'
                                        }
                                    },
                                ]*/
                                 /*$or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && !args.birthdate && args.nomtotal && args.banque && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                                 statut_reg_retirer:'SORTIE',
                                 banque:args.banque,
                       /* $or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                                 /*$or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                    // statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && args.numrgt && args.banque && args.birthdate && args.nomtotal && !args.numpolice && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnrgt:parseInt(args.numrgt),
                    date_naiss:args.birthdate,
                    statut_reg_retirer:'SORTIE',
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal+'%'
                                 },
                    banque:args.banque,
                    /*$or:[
                    {
                        wnupo:{
                            $like:'731%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'732%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'724%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'7245%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'784%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'7845%'
                        }
                    },
                    {
                        wnupo:{
                            $like:'760%'
                        }
                    },
                ]*/
                                /* $or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && !args.birthdate && !args.nomtotal && args.numpolice && args.banque && !args.numenv && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:parseInt(args.numpolice),
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                                /* $or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnupo','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && !args.birthdate && !args.nomtotal && !args.numpolice && args.numenv && args.banque && !args.numcheque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    Num_envoi:parseInt(args.numenv),
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                                /* $or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnupo','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(!args.startDate && !args.endDate && !args.numrgt && !args.birthdate && !args.nomtotal && !args.numpolice && !args.numenv && args.numcheque && args.banque){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    cheque:parseInt(args.numcheque),
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                                /* $or:[
                                    {
                                        statut_reg_retirer:'SORTIE'
                                    },
                                    {
                                        statut_reg_retirer:'REFUSER'
                                    }
                                 ]*/
                     //statut_reg_retirer:'PRET'
                },order:[['wnupo','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
 
            }else if(args.banque!=""){
                 return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    //statut_reg_retirer:'PRET'
                    //MRGGT:'C',
                    statut_reg_retirer:'SORTIE',
                    banque:args.banque,
                    /*$or:[
                        {
                            wnupo:{
                                $like:'731%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'732%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'724%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7245%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'784%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'7845%'
                            }
                        },
                        {
                            wnupo:{
                                $like:'760%'
                            }
                        },
                    ]*/
                    /*$or:[
                        {
                            statut_reg_retirer:'SORTIE'
                        },
                        {
                            statut_reg_retirer:'REFUSER'
                        }
                    ]*/
                },order:[['wnrgt','DESC']],offset:args.offset,limit:args.limit}).then((res)=>{
                    let promises=[];
                    let dispo;
                    res.forEach((r)=>{
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((redac)=>{
                                dispo=r.toJSON();
                                dispo.infosRedac=redac;
                                return dispo;
                            })
                        );
                        promises.push(
                            Promise.all([
                            DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                            ]).spread((infosurrgt)=>{
                                dispo=r.toJSON();
                                infosurrgt.MONTANT_BRUT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_BRUT,10));
                                infosurrgt.MONTANT_NET_REGLEMENT=formatNumberInMoney(parseInt(infosurrgt.MONTANT_NET_REGLEMENT,10));
                                dispo.infoSurRgt=infosurrgt;
                                dispo.etat=checkRdvDate(dispo);
                                if(typeof dispo.etat == "undefined")
                                    dispo.etat={
                                        nbj:-1,
                                        alerte:"ERROR"
                                        };
                                return dispo;
                            })
                        );
                    });
                    return Promise.all(promises)
                    
                }).then((dispos)=>{
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
                    //console.dir(nd);
                    
                     return nd;
                });
            }
        },
        dataToExport(_,args){
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            let uquery="select * from exp.reguser where redac like :red"; 
            if(args.typeDate && args.startDate && args.endDate && (!args.domaine||args.domaine==="TOUS") ){
                switch(args.typeDate){
                    case "date_depot_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_depot_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_sort_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_depot_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_sort_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_sort_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_recep_sign_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_retrait_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                        case "date_naiss":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_naiss:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                }
            }else if(args.typeDate && args.startDate && args.endDate && args.domaine && args.domaine!=="TOUS" ){
                switch(args.typeDate){
                    case "date_depot_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                            domaine:args.domaine,
                             date_depot_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_sort_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_depot_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_sort_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_sort_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_recep_sign_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_retrait_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                            
                        case "date_naiss":
                         return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_naiss:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        },order:[['wnrgt','DESC']]}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(uquery,{ replacements:{red:r.redac},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((redac)=>{
                                            dispo=r.toJSON();
                                            dispo.infosRedac=redac;
                                            return dispo;
                                        })
                                    );
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                            dispo.etat=checkRdvDate(dispo);
                                            if(typeof dispo.etat == "undefined")
                                                dispo.etat={
                                                    nbj:-1,
                                                    alerte:"ERROR"
                                                    };
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
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
                                //console.dir(nd);
                                
                                 return nd;
                            });
                }
            }else{
                return [];
            }

        },
         voirInfoReg(_,args){
             if(!args.wnrgt && !args.domaine)
                return [];
             else{
                 let query="exec info_reg_dispo :numero_reg,:domaine ";
                return DBSQLSERVER.query(query,{
                                replacements:{
                                    numero_reg:args.wnrgt,
                                    domaine:args.domaine
                                },
                                type:DBSQLSERVER.QueryTypes.SELECT
                            });
             }
                 
        },
        
           
           

       
    },
    Mutation:{
        deleteUsers(_,args){
             const codeArr=args.usercodes;
            Meteor.users.remove({codeRedac:{
                $in:codeArr
            }});
            userSQL.destroy({where:{
                    Redac:codeArr
                }});
             return userSQL.findAll({attributes:{exclude:['id']},order:[['Nom','DESC']]});
        }
    },
    Subscription: {
        rgtUpdated: {
          subscribe: pubsub.asyncIterator('rgtUpdated'),
          resolve: (payload) => payload,
          
        }
      }
};

 

export default resolvers;