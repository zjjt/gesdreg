import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';
import {FilesCollection} from 'meteor/ostrio:files';


let WhatsNew=new Mongo.Collection('WhatsNew');
let RegUpdated=new Mongo.Collection('RegUpdated');
let Historique=new Mongo.Collection('Historique');
let RgtManuel=new FilesCollection({
    storagePath:process.env.PWD+'/FICHIERS/rgtmanuel/',
     namingFunction(){
         return 'rgtmanuel'
     },
     collectionName:'RgtManuel',
     allowClientCode:false,
     onBeforeunloadMessage(){
         if(Meteor.isClient){
             alert("Le fichier est toujours en cours de téléchargement.Veuillez patienter...");
         }else
         {
             return 'Le fichier est toujours en cours de téléchargement.Veuillez patienter...';
         }
         
     },
     onBeforeUpload(file){
         //allow file size under 10mb and only xlsx or xls
         if(file.size<=10485760 && /xls|xlsx/i.test(file.extension)){
             return true;
         }else{ 
             if(Meteor.isClient){
             alert("Veuillez fournir un fichier excel xls ou xlsx. ");
             }else{
                 return 'Veuillez fournir un fichier excel xls ou xlsx. ';
             }
             
         }
     },
 });
export {WhatsNew,RegUpdated,Historique,RgtManuel};