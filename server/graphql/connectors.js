import Sequelize from 'sequelize';
import {Meteor} from 'meteor/meteor';
import casual from 'casual';
import _ from 'lodash';
import {moment} from 'meteor/momentjs:moment';



/*const DBSQL= new Sequelize('moduleRGT', 'root', 'root', {
    host:'localhost',
    port:'8889',
    dialect: 'mysql',
    //storage: './DB/moduleRGT.db',
});*/


const DBSQLSERVER= new Sequelize(Meteor.settings.DBSQLSERVER_DATABASE,Meteor.settings.DBSQLSERVER_USER, Meteor.settings.DBSQLSERVER_PASSWORD, {
    host:Meteor.settings.DBSQLSERVER_HOST,
    port:Meteor.settings.DBSQLSERVER_PORT,
    dialect: 'mssql',
    dialectOptions:{
      requestTimeout:1625000
    },
    //storage: './DB/moduleRGT.db',
});


//----------------------------------MODELS--------------------------------
const UserModel=DBSQLSERVER.define('reguser',{
    ulogin: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'ulogin'
    },
    mdp: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'mdp'
    },
    redac: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'redac',
     // primaryKey:true
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'role',
     // primaryKey:true
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'nom'
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'prenom'
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'email'
    }
        
},{
    schema:'exp',
    timestamps:false,
    freezeTableName:'reguser'
});

const regDispoModel=DBSQLSERVER.define('regdispo',{
  wasrg: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'wasrg',
      primaryKey:true
    },
    wnrgt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'wnrgt'
    },
    wnupo: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'wnupo'
    },
    nom_beneficiaire: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'nom_beneficiaire'
    },
    date_naiss: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_naiss'
    },
    date_depot_treso: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_depot_treso'
    },
    date_sort_treso: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_sort_treso'
    },
    date_depot_sign: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_depot_sign'
    },
    date_recep_sign_reg: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_recep_sign_reg'
    },
    date_retrait_reg: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'date_retrait_reg'
    },
    statut_reg_retirer: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'statut_reg_retirer'
    },
    domaine:{
      type: Sequelize.STRING,
      allowNull: true,
      field: 'domaine'
    },
    redac: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'redac'
    },
    MNTGT: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'MNTGT'
    },
    MRGGT: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'MRGGT'
    },
    dateRDV: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'dateRDV'
    },
    ValBank: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'ValBank'
    },
    Comments: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'Comments'
    },
    CommentsBank: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'CommentsBank'
    },   
    Num_envoi: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'Num_envoi'
    }, 
    banque: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'banque'
    }, 
    Comments: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'Comments'
    }, 
    cheque: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'cheque'
    },   
      
},{
    schema:'exp',
    timestamps:false,
    freezeTableName:'regdispo'
});

const dispoSQL=DBSQLSERVER.models.regdispo;
const userSQL=DBSQLSERVER.models.reguser;

export {userSQL,DBSQL,dispoSQL,DBSQLSERVER};

