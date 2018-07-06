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
import ConsultDispoTableBank from '../components/ConsultDispoTableBank.jsx';

import {moment} from 'meteor/momentjs:moment';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';




let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

class ConsultDispo extends Component {
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
        let content=this.props.userRole==="B"?(
            <ConsultDispoTableBank 
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            nomtotal={this.props.nomtotal}
            numrgt={this.props.numrgt}
            selectedRgt={this.props.selectedReg}
            birthdate={this.props.birthdate?moment(this.props.birthdate).format("YYYY-MM-DD"):null} 
            />
        ):(
            <ConsultDispoTable 
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            nomtotal={this.props.nomtotal}
            numpol={this.props.numpolice}
            birthdate={this.props.birthdate?moment(this.props.birthdate).format("YYYY-MM-DD"):null} 
            />
        );
        let champ=this.props.userRole==="B"?(
            <Field
                name="numrgt" 
                component={TextField}
                hintText="Entrez le numéro de règlement"
                floatingLabelFixed={true}
             />
        ):(
            <Field
                name="numpolice" 
                component={TextField}
                hintText="Entrez le numéro de police"
                floatingLabelFixed={true}
             />
        );
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
                            <ToolbarTitle text={this.props.userRole==="B"?"Liste des règlements Nsia Vie Assurances disponibles":"Liste des règlements disponibles"} className="toolbarTitle"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <Divider/>
                    <form >
                        <div className="topaligned">
                                
                                    <Field
                                        name="debutdate" 
                                        component={TextField}
                                        hintText="Date de début EX:1900-01-01"
                                        floatingLabelFixed={true}    
                                    />
                                    <Field
                                        name="findate" 
                                        component={TextField}
                                        hintText="Date de fin EX:1900-01-01"
                                        floatingLabelFixed={true}    
                                    />
                                    {
                                        ...champ
                                    }
                                    <Field
                                        name="nomtotal" 
                                        component={TextField}
                                        hintText="Nom complet du bénéficiaire"
                                        floatingLabelFixed={true}
                                        
                                    />
                                
                               
                                    <Field
                                        name="birthdate" 
                                        component={TextField}
                                        hintText="Date de naissance du bénéficiaire"
                                        floatingLabelFixed={true}
                                        
                                    />
                              
                                
                                
                            </div>
                        </form>
                        <Divider/>
                        {...content}
                    
                     
                </div>
            </div>
        );
    }
}

ConsultDispo=reduxForm({
    form:'searchConsultDispo',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(ConsultDispo);

const selector = formValueSelector('searchConsultDispo');

ConsultDispo=connect(
    state => {
    // or together as a group
    const { debutDate,finDate,nomtotal,numpolice,numrgt,birthdate } = selector(state, 'debutDate','finDate', 'nomtotal', 'numpolice','numrgt','birthdate');
   
    return {
        startDate:debutDate,
        endDate:finDate,
      nomtotal,
      numpolice,
      numrgt,
      birthdate,
      selectedReg:state.userActions.selectedWnrgt
    }
  }
)(ConsultDispo);



export default ConsultDispo;

const style={
    homeicon:{
        width: 40,
        height: 40
    },
    toolbar:{
        backgroundColor:'white',
    }
};