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

class InfoReg extends Component{
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


   componentDidUpdate(){
       
     
   }
   
    render(){
       
       
      
         const {handleSubmit,pristine,submitting,dispatch,reset}=this.props;
            
         

         
        return(
            <div>
                
            
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
                        floatingLabelText="DATE DEPOT TRESORERIE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_depot_treso).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="DATE SORTIE TRESORERIE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_sort_treso).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="DATE DEPOT SIGNATURE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_depot_sign).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="DATE RECEPTION SIGNATURE"
                        floatingLabelFixed={true}
                        value={moment(this.props.regSelected.date_recep_sign_reg).format("DD-MM-YYYY")}
                        fullWidth={true}
                        disabled={true}
                    />
                    <TextField
                        floatingLabelText="DATE RETRAIT REGLEMENT"
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
                   
                    
            </div>
        );
    }
}



InfoReg.propTypes={
    data:PropTypes.shape({
        loading:PropTypes.bool,
       voirInfoReg:PropTypes.array
    }).isRequired,
    
     //date:PropTypes.instanceOf(date),  
};



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
    options:({ wnrgt,domaine }) => ({ variables: {wnrgt,domaine},fetchPolicy: 'network-only' }),
})(InfoReg);