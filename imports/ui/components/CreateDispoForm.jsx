import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField,DatePicker,SelectField} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import _ from 'lodash';
import areIntlLocalesSupported from 'intl-locales-supported';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import store from '../../redux/store.js'
import {moment} from 'meteor/momentjs:moment';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}
 class CreateDispoForm extends Component{
    constructor(props){
        super(props);
        this.state={
            dialogIsOpen:false,
            dialogTIsOpen:false,
            dialogWIsOpen:false,
            errorMsg:'',
            warning:'',
            peutSubmit:false,
            snackOpen:false,
            snackMsg:'',
            infos_sur_rgt:[],
            table:{
                fixedHeader:true,
                fixedFooter:true,
                stripedRows:false,
                showRowHover:false,
                selectable:true,
                multiSelectable: true,
                enableSelectAll:true,
                deselectOnClickaway:false,
                showCheckboxes:true,
                height:'50px'
                    }
            //codeRedac:this.props.REDAC?this.props.REDAC:''
        };
    }
    _dialogOpen(){
        this.setState({dialogIsOpen: true});
    }

   _dialogClose(){
       this.setState({dialogIsOpen: false});
   }

    _dialogTOpen(){
        this.setState({dialogTIsOpen: true});
    }

   _dialogTClose(){
       this.setState({dialogTIsOpen: false});
   }
   _dialogWOpen(){
        this.setState({dialogWIsOpen: true});
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
   
   }

    render(){
        const {handleSubmit,pristine,submitting,dispatch,reset}=this.props;
        //console.log(REDAC);
        const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];
        const dialogWActions = [
        <FlatButton
            label="ANNULER"
            primary={true}
            onTouchTap={this._dialogWClose.bind(this)}
        />,
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={()=>{
                const values=store.getState().form.createDispo.values;
                    let newval=values;
                    newval.wasrg=this.state.infos_sur_rgt[0].NUMERO_BENEFICIAIRE;
                    console.dir(newval);
                Meteor.call('createDispo',newval,(err)=>{
                    this._dialogWClose();
                        if(err){
                            this.setState({
                                errorMsg:"Une erreur s'est produite lors de la creation de la disponibilité."
                                });
                            this._dialogOpen();
                        }else{
                            reset();
                            this.setState({
                            snackMsg:`La disponibilité de règlement ${values.wnrgt} a été crée`,
                            snackOpen:true
                            });
                        }
                    });
            }}
        />,
        ];
         const dialogTActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogTClose.bind(this)}
        />,
        ];

         const submit=(values,dispatch)=>{
            

            if(values.wnrgt===''||!values.wnrgt){
                this.setState({
                    errorMsg:"Le champs numéro de règlement ne peut être vide."
                });
                this._dialogOpen();
            }else if(isNaN(values.wnrgt)){
                this.setState({
                    errorMsg:"Le champs numéro de règlement doit être numérique."
                });
                this._dialogOpen();
            }else if(values.wnrgt.length<6||values.wnrgt.length>6){
                this.setState({
                    errorMsg:"Le champs numéro de règlement doit être de 6 chiffres."
                });
                this._dialogOpen();
            }else if(!values.domaine||values.domaine===""){
                this.setState({
                    errorMsg:"Veuillez choisir un domaine."
                });
                this._dialogOpen();

            }else if(!this.state.infos_sur_rgt.length){
                this.setState({
                    errorMsg:"Avez vous vu les informations du règlement ?."
                });
                this._dialogOpen();
            }
            else if((values.date_depot_treso===''||!values.date_depot_treso)
            &&(values.date_sort_treso===''||!values.date_sort_treso)
            &&(values.date_depot_sign===''||!values.date_depot_sign)
            &&(values.date_recep_sign_reg===''||!values.date_recep_sign_reg)){
               
                    this.setState({
                    warning:"Vous vous appretez à créé une disponibilité sans aucune date fournie.En êtes vous sûr ? "
                });
                this._dialogWOpen();
                return false;
                
            }
            else if(values.date_depot_treso &&(values.date_sort_treso||values.date_depot_sign||values.date_recep_sign_reg)&& (moment(values.date_depot_treso).isAfter(values.date_sort_treso)
            ||moment(values.date_depot_treso).isAfter(values.date_depot_sign)
            ||moment(values.date_depot_treso).isAfter(values.date_recep_sign_reg))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot à la trésorerie ."
                });
                this._dialogOpen();
            }
            else if(values.date_sort_treso &&(values.date_depot_treso||values.date_depot_sign||values.date_recep_sign_reg)&& (moment(values.date_sort_treso).isBefore(values.date_depot_treso)
            ||moment(values.date_sort_treso).isAfter(values.date_depot_sign)
            ||moment(values.date_sort_treso).isAfter(values.date_recep_sign_reg))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de sortie de trésorerie ."
                });
                this._dialogOpen();
            }
            else if(values.date_depot_sign &&(values.date_sort_treso||values.date_depot_treso||values.date_recep_sign_reg)&& (moment(values.date_depot_sign).isBefore(values.date_sort_treso)
            ||moment(values.date_depot_sign).isBefore(values.date_depot_treso)
            ||moment(values.date_depot_sign).isAfter(values.date_recep_sign_reg))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot pour signature."
                });
                this._dialogOpen();
            }
            else if(values.date_recep_sign_reg &&(values.date_sort_treso||values.date_depot_sign||values.date_depot_treso)&& (moment(values.date_recep_sign_reg).isBefore(values.date_sort_treso)
            ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_sign)
            ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_treso))){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retour de la signature."
                });
                this._dialogOpen();
         }
            /*else if(values.date_depot_treso===''||!values.date_depot_treso){
                this.setState({
                    errorMsg:"Le champs date de dépot à la trésorerie ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(moment(values.date_depot_treso).isAfter(values.date_sort_treso)
            ||moment(values.date_depot_treso).isAfter(values.date_depot_sign)
            ||moment(values.date_depot_treso).isAfter(values.date_recep_sign_reg)){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot à la trésorerie ."
                });
                this._dialogOpen();
            }
             else if(values.date_sort_treso===''||!values.date_sort_treso){
                this.setState({
                    errorMsg:"Le champs date de sortie de la trésorerie ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(moment(values.date_sort_treso).isBefore(values.date_depot_treso)
            ||moment(values.date_sort_treso).isAfter(values.date_depot_sign)
            ||moment(values.date_sort_treso).isAfter(values.date_recep_sign_reg)){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de sortie de trésorerie ."
                });
                this._dialogOpen();
            }
            
            else if(values.date_depot_sign===''||!values.date_depot_sign){
                this.setState({
                    errorMsg:"Le champs date de dépot pour signature ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(moment(values.date_depot_sign).isBefore(values.date_sort_treso)
            ||moment(values.date_depot_sign).isBefore(values.date_depot_treso)
            ||moment(values.date_depot_sign).isAfter(values.date_recep_sign_reg)){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de dépot pour signature."
                });
                this._dialogOpen();
            }
            else if(values.date_recep_sign_reg===''||!values.date_recep_sign_reg){
                this.setState({
                    errorMsg:"Le champs date de retour de la signature ne peut être vide."
                });
                this._dialogOpen();
            }
            else if(moment(values.date_recep_sign_reg).isBefore(values.date_sort_treso)
            ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_sign)
            ||moment(values.date_recep_sign_reg).isBefore(values.date_depot_treso)){
                this.setState({
                    errorMsg:"Veuillez re verifier la date de retour de la signature."
                });
                this._dialogOpen();
         }*/
            else{
                alert(JSON.stringify(values));
                let newval=values;
                newval.wasrg=this.state.infos_sur_rgt[0].NUMERO_BENEFICIAIRE;
                console.dir(newval);
               Meteor.call('createDispo',newval,(err)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Une erreur s'est produite lors de la creation de la disponibilité."
                            });
                        this._dialogOpen();
                    }else{
                        reset();
                        this.setState({
                        snackMsg:`La disponibilité de règlement ${values.wnrgt} a été crée`,
                        snackOpen:true
                        });
                    }
                });
                
            }
        };
    


