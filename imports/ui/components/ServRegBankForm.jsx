import {moment} from 'meteor/momentjs:moment';
import React,{PropTypes,Component} from 'react';
import {Field,reduxForm,formValueSelector,submit,SubmissionError} from 'redux-form';
import {TextField,DatePicker,SelectField,RadioButtonGroup} from 'redux-form-material-ui';
import { RadioButton } from 'material-ui/RadioButton';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import {Meteor} from 'meteor/meteor';
import {graphql} from 'react-apollo';
import FlatButton from 'material-ui/FlatButton';
import gql from 'graphql-tag';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import {dontmiseajourDispoBank,closeBigDialog} from '../../redux/actions/user-actions.js';
import {isEmptyObject,isEmptyObjectProps,uniq} from '../../utils/utilitaires';
import {$} from 'meteor/jquery';
//import {submitBankForm} from './submits';
import { RaisedButton } from 'material-ui';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ServRegBankForm extends Component{
    constructor(props){
        super(props);
        this.state={
            dialogIsOpen:false,
            dialogWIsOpen:false,
            dispinfo:"none",
            submitto:false,
            errorMsg:'',
            textAreaDisabled:true,
            warning:'Vous vous appretez à lancer une mise à jour. Avez vous terminer vos modifications ?',
            snackOpen:false,
            snackMsg:'',
        };
    }

    _dialogOpen(){
        this.setState({dialogIsOpen: true});
    }

   _dialogClose(){
       this.setState({dialogIsOpen: false,submitto:false});
       this.props.dispatch(dontmiseajourDispoBank());
   }
   _dialogWOpen(){
        this.setState({dialogWIsOpen: true});
        //this.props.dispatch(miseajourDispo());
    }

   _dialogWClose(){
       this.setState({dialogWIsOpen: false});
       
   }
   _snackClose(){
       this.setState({
           snackOpen:false
       });
   }
   componentDidUpdate(){
      // console.dir(this.props);
       if(this.props.shouldMAJ && !this.state.submitto){
           this.setState({
               submitto:true // flag pour empecher l'update multiple
           })
           console.log(this.props);
           this._dialogWOpen();
           this.props.dispatch(dontmiseajourDispoBank());
       } 
   }
   componentDidMount(){
       console.log(this.props);
   }
    render(){
      
         const {handleSubmit,pristine,submitting,dispatch,reset}=this.props;
         const maxLength = max => value =>(value && value.length > max)||(value && value.length < max) ? `ce champs doit être de ${max} caractères` : undefined;
         const required = value => value ? undefined : 'Requis';
         const dialogActions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={this._dialogClose.bind(this)}
            />,
            ];
         const dialogWActions = [
            <FlatButton
                label="Annuler"
                primary={true}
                 onTouchTap={this._dialogWClose.bind(this)}
            />,
            <FlatButton
                label="Continuer"
                primary={true}
                type="submit"
                onTouchTap={()=>{
                    $('.hidden').click();
                    this._dialogWClose();
                }}
            />,
            ];

            const submit=(values)=>{
                //alert(JSON.stringify(values));
                const{log}=console;
                log(values);
                let comment="";
                console.dir(values);
                if(isEmptyObject(values)){
                    log(isEmptyObject(values))
                    this.setState({
                        errorMsg:"Veuillez faire un choix avant de valider le formulaire s'il vous plaît "
                    });
                    this._dialogOpen();
                    return false;
                   // alert("Veuillez faire un choix pour valider le retrait du règlement 1");
                   // throw new SubmissionError({choixbank:"Veuillez faire un choix pour valider le règlement",_error:"submit_failed"});    
                    //return  
                }else{
                    log("here in submit function");
                    if(isEmptyObjectProps(values,"choixbank")){
                        //alert("Veuillez faire un choix pour valider le retrait du règlement 2");
                        this.setState({
                            errorMsg:"Veuillez faire un choix avant de valider le formulaire s'il vous plaît 2 "
                        });
                        this._dialogOpen();
                        return false;
                       //throw new SubmissionError({choixbank:"Veuillez faire un choix pour valider le règlement",_error:"submit_failed"});    
                        //return false;   
                    }
                    if(!isEmptyObjectProps(values,"choixbank") && values.choixbank=="OUI"){
                        comment="R.A.S";
                    }
                    else if(!isEmptyObjectProps(values,"choixbank") && values.choixbank=="NON"){
                        comment=isEmptyObjectProps(values,"comment") ?"refuser par la banque":values.comment;
                    }
                    values.comment=comment;
                    //alert(JSON.stringify(values));
                    console.dir(values);
                    Meteor.call('updateDisposBank',values,this.props.regSelected,(err)=>{
                       if(err){
                           
                           if(err.error==="access-error"){
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
                           setTimeout(()=>{
                            this._dialogWClose();
                            //dispatch(miseajourDispo());
                            dispatch(closeBigDialog("BANK"));
                           },3000)
                           
                       }
                   });
                }
                   
               
            };  
        return(
            <div>
                
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    autoHideDuration={5000}
                    onRequestClose={this._snackClose.bind(this)}
                    style={{width:'auto !important'}}
                />
                {this.props.data.loading?<div style={{textAlign:"center"}}><CircularProgress /></div>:uniq(this.props.data.voirInfoReg).map((row,index)=>{
                    if(index<1)//hack pour sundb_rci
                       return (<div key={index} style={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
                            <RaisedButton
                            label="Voir les informations du règlement"
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={(e)=>{
                                if(this.state.dispinfo=="none"){
                                    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
                                    this.setState({
                                        dispinfo:"flex"
                                    });
                                    
                                }else{
                                    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0);
                                    this.setState({
                                        dispinfo:"none"
                                    }); 
                                    
                                }
                            }}
                        />
                        <div  style={{display:this.state.dispinfo,flexDirection:'column'}}>
                        
                            <TextField
                                floatingLabelText="NOM_BENEFICIAIRE"
                                floatingLabelFixed={true}
                                value={row.NOM_BENEFICIAIRE}
                                fullWidth={true}
                                disabled={true}
                            />
                            
                            <TextField
                                floatingLabelText="NUMERO_BENEFICIAIRE"
                                floatingLabelFixed={true}
                                value={row.NUMERO_BENEFICIAIRE}
                                fullWidth={true}
                                disabled={true}
                            />
                             <TextField
                                floatingLabelText="LIBELLE_SINISTRE"
                                floatingLabelFixed={true}
                                value={row.LIBELLE_SINISTRE}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="NUMERO_REGLEMENT"
                                floatingLabelFixed={true}
                                value={row.NUMERO_REGLEMENT}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="NUMERO_CHEQUE"
                                floatingLabelFixed={true}
                                value={row.NUMERO_CHEQUE}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="POLICE"
                                floatingLabelFixed={true}
                                value={row.POLICE}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="DATE_REGLEMENT"
                                floatingLabelFixed={true}
                                value={row.DATE_REGLEMENT.replace(/\//g,"-")}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="MONTANT_BRUT"
                                floatingLabelFixed={true}
                                value={row.MONTANT_BRUT}
                                fullWidth={true}
                                disabled={true}
                            />
                            <TextField
                                floatingLabelText="MONTANT_NET_REGLEMENT"
                                floatingLabelFixed={true}
                                value={row.MONTANT_NET_REGLEMENT}
                                fullWidth={true}
                                disabled={true}
                            />
                            
                        </div>
                        </div>)
                })}
                    <Divider/>
                        <div style={{textAlign:"center",color:"1e2c67"}}>COCHEZ L'UNE DES OPTIONS CI-DESSOUS</div>
                    <Divider/>
                    <form onSubmit={handleSubmit(submit)} >
                        <Dialog
                            actions={dialogActions}
                            modal={false}
                            open={this.state.dialogIsOpen}
                            onRequestClose={this._dialogClose}
                        >
                            <span className="errorMsg">{this.state.errorMsg}</span>
                        </Dialog>
                        <Dialog
                            actions={dialogWActions}
                            modal={false}
                            open={this.state.dialogWIsOpen}
                            onRequestClose={this._dialogWClose}
                        >
                            <span className="warningMsg">{this.state.warning}</span>
                        </Dialog>
                        <Field component={RadioButtonGroup} 
                            name="choixbank" 
                            defaultSelected="OUI" 
                            onChange={(e,v)=>{
                                if(v=="OUI"){
                                    this.setState({
                                        textAreaDisabled:true  
                                    });
                                }else if(v=="NON"){
                                    this.setState({
                                        textAreaDisabled:false  
                                    });
                                }
                            }}
                        >
                            <RadioButton value="OUI" label="OUI"/>
                            <RadioButton value="NON" label="NON" />
                        </Field>
                        
                        {/*Ok ici la strategie est que lorsque le banquier invalide un paiement une case de commentaire apparait
                            dans le code il faut alors verifier que la case est invisible et en fonction du flag la rendre requise pour le formulaire ou non
                        */}
                        <Field
                            name="comment" 
                            component={TextField}
                            hintText="votre commentaire"
                            floatingLabelText="Pourquoi ?"
                            fullWidth={true}
                            style={this.state.textAreaDisabled?{"diaplay":"none"}:{"display":"block"}}
                            floatingLabelFixed={true}
                            disabled={this.state.textAreaDisabled}
                            validate={this.state.textAreaDisabled?[]:[maxLength(255)]}
                        />
                        <input type="submit"  className="hidden"/>
                   </form>
                    
            </div>
        );
    }
}


ServRegBankForm=reduxForm({
    form:"bankForm",
    //onSubmit:,
    fields:['choixbank','comment','police','wnrgt'],
    //fields:['date_depot_treso','date_sort_treso','date_depot_sign','date_recep_sign_reg','date_retrait_reg','statut']
})(ServRegBankForm);

ServRegBankForm.propTypes={
    data:PropTypes.shape({
        loading:PropTypes.bool,
       voirInfoReg:PropTypes.array
    }).isRequired,
    
     //date:PropTypes.instanceOf(date),  
};

ServRegBankForm=connect(state=>{
    //console.dir(state);
    const shouldMAJ=state.userActions.mettreAjourBank;
    return {
        shouldMAJ
    };
})(ServRegBankForm);

const voirInfoDispo=gql`
    query voirInfoDispo($wnrgt:Int,$domaine:String){
        voirInfoReg(wnrgt:$wnrgt,domaine:$domaine){
            DATE_SURVENANCE_SINISTRE
            NOM_BENEFICIAIRE
            NUMERO_BENEFICIAIRE
            LIBELLE_SINISTRE
            NUMERO_SINISTRE
            NUMERO_REGLEMENT
            NUMERO_CHEQUE
            DECOMPTE
            POLICE
            DATE_REGLEMENT
            MONTANT_BRUT
            MONTANT_NET_REGLEMENT
        },
        
    }`;

    
export default graphql(voirInfoDispo,{
    options:({ wnrgt,domaine }) => ({ variables: {wnrgt,domaine},fetchPolicy: 'cache-and-network' }),
})(ServRegBankForm);