import {moment} from 'meteor/momentjs:moment';
import React,{PropTypes,Component} from 'react';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField,DatePicker,SelectField,RadioButtonGroup} from 'redux-form-material-ui';
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
import { RadioButton } from 'material-ui/RadioButton';
import {miseajourDispo,closeBigDialog} from '../../redux/actions/user-actions.js';
import {$} from 'meteor/jquery';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ModRegForm extends Component{
    constructor(props){
        super(props);
        this.state={
            dialogIsOpen:false,
            dialogWIsOpen:false,
            errorMsg:'',
            formchoice:'',
            warning:'Vous vous appretez à lancer une mise à jour. Avez vous terminer vos modifications ?',
            snackOpen:false,
            snackMsg:'',
        };
    }

     _dialogOpen(){
        this.setState({dialogIsOpen: true});
    }

   _dialogClose(){
       this.setState({dialogIsOpen: false});
   }
   _dialogWOpen(){
        this.setState({dialogWIsOpen: true});
        this.props.dispatch(miseajourDispo());
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
       if(this.props.shouldMAJ && !this.state.dialogWIsOpen){
           this._dialogWOpen();
       }
     
   }
   
    render(){
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
         const {handleSubmit,pristine,submitting,dispatch,reset}=this.props;
            console.dir(this.props);
          const submit=(values,dispatch)=>{
             console.dir(typeof values.choixForm);
             if(!values.choixForm){
                 alert("Veuillez choisir une option de formulaire parmis celles proposées");
             }else{
                 switch(values.choixForm){
                     case "MODIFIER":
                        if((values.date_depot_treso===''||!values.date_depot_treso)
                        &&(values.date_sort_treso===''||!values.date_sort_treso)
                        &&(values.date_depot_sign===''||!values.date_depot_sign)
                        &&(values.date_recep_sign_reg===''||!values.date_recep_sign_reg)
                        &&(values.date_retrait_reg===''||!values.date_retrait_reg)){
                        
                                this.setState({
                                errorMsg:"Veuillez fournir au moins une information avant de valider la mise a jour "
                            });
                            this._dialogOpen();
                            return false;
                            
                        }
                        else{

                            //console.log(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE);
                                
                        // alert( );
                            console.dir(values);
                            Meteor.call('updateDispos',values,this.props.regSelected,this.props.numenv,(err)=>{
                                if(err){
                                    console.dir(err);
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
                                    setTimeout(()=>{
                                        dispatch(closeBigDialog("MOD"));
                                    },5500);
                                }
                            });
                        }
                     break;
                     case "MODIFIERDV":
                     //alert(JSON.stringify(this.props.regSelected));
                        if(!values.dateRDV||values.dateRDV==""||!moment(values.dateRDV).isValid()){
                            this.setState({
                                errorMsg:"Veuillez fournir une date de rendez vous valide  "
                            });
                            this._dialogOpen();
                            return false;
                        }else if(moment(values.dateRDV).isBefore(moment(this.props.regSelected[0].dateRDV))){
                            this.setState({
                                errorMsg:"Veuillez fournir une date de rendez vous valide. Celle que vous avez entrée est antérieure à celle déjà définie par le système  "
                            });
                            this._dialogOpen();
                            return false;
                        }else{

                            //console.log(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE);
                                
                        // alert( );
                            console.dir(values);
                            Meteor.call('updateDispos',values,this.props.regSelected,(err)=>{
                                if(err){
                                    console.dir(err);
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
                                    setTimeout(()=>{
                                        dispatch(closeBigDialog("MOD"));
                                    },5500);
                                }
                            });
                        }
                     break;
                     case "REFUSER":
                     console.dir(values);
                            Meteor.call('updateDispos',values,this.props.regSelected,(err)=>{
                                if(err){
                                    console.dir(err);
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
                                    setTimeout(()=>{
                                        dispatch(closeBigDialog("MOD"));
                                    },5500);
                                }
                            });
                     break;
                     case "ANNULER":
                     console.dir(values);
                            Meteor.call('updateDispos',values,this.props.regSelected,(err)=>{
                                if(err){
                                    console.dir(err);
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
                                    setTimeout(()=>{
                                        dispatch(closeBigDialog("MOD"));
                                    },5500);
                                }
                            });
                     break;
                 }
             }
                
         };
         //console.log(this.props.regSelected);
         const maxLength = max => value =>value && value.length > max ? `Ce champs doit avoir un maximum de ${max} caractères ou moins` : undefined
         let modformOfChoice=this.state.formchoice==="MODIFIER"?(<div><Field
            name="date_depot_treso" 
            DateTimeFormat={DateTimeFormat}
            className="datepicker"
            component={DatePicker}
            hintText="Entrez la date de dépot à la trésorerie"
            floatingLabelText="Date de dépot à la trésorerie"
            fullWidth={true}
            okLabel="OK"
            cancelLabel="Annuler"
            locale="fr"
            format={(value,name)=>{
                console.log('value being passed ',value);
                console.log('is of type',typeof value);
                return value===''?null:value;
            }}
            floatingLabelFixed={true}
        />
        <Field
            name="date_sort_treso" 
            component={DatePicker}
            className="datepicker"
            DateTimeFormat={DateTimeFormat}
            hintText="Entrez la date de sortie de la trésorerie"
            floatingLabelText="Date de sortie de la trésorerie"
            fullWidth={true}
            okLabel="OK"
            cancelLabel="Annuler"
            locale="fr"
            format={(value,name)=>value===''?null:value}
            floatingLabelFixed={true}
        />
        <Field
            name="date_depot_sign" 
            component={DatePicker}
            className="datepicker"
            DateTimeFormat={DateTimeFormat}
            hintText="Entrez la date de dépot pour signature"
            floatingLabelText="Date de dépot pour signature"
            fullWidth={true}
            okLabel="OK"
            cancelLabel="Annuler"
            locale="fr"
            format={(value,name)=>value===''?null:value}
            floatingLabelFixed={true}
        />
        <Field
            name="date_recep_sign_reg" 
            component={DatePicker}
            className="datepicker"
            DateTimeFormat={DateTimeFormat}
            hintText="Entrez la date de retour de la signature"
            floatingLabelText="Date de retour de la signature"
            fullWidth={true}
            okLabel="OK"
            cancelLabel="Annuler"
            locale="fr"
            format={(value,name)=>value===''?null:value}
            floatingLabelFixed={true}
        />
        <Field
            name="date_retrait_reg" 
            component={DatePicker}
            className="datepicker"
            DateTimeFormat={DateTimeFormat}
            hintText="Entrez la date de retrait du règlement"
            floatingLabelText="Date de retrait du règlement"
            fullWidth={true}
            okLabel="OK"
            cancelLabel="Annuler"
            locale="fr"
            format={(value,name)=>value===''?null:value}
            floatingLabelFixed={true}
        /></div>):this.state.formchoice==="MODIFIERDV"?(
            <div>
                <p>* les dates de rendez vous des ou du règlement sélectionné seront modiffiées.</p>
                <p>La date de rendez vous actuelle est: {`${moment(this.props.regSelected.dateRDV).format("DD-MM-YYYY")}`}</p>
                <Field
                    name="dateRDV" 
                    component={DatePicker}
                    className="datepicker"
                    DateTimeFormat={DateTimeFormat}
                    hintText="Entrez la nouvelle date de rendez-vous"
                    floatingLabelText="Date de rendez-vous"
                    fullWidth={true}
                    okLabel="OK"
                    cancelLabel="Annuler"
                    locale="fr"
                    format={(value,name)=>value===''?null:value}
                    floatingLabelFixed={true}
                />
            </div>
        ):this.state.formchoice==="REFUSER"?(
            <div>
                <p>* Rappelez vous!!! cette modification est irreversible.Veuillez contacter un administrateur en cas d'erreur</p>
                <p>Veuillez indiquer ci-dessous le motif du refus de ce règlement (255 caractères maximum)</p>
                        <Field
                            name="comment" 
                            component={TextField}
                            hintText="motif du refus"
                            floatingLabelText="Pourquoi ?"
                            fullWidth={true}
                            style={this.state.textAreaDisabled?{"diaplay":"none"}:{"display":"block"}}
                            floatingLabelFixed={true}
                            disabled={this.state.textAreaDisabled}
                            validate={this.state.textAreaDisabled?[]:[maxLength(255)]}
                        />
            </div>
        ):this.state.formchoice==="ANNULER"?(
            <div>
                <p>* Rappelez vous!!! cette modification est irreversible.Veuillez contacter un administrateur en cas d'erreur</p>
                <p>Veuillez indiquer ci-dessous le motif de l'annulation de ce règlement (255 caractères maximum)</p>
                        <Field
                            name="comment" 
                            component={TextField}
                            hintText="motif de l'annulation"
                            floatingLabelText="Pourquoi ?"
                            fullWidth={true}
                            style={this.state.textAreaDisabled?{"diaplay":"none"}:{"display":"block"}}
                            floatingLabelFixed={true}
                            disabled={this.state.textAreaDisabled}
                            validate={this.state.textAreaDisabled?[]:[maxLength(255)]}
                        />
            </div>
        ):(<center><p>Veuillez choisir une des options ci dessus</p></center>);
         
        return(
            <div>
                
            <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    autoHideDuration={5000}
                    onRequestClose={this._snackClose.bind(this)}
                    style={{width:'auto !important'}}
                />
                
                    
                    <Divider/>
                            <div style={{textAlign:"center",color:"1e2c67",backgroundColor:"#cc992c"}}>ENTREZ VOS MODIFICATIONS CI-DESSOUS</div>
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
                        {/*ici mettre un radio button pour permettre le choix du formulaire de refus ou de modification des dates*/}
                        <Field component={RadioButtonGroup} 
                            name="choixForm" 
                            defaultSelected="MODIFIER" 
                            onChange={(e,v)=>{
                                if(v=="MODIFIER"){
                                    this.setState({
                                        formchoice:"MODIFIER"  
                                    });
                                }else if(v=="MODIFIERDV"){
                                    let answer=!!this.props.regSelected.reduce((e,n)=>{
                                        //alert(e.dateRDV);
                                        //alert(n.dateRDV);
                                        return e.dateRDV===n.dateRDV?true:false;
                                    });
                                    //alert(answer);
                                    this.setState({
                                        formchoice:"MODIFIERDV" 
                                    });
                                }else if(v=="REFUSER"){
                                    this.setState({
                                        formchoice:"REFUSER" 
                                    });
                                }else if(v=="ANNULER"){
                                    this.setState({
                                        formchoice:"ANNULER" 
                                    });
                                }
                            }}
                        >
                            <RadioButton value="MODIFIER" label="Modifier les différentes dates" title="vous permet de modifier la date de dépot à la trésorerie,et les autres dates de procédure normale sur un ou plusieurs règlements"/>
                            <RadioButton value="MODIFIERDV" label="Modifier la date de rendez-vous calculées" disabled={this.props.regSelected.length>1?true:false} title="vous permet de modifier la date de rendez-vous précalculé par le système sur un ou plusieurs règlements"/>
                            <RadioButton value="REFUSER" label="Refuser ce  règlement" disabled={this.props.regSelected.length>1?true:false} title="vous permet de refuser un règlement en donnant le motif du refus.Attention cette action est irréversible."/>
                            <RadioButton value="ANNULER" label="Annuler ce règlement" disabled={this.props.regSelected.length>1?true:false} title="vous permet d'annuler un règlement"/>
                        </Field>
                            <hr/>
                        {...modformOfChoice}
                        <input type="submit" className="hidden"/>
                    </form>
            </div>
        );
    }
}