const infosubmit=(wnrgt,dom)=>{
    if(wnrgt===''||!wnrgt){
        this.setState({
                    errorMsg:"Le champs numero de règlement ne peut être vide."
                });
                this._dialogOpen();
    }else if(isNaN(wnrgt)||(wnrgt.length!==6)){
        this.setState({
                    errorMsg:"Ce n'est pas un numéro de règlement valide."
                });
                this._dialogOpen();
    }else if(!dom||dom===''){
        this.setState({
                    errorMsg:"Veuillez choisir un domaine valide."
                });
                this._dialogOpen();
    }else{
        const args={
            wnrgt:wnrgt,
            domaine:dom
        };
         Meteor.call('voirInfoReg',args,(err,res)=>{
                    if(err){
                        this.setState({
                            errorMsg:"Les Informations du règlement n'ont pas pu être retrouvées."
                            });
                        this._dialogOpen();
                    }else{
                        let infos=res;
                       this.setState({
                           infos_sur_rgt:infos
                       });
                    }
                });
        
        
    }

};
        const maxLength = max => value =>(value && value.length > max)||(value && value.length < max) ? `ce champs doit être de ${max} caractères` : undefined;
        const number = value => value && isNaN(Number(value)) ? 'ce champs doit être numérique':undefined;
        const maxLengthWNRGT=maxLength(8);
        const required = value => value ? undefined : 'Requis';
        return(
            <div className="formDiv">
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
                <Dialog
                title={`Informations sur le reglement ${this.props.numregl} dans le domaine ${this.props.fulldomaine}`}
                actions={dialogTActions}
                modal={false}
                open={this.state.dialogTIsOpen}
                onRequestClose={this._dialogTClose}
                titleStyle={{backgroundColor:'#1f2d67',color:'white'}}
                autoScrollBodyContent={true}
                >
                    {this.state.infos_sur_rgt?this.state.infos_sur_rgt.map((r,i)=>(
                        <div key={i} style={{display:'flex',flexDirection:'column'}}>
                            <TextField
                                floatingLabelText="DATE_SURVENANCE_SINISTRE"
                                floatingLabelFixed={true}
                                value={r.DATE_SURVENANCE_SINISTRE}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="NOM_BENEFICIAIRE"
                                floatingLabelFixed={true}
                                value={r.NOM_BENEFICIAIRE}
                                fullWidth={true}
                            />
                            
                            <TextField
                                floatingLabelText="NUMERO_BENEFICIAIRE"
                                floatingLabelFixed={true}
                                value={r.NUMERO_BENEFICIAIRE}
                                fullWidth={true}
                            />
                             <TextField
                                floatingLabelText="LIBELLE_SINISTRE"
                                floatingLabelFixed={true}
                                value={r.LIBELLE_SINISTRE}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="NUMERO_SINISTRE"
                                floatingLabelFixed={true}
                                value={r.NUMERO_SINISTRE}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="NUMERO_REGLEMENT"
                                floatingLabelFixed={true}
                                value={r.NUMERO_REGLEMENT}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="DECOMPTE"
                                floatingLabelFixed={true}
                                value={r.DECOMPTE}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="POLICE"
                                floatingLabelFixed={true}
                                value={r.POLICE}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="DATE_REGLEMENT"
                                floatingLabelFixed={true}
                                value={r.DATE_REGLEMENT}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="MONTANT_BRUT"
                                floatingLabelFixed={true}
                                value={r.MONTANT_BRUT}
                                fullWidth={true}
                            />
                            <TextField
                                floatingLabelText="MONTANT_NET_REGLEMENT"
                                floatingLabelFixed={true}
                                value={r.MONTANT_NET_REGLEMENT}
                                fullWidth={true}
                            />
                            <hr/>
                        </div>
                    )):null}
                </Dialog>
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    autoHideDuration={5000}
                    onRequestClose={this._snackClose.bind(this)}
                />
               <form onSubmit={handleSubmit(submit)} style={{width:'100%'}} ref="dispoform">
               <div className="topaligned">
                    <Field
                        name="wnrgt" 
                        component={TextField}
                        hintText="Entrez le numéro de règlement"
                        floatingLabelText="Numéro de règlement"
                        floatingLabelFixed={true}
                        validate={[required,]}
                    />
                    <Field
                        name="domaine" 
                        component={SelectField}
                        floatingLabelText="Choix du domaine"
                        hintText="Selectionner un domaine"
                        floatingLabelFixed={true}
                        validate={[required]}
                        value={this.props.domaine}
                    >
                        <MenuItem value="I" primaryText="INDIVIDUEL"/>
                        <MenuItem value="G" primaryText="GROUPE"/>
                        <MenuItem value="R" primaryText="RENTE"/>
                    </Field>
                    <RaisedButton
                            label="voir les informations" 
                            labelColor="white"
                            backgroundColor="#141e51"
                            className="inAppBtnForm"
                            onClick={()=>infosubmit(this.props.numregl,this.props.domaine)}
                        />
               </div>
                 <Divider/>
                    <Table
                        height={this.state.table.height}
                        fixedHeader={this.state.table.fixedHeader}
                        fixedFooter={this.state.table.fixedFooter}
                        onRowSelection={()=>this.setState({dialogTIsOpen:true})}
                    >
                        <TableHeader
                            displaySelectAll={this.state.table.showCheckboxes}
                            adjustForCheckbox={this.state.table.showCheckboxes}
                            enableSelectAll={this.state.table.enableSelectAll}
                        >
                            <TableRow>
                                <TableHeaderColumn tooltip="Date de survenance du sinistre ">DSS</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro du bénéficiaire">NB</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Nom du bénéficiaire">NB</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Libéllé du sinistre">LS</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro du sinistre">NS</TableHeaderColumn>
                                 <TableHeaderColumn tooltip="Numéro du règlement">NR</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de Décompte">DEC</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">POL</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date du règlement">DATE_RGT</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant brut">MNT B</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant Net du règlement">MNT RGT N</TableHeaderColumn>

                                
                            </TableRow>
                        </TableHeader>
                            <TableBody
                                displayRowCheckbox={this.state.table.showCheckboxes}
                                deselectOnClickaway={this.state.table.deselectOnClickaway}
                                showRowHover={this.state.table.showRowHover}
                                stripedRows={this.state.table.stripedRows}
                            >
                            {
                                !this.state.infos_sur_rgt.length?(<TableRow>
                                            <TableRowColumn colSpan="3" style={{textAlign:'center'}}>
                                                <div style={{color:"gray"}}>"Aucune information à afficher" </div>
                                            </TableRowColumn>
                                        </TableRow>):this.state.infos_sur_rgt.map((row,index)=>(
                                            <TableRow key={index} >
                                                <TableRowColumn>{row.DATE_SURVENANCE_SINISTRE}</TableRowColumn>
                                                <TableRowColumn>{row.NUMERO_BENEFICIAIRE}</TableRowColumn>
                                                <TableRowColumn>{row.NOM_BENEFICIAIRE}</TableRowColumn>
                                                <TableRowColumn >{row.LIBELLE_SINISTRE}</TableRowColumn> 
                                                <TableRowColumn >{row.NUMERO_SINISTRE}</TableRowColumn> 
                                                <TableRowColumn >{row.NUMERO_REGLEMENT}</TableRowColumn> 
                                                <TableRowColumn >{row.DECOMPTE}</TableRowColumn> 
                                                <TableRowColumn >{row.POLICE}</TableRowColumn> 
                                                <TableRowColumn >{row.DATE_REGLEMENT}</TableRowColumn> 
                                                <TableRowColumn >{row.MONTANT_BRUT}</TableRowColumn> 
                                                <TableRowColumn >{row.MONTANT_NET_REGLEMENT}</TableRowColumn> 
                                        </TableRow>))
                            }
                            </TableBody>
                        </Table>
                        
                 <Divider/>
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
                    format={(value,name)=>value===''?null:value}
                    floatingLabelFixed={true}
                />
                <Field
                    name="date_sort_treso" 
                    className="datepicker"
                    component={DatePicker}
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
                    className="datepicker"
                    component={DatePicker}
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
                    className="datepicker"
                    component={DatePicker}
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
                 
                <div className="inAppBtnDiv">
                    <RaisedButton
                        label="Créer la disponibilité" 
                        labelColor="white"
                        backgroundColor="#cd9a2e"
                        className="inAppBtnForm"
                        type="submit"
                    />
                </div>
                
               </form>
            </div>
        );
    }
}
CreateDispoForm=reduxForm({
    form:'createDispo',
    fields:['wnrgt','wasrg','domaine','date_depot_sign','date_depot_treso','date_recep_sign_reg','date_sort_treso']
})(CreateDispoForm);

const selector = formValueSelector('createDispo');

CreateDispoForm = connect(
  state => {
    // or together as a group
    const  values = selector(state, 'wnrgt','domaine');
    const numregl=values.wnrgt;
    const domaine=values.domaine;
    let fulldomaine='';
    switch(domaine){
        case 'I':
            fulldomaine="INDIVIDUEL";
        break;
        case 'G':
            fulldomaine="GROUPE";
        break;
        case 'R':
            fulldomaine="RENTE";
        break;
    }
    return {
      numregl,
      domaine,
      fulldomaine
      
    }
  }
)(CreateDispoForm)

CreateDispoForm.propTypes={
    
    numregl:PropTypes.number,
    domaine:PropTypes.string,
    fulldomaine:PropTypes.string
};


export default CreateDispoForm;