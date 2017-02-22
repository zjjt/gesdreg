import {Meteor} from 'meteor/meteor';
import {DBSQL,DBSQLSERVER,userSQL,dispoSQL} from './connectors.js';
import Sequelize from 'sequelize';
const Promise=require('bluebird');

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
}).catch(()=>{
    console.log('Impossible de se connecter a MsSql,veuillez reverifier');
});


 const resolvers={
    Query:{
        user(_,args){
            if(args.username){
                return Meteor.users.find({username:args.username}).fetch();
            }else{
                return Meteor.users.find({}).fetch();
            }
        },
        userSQL(_,args){
            if(args.nom &&(args.orderDesc||!args.orderDesc)){
                return userSQL.findAll({attributes:{exclude:['id']},where:{
                    nom:{
                            $like:'%'+args.nom
                         }
                }});
            }else if(args.orderDesc){
                return userSQL.findAll({attributes:{exclude:['id']},order:[['nom','DESC']]});
            }else{
                return userSQL.findAll({attributes:{exclude:['id']},order:[['nom','ASC']]});
            }
        },
        listeDispo(_,args){
            let query="exec info_reg_dispo :numero_reg,:domaine ";
           // let chainer=new Sequelize.Utils.QueryChainer();
            //si on a la date,et pas de statut,de domaine,de num_regl et on ne veut pas afficher seulment ceux kon a edite et non ordoner par num_regl
            if(args.typeDate && args.date && !args.statut && !args.domaine && !args.numregl && !args.numpol && !args.nomtotal ){
                
                switch(args.typeDate){
                    case "date_naiss":
                        
                        return dispoSQL.findAll({attributes:{exclude:['id']},
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                     
                
                   
                    case "date_depot_treso":
                    
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                   
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                    
                }
                
            }else if(args.typeDate && args.date && args.statut && !args.domaine && !args.numregl && !args.numpol && !args.nomtotal ){
                switch(args.typeDate){
                    case "date_naiss":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });

                    case "date_depot_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                   
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                }
                
            }else if(args.typeDate && args.date  && args.statut && args.domaine && !args.numregl && !args.numpol && !args.nomtotal ){
                switch(args.typeDate){
                    case "date_naiss":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });

                    case "date_depot_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                   
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    
                }
                
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && args.numregl && !args.numpol && !args.nomtotal ){
                 return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             wnrgt:args.numregl
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
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && !args.numregl && args.numpol && !args.nomtotal ){
                 return dispoSQL.findAll({attributes:{exclude:['id']},where:{
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
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
            }else if(!args.typeDate && !args.date && !args.statut && !args.domaine && !args.numregl && !args.numpol && args.nomtotal ){
                 return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             nom_beneficiaire:{
                                    $like:'%'+args.nomtotal
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
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
            }
            else{
                return [];
            }
            
        },consultDispo(_,args){
            if(args.numpolice && !args.birthdate && !args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:args.numpolice,
                     //statut_reg_retirer:'PRET'
            },offset:args.offset,limit:args.limit});
 
            }else if(args.numpolice && args.birthdate && !args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:args.numpolice,
                    date_naiss:args.birthdate,
                    // statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
 
            }else if(args.numpolice && !args.birthdate && args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:args.numpolice,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal
                                 },
                     //statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
 
            }else if(!args.numpolice && args.birthdate && !args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    // statut_reg_retirer:'PRET'
            },offset:args.offset,limit:args.limit});
 
            }else if(!args.numpolice && args.birthdate && args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    date_naiss:args.birthdate,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal
                                 },
                     //statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
 
            }else if(!args.numpolice && !args.birthdate && args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal
                                 },
                    // statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
 
            }else if(args.numpolice && args.birthdate && args.nomtotal){
                return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    wnupo:args.numpolice,
                    date_naiss:args.birthdate,
                    nom_beneficiaire:{
                                    $like:'%'+args.nomtotal
                                 },
                     //statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
 
            }else{
                 return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                    //statut_reg_retirer:'PRET'
                },offset:args.offset,limit:args.limit});
            }
        },
        dataToExport(_,args){
            let query="exec info_reg_dispo :numero_reg,:domaine ";
            if(args.typeDate && args.startDate && args.endDate && (!args.domaine||args.domaine==="TOUS") ){
                switch(args.typeDate){
                    case "date_depot_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_depot_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                console.dir(dispos);
                                return dispos;
                            });
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_sort_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_depot_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                    case "date_sort_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_sort_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_recep_sign_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_retrait_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
                        case "date_naiss":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_naiss:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
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
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    case "date_sort_treso":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_sort_treso:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
                    case "date_depot_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_depot_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
                            });
                    case "date_sort_sign":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_sort_sign:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
                    case "date_recep_sign_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_recep_sign_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                              //  console.dir(dispos);
                                return dispos;
                            });
                    case "date_retrait_reg":
                    return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                        domaine:args.domaine,
                             date_retrait_reg:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                                //console.dir(dispos);
                                return dispos;
                            });
                            
                        case "date_naiss":
                         return dispoSQL.findAll({attributes:{exclude:['id']},where:{
                             date_naiss:{
                                    $between:[args.startDate,args.endDate]
                                 }
                        }}).then((res)=>{
                                let promises=[];
                                let dispo;
                                res.forEach((r)=>{
                                    promises.push(
                                        Promise.all([
                                        DBSQLSERVER.query(query,{ replacements:{numero_reg:r.wnrgt,domaine:r.domaine},type:DBSQLSERVER.QueryTypes.SELECT})
                                        ]).spread((infosurrgt)=>{
                                            dispo=r.toJSON();
                                            dispo.infoSurRgt=infosurrgt;
                                        
                                            return dispo;
                                        })
                                    );
                                });
                                return Promise.all(promises)
                                
                            }).then((dispos)=>{
                               // console.dir(dispos);
                                return dispos;
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
    }
};
 /*
 const resolvers={
    Query:{
        user(_,args){
            if(args.username){
                return Meteor.users.find({username:args.username}).fetch();
            }else{
                return Meteor.users.find({}).fetch();
            }
        },
        userSQL(_,args){
            if(args.nom &&(args.orderDesc||!args.orderDesc)){
                return reguser.findAll({where:{
                    Nom:args.nom
                }});
            }else if(args.orderDesc){
                return reguser.findAll({order:[['Nom','DESC']]});
            }else{
                return reguser.findAll({order:[['Nom','ASC']]});
            }
        },
         dispolistSQL(_,args){
            if(args.wnrgt &&(args.orderDate||!args.orderDate)){
                return regdispo.findAll({where:{
                    wnrgt:args.wnrgt
                }});
            }else if(args.orderDate){
                return regdispo.findAll({order:[['date_depot_sign','DESC']]});
            }else{
                return regdispo.findAll({order:[['date_recep_sign_reg','ASC']]});
            }
        }
    },
    Mutation:{
        deleteUsers(_,args){
             const codeArr=args.usercodes;
            Meteor.users.remove({codeRedac:{
                $in:codeArr
            }});
            reguser.destroy({where:{
                    Redac:codeArr
                }});
             return reguser.findAll({order:[['Nom','DESC']]});
        }
    }
};

 */ 
 

export default resolvers;