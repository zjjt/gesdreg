import {moment} from 'meteor/momentjs:moment';
import React,{PropTypes,Component} from 'react';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField,DatePicker,SelectField} from 'redux-form-material-ui';
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
import {miseajourDispo} from '../../redux/actions/user-actions.js';
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
            
          const submit=(values,dispatch)=>{
            
             values.wasrg=this.props.data?this.props.data.voirInfoReg[0].NUMERO_BENEFICIAIRE:null;
             values.wnrgt=this.props.regSelected?this.props.regSelected.wnrgt:this.props.data.voirInfoReg[0].NUMERO_REGLEMENT;
             values.domaine=this.props.regSelected?this.props.regSelected.domaine:this.props.data.voirInfoReg[0].DOMAINE;
             console.dir(values);
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
            else if(values.date_depot_treso 
            && moment(values.date_depot_treso).isBefore(this.props.data.voirInfoReg[0].DATE_REGLEMENT.replace(/\//g,"-"))
            && moment(values.date_depot_treso).isBefore(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE)
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot à la trésorerie. Elle ne peut être avant la date de survenance du sinistre ou la date du règlement "
                });
                this._dialogOpen();
            }else if(values.date_depot_treso 
            &&(values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
            && (
                moment(values.date_depot_treso).isAfter(values.date_sort_treso)
                ||moment(values.date_depot_treso).isAfter(values.date_depot_sign)
                ||moment(values.date_depot_treso).isAfter(values.date_recep_sign_reg)
                ||moment(values.date_depot_treso).isAfter(values.date_retrait_reg)
            )
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot à la trésorerie. Elle ne peut être après la date de sortie de trésorerie ou les dates de depot et retour de signature ou encore la date du retrait du règlement"
                });
                this._dialogOpen();
            }
            else if(values.date_sort_treso 
            && moment(values.date_sort_treso).isBefore(this.props.data.voirInfoReg[0].DATE_REGLEMENT.replace(/\//g,"-"))
            && moment(values.date_sort_treso).isBefore(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE)){
                
                this.setState({
                    errorMsg:"Veuillez re verifier la date de sortie de trésorerie. Elle ne peut être avant la date de survenance du sinistre ou la date du règlement "
                });
                this._dialogOpen();
            }else if(moment(values.date_sort_treso).isBefore(moment(this.props.regSelected.date_depot_treso).format("YYYY-MM-DD"))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de sortie de trésorerie. Elle ne peut être avant la date de dépot à la trésorerie "
                });
                this._dialogOpen();
            }else if(values.date_sort_treso 
            &&(values.date_depot_treso||values.date_depot_sign||values.date_recep_sign_reg||values.date_retrait_reg)
            && (
                moment(values.date_sort_treso).isBefore(values.date_depot_treso)
                ||moment(values.date_sort_treso).isAfter(values.date_depot_sign)
                ||moment(values.date_sort_treso).isAfter(values.date_recep_sign_reg)
                ||moment(values.date_sort_treso).isAfter(values.date_retrait_reg)
            )
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de sortie de trésorerie. Elle ne peut être avant la date de dépot à la trésorerie ou après les dates de depot et retour de signature ou encore la date du retrait du règlement"
                });
                this._dialogOpen();
            }
            else if(values.date_depot_sign 
            && moment(values.date_depot_sign).isBefore(this.props.data.voirInfoReg[0].DATE_REGLEMENT.replace(/\//g,"-"))
            && moment(values.date_depot_sign).isBefore(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE)
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot pour signature. Elle ne peut être avant la date de survenance du sinistre ou la date du règlement "
                });
                this._dialogOpen();
            }else if(moment(values.date_depot_sign).isBefore(moment(this.props.regSelected.date_depot_treso).format("YYYY-MM-DD"))
                    ||moment(values.date_depot_sign).isBefore(moment(this.props.regSelected.date_sort_treso).format("YYYY-MM-DD"))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot pour signature. Elle ne peut être avant la date de dépot à la trésorerie ou avant la date de sortie de trésorerie."
                });
                this._dialogOpen();
            }else if(values.date_depot_sign 
            &&(values.date_depot_treso||values.date_sort_treso||values.date_recep_sign_reg||values.date_retrait_reg)
            && (
                moment(values.date_depot_sign).isBefore(values.date_depot_treso)
                ||moment(values.date_depot_sign).isBefore(values.date_sort_treso)
                ||moment(values.date_depot_sign).isAfter(values.date_recep_sign_reg)
                ||moment(values.date_depot_sign).isAfter(values.date_retrait_reg)
            )
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot pour signature. Elle ne peut être avant la date de dépot à la trésorerie ou la date de sortie de la trésorerie ,ni après la date de retour de signature ou encore la date du retrait du règlement"
                });
                this._dialogOpen();
            }
            else if(values.date_recep_sign_reg 
            && moment(values.date_recep_sign_reg).isBefore(this.props.data.voirInfoReg[0].DATE_REGLEMENT.replace(/\//g,"-"))
            && moment(values.date_recep_sign_reg).isBefore(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE)
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retour de signature. Elle ne peut être avant la date de survenance du sinistre ou la date du règlement "
                });
                this._dialogOpen();
            }else if(moment(values.date_recep_sign_reg).isBefore(moment(this.props.regSelected.date_depot_treso).format("YYYY-MM-DD"))
                    ||moment(values.date_recep_sign_reg).isBefore(moment(this.props.regSelected.date_sort_treso).format("YYYY-MM-DD"))
                    ||moment(values.date_recep_sign_reg).isBefore(moment(this.props.regSelected.date_depot_sign).format("YYYY-MM-DD"))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retour de signature. Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature."
                });
                this._dialogOpen();
            }else if(values.date_recep_sign_reg 
            &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_retrait_reg)
            && (
                moment(values.date_recep_sign_reg).isBefore(values.date_depot_treso)
                ||moment(values.date_recep_sign_reg).isBefore(values.date_sort_treso)
                ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_sign)
                ||moment(values.date_recep_sign_reg).isAfter(values.date_retrait_reg)
            )
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retour de signature. Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie et la date de dépot à la signature ,ni après la date du retrait du règlement"
                });
                this._dialogOpen();
            }
            else if(values.date_retrait_reg 
            && moment(values.date_retrait_reg).isBefore(this.props.data.voirInfoReg[0].DATE_REGLEMENT.replace(/\//g,"-"))
            && moment(values.date_retrait_reg).isBefore(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE)
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retrait du règlement. Elle ne peut être avant la date de survenance du sinistre ou la date du règlement "
                });
                this._dialogOpen();
            }else if(moment(values.date_retrait_reg).isBefore(moment(this.props.regSelected.date_depot_treso).format("YYYY-MM-DD"))
                    ||moment(values.date_retrait_reg).isBefore(moment(this.props.regSelected.date_sort_treso).format("YYYY-MM-DD"))
                    ||moment(values.date_retrait_reg).isBefore(moment(this.props.regSelected.date_depot_sign).format("YYYY-MM-DD"))
                    ||moment(values.date_retrait_reg).isBefore(moment(this.props.regSelected.date_recep_sign_reg).format("YYYY-MM-DD"))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retrait du règlement. Elle ne peut être avant la date de dépot à la trésorerie, la date de sortie de trésorerie, la date de dépot pour signature et la date de retour de signature."
                });
                this._dialogOpen();
            }else if(values.date_retrait_reg 
            &&(values.date_depot_treso||values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg)
            && (
                moment(values.date_retrait_reg).isBefore(values.date_depot_treso)
                ||moment(values.date_retrait_reg).isBefore(values.date_sort_treso)
                ||moment(values.date_retrait_reg).isBefore(values.date_depot_sign)
                ||moment(values.date_retrait_reg).isBefore(values.date_recep_sign_reg)
            )
            ){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retrait du règlement. Elle ne peut être avant la date de dépot à la trésorerie,la date de sortie de la trésorerie,la date de dépot à la signature et la date de retour de signature"
                });
                this._dialogOpen();
            }
            else{

                //console.log(this.props.data.voirInfoReg[0].DATE_SURVENANCE_SINISTRE);
                    
               alert( );
                console.dir(values);
                Meteor.call('updateDispo',values,this.props.regSelected,(err)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Une erreur s'est produite lors de la mise à jour de la disponibilité. "+err.reason
                            });
                        this._dialogOpen();
                    }else{
                        this.setState({
                        snackMsg:`Mise à jour éffectuée`,
                        snackOpen:true
                        });
                        //dispatch(miseajourDispo());
                        //this.props.closeBigDialog();
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
                {this.props.data.loading?<div style={{textAlign:"center"}}><CircularProgress /></div>:this.props.data.voirInfoReg.map((row,index)=>(
                        <div key={index} style={{display:'flex',flexDirection:'column'}}>
                            <TextField
                                floatingLabelText="DATE_SURVENANCE_SINISTRE"
                                floatingLabelFixed={true}
                                value={row.DATE_SURVENANCE_SINISTRE}
                                fullWidth={true}
                                disabled={true}
                            />
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
                                floatingLabelText="NUMERO_SINISTRE"
                                floatingLabelFixed={true}
                                value={row.NUMERO_SINISTRE}
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
                                floatingLabelText="DECOMPTE"
                                floatingLabelFixed={true}
                                value={row.DECOMPTE}
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
                    ))}
                    <TextField
                        floatingLabelText="ANCIENNE DATE DEPOT TRESORERIE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_depot_treso).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="ANCIENNE DATE SORTIE TRESORERIE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_sort_treso).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="ANCIENNE DATE DEPOT SIGNATURE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_depot_sign).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="ANCIENNE DATE RECEPTION SIGNATURE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_recep_sign_reg).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="ANCIENNE DATE RETRAIT REGLEMENT"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_retrait_reg).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="STATUT ACTUEL DU REGLEMENT"
                        floatingLabelFixed={true}
                        value={this.props.regSelected.statut_reg_retirer}
                        fullWidth={true}
                        disabled={true}
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
                        
                        <Field
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
                        />
                     
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
    options:({ wnrgt,domaine }) => ({ variables: {wnrgt,domaine},forceFetch:true }),
})(ModRegForm);