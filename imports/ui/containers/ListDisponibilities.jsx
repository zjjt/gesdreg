import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField,DatePicker,SelectField} from 'redux-form-material-ui';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import DispoTable from '../components/DispoTable.jsx';
import {moment} from 'meteor/momentjs:moment';
import { createContainer } from 'meteor/react-meteor-data';
import {convertInTextFromFrenchDate} from '../../utils/utilitaires';
import {Meteor} from 'meteor/meteor';



let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ListDisponibilities extends Component {
    constructor(){
        super();
        this.state={
            orderbyNumReg:false,
            suppr:false,
            withRedactor:false,

        }

    }

    componentDidMount(){
        $('.toolbarTitle').delay(18000).show().addClass("fadeInRight animated");
    }

    _orderTable(){
            this.setState({
                orderDesc:!orderDesc
            });
     }

    render(){
        console.dir(this.props);
        return(
            <div className="centeredContentSingle">
                <div className="contentWrapper fadeInUp animated">
                    <Toolbar style={style.toolbar}>
                        <ToolbarGroup>
                           <Home style={style.homeicon} 
                            color="#212f68" 
                            hoverColor="#cd9a2e" 
                            className="icono"
                            title="Aller a l'accueil"
                            onClick={()=>FlowRouter.go('dashboard')}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text="Modification des disponibilités de règlement" className="toolbarTitle"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <Divider/>
                    <form >
                        <div className="topaligned">
                               
                                 <Field
                                    name="typeDate" 
                                    component={SelectField}
                                    hintText="Selectionner un type de date"
                                    floatingLabelFixed={true}
                                    value={this.props.typeDate}
                                >
                                    <MenuItem value="date_naiss" primaryText="Date de naissance du bénéficiaire"/>
                                    <MenuItem value="date_depot_treso" primaryText="Date de dépot à la trésorerie"/>
                                    <MenuItem value="date_sort_treso" primaryText="Date de sortie de la trésorerie"/>
                                    <MenuItem value="date_depot_sign" primaryText="Date de dépot pour signature"/>
                                    <MenuItem value="date_recep_sign_reg" primaryText="Date de réception du règlement après signature"/>
                                    <MenuItem value="date_retrait_reg" primaryText="Date de retrait du règlement"/>
                                    <MenuItem value="dateRDV" primaryText="Date de rendez-vous"/>
                                </Field>
                               

                                
                                    <Field
                                    name="date" 
                                    component={TextField}
                                    hintText="A la date EX:01/01/1900"
                                    floatingLabelFixed={true}    
                                    />
                             
                                
                               
                                    <Field
                                        name="statut" 
                                        component={SelectField}
                                        hintText=""
                                        floatingLabelFixed={true}
                                        value={this.props.statut}
                                        maxHeight={300}
                                    >
                                        <MenuItem value="EN COURS" primaryText="EN COURS"/>
                                        <MenuItem value="A LA TRESO" primaryText="A LA TRESO"/>
                                        <MenuItem value="SORTIE DE TRESO" primaryText="SORTIE DE TRESO"/>
                                        <MenuItem value="A LA SIGNATURE" primaryText="A LA SIGNATURE"/>
                                        <MenuItem value="PRET" primaryText="PRET"/>
                                        <MenuItem value="SORTIE" primaryText="SORTIE"/>
                                        <MenuItem value="REFUSER" primaryText="REFUSER"/>
                                        <MenuItem value="ANNULER" primaryText="ANNULER"/>
                                        <MenuItem value="" primaryText="AFFICHER TOUS LES STATUTS"/>
                                    </Field>
                               
                                
                                    <Field
                                        name="domaine" 
                                        component={SelectField}
                                        hintText=""
                                        floatingLabelFixed={true}
                                        //validate={[required]}
                                        value={this.props.domaine}
                                    >
                                        <MenuItem value="I" primaryText="INDIVIDUEL"/>
                                        <MenuItem value="G" primaryText="GROUPE"/>
                                        <MenuItem value="R" primaryText="RENTE"/>
                                        <MenuItem value="" primaryText="AFFICHER TOUS LES DOMAINES"/>
                                    </Field>
                                
                                
                                    <Field
                                        name="numregl" 
                                        component={TextField}
                                        hintText="Entrez le numéro de règlement"
                                        floatingLabelFixed={true}
                                    />
                                    <Field
                                        name="numreglStart" 
                                        component={TextField}
                                        hintText="Num RGT de début"
                                        floatingLabelFixed={true}
                                    />
                                    <Field
                                        name="numreglEnd" 
                                        component={TextField}
                                        hintText="Num RGT de fin"
                                        floatingLabelFixed={true}
                                    />
                                    <Field
                                    name="numpol" 
                                    component={TextField}
                                    hintText="Entrez le numéro de police"
                                    floatingLabelFixed={true}
                                    />
                                
                                    <Field
                                    name="numenv" 
                                    component={TextField}
                                    hintText="Entrez le numéro d'envoi"
                                    floatingLabelFixed={true}
                                    />
                                    <Field
                                        name="nomtotal" 
                                        component={TextField}
                                        hintText="Nom complet du bénéficiaire"
                                        floatingLabelFixed={true}
                                    />
                               
                            </div>
                        </form>
                        <Divider/>
                    <DispoTable 
                        typeDate={this.props.typeDate?this.props.typeDate:null} 
                        date={this.props.date?moment(convertInTextFromFrenchDate(this.props.date)).format("YYYY-MM-DD"):null} 
                        statut={this.props.statut?this.props.statut:null}
                        domaine={this.props.domaine?this.props.domaine:null} 
                        numregl={this.props.numregl?this.props.numregl:null}
                        numenv={this.props.numenv?this.props.numenv:null}
                        numpol={this.props.numpol?this.props.numpol:null}
                        nomtotal={this.props.nomtotal?this.props.nomtotal:null}
                        numreglStart={this.props.numreglStart?this.props.numreglStart:null}
                        numreglEnd={this.props.numreglEnd?this.props.numreglEnd:null}
                        withRedactor={this.state.withRedactor?this.state.withRedactor:null}
                        orderbyNumReg={this.state.orderbyNumReg?this.state.orderbyNumReg:null}
                        iamTheRedactor={'CKM'}/>
                    
                </div>
            </div>
        );
    }
}

ListDisponibilities=reduxForm({
    form:'searchDispo',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(ListDisponibilities);

const selector = formValueSelector('searchDispo');

ListDisponibilities=connect(
    state => {
    // or together as a group
    let { typeDate, date, statut,numenv, numregl,domaine,numpol,nomtotal,numreglStart,numreglEnd } = selector(state, 'typeDate', 'date','statut','numenv','numregl','domaine','numpol','nomtotal','numreglStart','numreglEnd');
  /* let dd=date?date.substring(0,2):'';
   let mm=date?date.substring(3,5):'';
   let yy=date?date.substring(6):'';
   date=yy+"-"+mm+"-"+dd;*/
    return {
      typeDate,
      date,
      statut,
      domaine,
      numenv:parseInt(numenv,10),
      numregl:parseInt(numregl,10),
      numpol:parseInt(numpol,10),
      nomtotal,
      numreglStart:parseInt(numreglStart,10),
      numreglEnd:parseInt(numreglEnd,10)
    }
  }
)(ListDisponibilities);



export default ListDisponibilities;

const style={
    homeicon:{
        width: 40,
        height: 40
    },
    toolbar:{
        backgroundColor:'white',
    }
};