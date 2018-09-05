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
import ConsultDispoTable from '../components/ConsultDispoTable.jsx';
import {moment} from 'meteor/momentjs:moment';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import InfExport from '../components/InfExport.jsx';
import {convertInTextFromFrenchDate} from '../../utils/utilitaires';



let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class Exportation extends Component {
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
                            <ToolbarTitle text="Export des règlements" className="toolbarTitle"/>
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
                                        <MenuItem value="dateRDV" primaryText="Date de rendez vous du règlement"/>
                                    </Field>
                                    <Field
                                        name="debutdate" 
                                        component={TextField}
                                        hintText="Date de début EX:01/01/1900"
                                        floatingLabelFixed={true}    
                                    />
                                    <Field
                                        name="findate" 
                                        component={TextField}
                                        hintText="Date de fin EX:01/01/1900"
                                        floatingLabelFixed={true}    
                                    />
                                     <Field
                                        name="domaine" 
                                        component={SelectField}
                                        hintText="Choix du domaine"
                                        floatingLabelFixed={true}
                                        //validate={[required]}
                                        value={this.props.domaine}
                                    >
                                        <MenuItem value="I" primaryText="INDIVIDUEL"/>
                                        <MenuItem value="G" primaryText="GROUPE"/>
                                        <MenuItem value="R" primaryText="RENTE"/>
                                        <MenuItem value="TOUS" primaryText="TOUS LES DOMAINES"/>
                                    </Field>
                                   
                                   
                            </div>
                        </form>
                        <Divider/>
                        <InfExport typeDate={this.props.typeDate?this.props.typeDate:null} startDate={this.props.startDate?moment(convertInTextFromFrenchDate(this.props.startDate)).format("YYYY-MM-DD"):null} endDate={this.props.endDate?moment(convertInTextFromFrenchDate(this.props.endDate)).format("YYYY-MM-DD"):null} domaine={this.props.domaine?this.props.domaine:null} />
                </div>
            </div>
        );
    }
}

Exportation=reduxForm({
    form:'searchExportDispo',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(Exportation);

const selector = formValueSelector('searchExportDispo');

Exportation=connect(
    state => {
    // or together as a group
    let { statut,typeDate,findate,debutdate } = selector(state, 'typeDate','statut','findate','debutdate');
  
    return {
      typeDate,
      statut,
      startDate:debudate,
      endDate:findate
    }
  }
)(Exportation);




export default Exportation;

const style={
    homeicon:{
        width: 40,
        height: 40
    },
    toolbar:{
        backgroundColor:'white',
    }
};