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
                            <ToolbarTitle text="Liste des règlements disponibles" className="toolbarTitle"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <Divider/>
                    <form >
                        <div className="topaligned">
                                
                                    <Field
                                    name="numpolice" 
                                    component={TextField}
                                    hintText="Entrez le numéro de police"
                                    floatingLabelFixed={true}
                                   
                                     />
                                
                                
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
                    <ConsultDispoTable 
                        nomtotal={this.props.nomtotal}
                        numpol={this.props.numpolice}
                        birthdate={this.props.birthdate?moment(this.props.birthdate).format("YYYY-MM-DD"):null} 
                        />
                     
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
    const { nomtotal,numpolice,birthdate } = selector(state, 'nomtotal', 'numpolice','birthdate');
   
    return {
      nomtotal,
      numpolice,
      birthdate
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