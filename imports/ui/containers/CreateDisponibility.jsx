import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import CreateDispoForm from '../components/CreateDispoForm.jsx';
import CreateUserForm from '../components/CreateUserForm.jsx';


export default class CreateDisponibility extends Component {
    constructor(){
        super();

    }
    componentDidMount(){
        $('.toolbarTitle').delay(18000).show().addClass("fadeInRight animated");
    }
    render(){
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
                            <ToolbarTitle text="Créer une nouvelle disponibilité de règlement " className="toolbarTitle"/>
                        </ToolbarGroup>
                    </Toolbar>
                    <Divider/>
                    <CreateDispoForm/>
                </div>
            </div>
        );
    }
}

const style={
    homeicon:{
        width: 40,
        height: 40
    },
    toolbar:{
        backgroundColor:'white',
    }
};