ModRegForm=reduxForm({
    form:"modifForm",
    fields:['date_depot_treso','date_sort_treso','date_depot_sign','date_recep_sign_reg','date_retrait_reg','statut']
})(ModRegForm);

ModRegForm.propTypes={
    data:PropTypes.shape({
        loading:PropTypes.bool,
       voirInfoReg:PropTypes.array
    }).isRequired,
    
     //date:PropTypes.instanceOf(date),  
};

ModRegForm=connect(state=>{
    const shouldMAJ=state.userActions.mettreAjour;
    return {
        shouldMAJ
    };
})(ModRegForm);

const voirInfoDispo=gql`
    query voirInfoDispo($wnrgt:Int,$domaine:String){
        voirInfoReg(wnrgt:$wnrgt,domaine:$domaine){
            DATE_SURVENANCE_SINISTRE
            NOM_BENEFICIAIRE
            NUMERO_BENEFICIAIRE
            LIBELLE_SINISTRE
            NUMERO_SINISTRE
            NUMERO_REGLEMENT
            DECOMPTE
            POLICE
            DATE_REGLEMENT
            MONTANT_BRUT
            MONTANT_NET_REGLEMENT
        },
        
    }`;

    
export default graphql(voirInfoDispo,{
    options:({ wnrgt,domaine }) => ({ variables: {wnrgt,domaine},fetchPolicy: 'cache-and-network' }),
})(ModRegForm);