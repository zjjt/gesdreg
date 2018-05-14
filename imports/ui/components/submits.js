import { SubmissionError } from 'redux-form'
import {miseajourDispoBank} from '../../redux/actions/user-actions.js'
import store from '../../redux/store';



export const submitBankForm=(values)=>{
       if(values.choixbank===''){  
       throw new SubmissionError({choixbank:"Veuillez faire un choix pour valider le règlement",_error:"MAJ bank failed"});    
       return false;   

   }else if(values.police==""){
    throw new SubmissionError({choixbank:"Une erreur systeme a été constatée, Veuillez contacter un administrateur pour ovus venir en aide",_error:"MAJ bank failed"});    

   }
   else{
    let comment="";
    if(values.textAreaDisabled=="OUI"){
        comment="R.A.S";
    }else{
        comment=values.comment==""?"refuser par la banque":values.comment;
    }
       //console.log(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE);
       values.comment=comment;    
     // alert( );
     alert(JSON.stringify(values));
       console.dir(values);
       store.dispatch(miseajourDispoBank());
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