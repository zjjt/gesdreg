import { SubmissionError } from 'redux-form';
import {miseajourDispoBank} from '../../redux/actions/user-actions.js';
import {isEmptyObject,isEmptyObjectProps} from '../../utils/utilitaires';
import store from '../../redux/store';



export const submitBankForm=(values)=>{
    alert(JSON.stringify(values));
    const{log}=console;
    let comment="";
    console.dir(values);
    if(isEmptyObject(values)){
        log(isEmptyObject(values))
        alert("Veuillez faire un choix pour valider le retrait du règlement 1");
        //throw new SubmissionError({choixbank:"Veuillez faire un choix pour valider le règlement",_error:"submit_failed"});    
        return  
    }else{
        log("here in submit function");
        if(isEmptyObjectProps(values,"choixbank")){
            alert("Veuillez faire un choix pour valider le retrait du règlement 2");
            
           // throw new SubmissionError({choixbank:"Veuillez faire un choix pour valider le règlement",_error:"submit_failed"});    
            //return false;   
        }
        if(!isEmptyObjectProps(values,"choixbank") && values.choixbank=="OUI"){
            comment="R.A.S";
        }
        else if(!isEmptyObjectProps(values,"choixbank") && values.choixbank=="NON"){
            comment=isEmptyObjectProps(values,"comment") ?"refuser par la banque":values.comment;
        }
        values.comment=comment;
        alert(JSON.stringify(values));
        console.dir(values);
        store.dispatch(miseajourDispoBank());
        return;
        //

        /* Meteor.call('updateDispos',values,this.props.regSelected,(err)=>{
           if(err){
               
               if(err.error==="bad-date"){
                   this.setState({
                   errorMsg:err.reason
                   });
               }else{
                   console.log("Erreur survenue: "+err.reason);
               }
                   
               this._dialogOpen();
           }else{
               this.setState({
               snackMsg:`Mise à jour éffectuée`,
               snackOpen:true
               });
               //dispatch(miseajourDispo());
               this.props.closeBigDialog();
           }
       });*/
    }
       
   
};  