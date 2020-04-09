import {FlowRouter} from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';
import {mount} from 'react-mounter';
import React from 'react';
import store from '../../redux/store.js'
import MainLayout from '../../ui/Layouts/MainLayout/MainLayout.jsx';
import MainLayoutOff from '../../ui/Layouts/MainLayout/MainLayoutOff.jsx';
import Login from '../../ui/containers/Login.jsx';
import AdminLogin from '../../ui/containers/AdminLogin.jsx';
import AdminDashboard from '../../ui/containers/AdminDashboard.jsx';
import Dashboard from '../../ui/containers/Dashboard.jsx';
import CreateUser from '../../ui/containers/CreateUser.jsx';
import CreateDisponibility from '../../ui/containers/CreateDisponibility.jsx';
import ListDisponibilities from '../../ui/containers/ListDisponibilities.jsx';
import Exportation from '../../ui/containers/Exportation.jsx';
import AdminUserList from '../../ui/containers/AdminUserList.jsx';
import ConsultDispo from '../../ui/containers/Consultation.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Session} from 'meteor/session';

injectTapEventPlugin();
FlowRouter.route('/',{
	name:'home',
	triggersEnter:[(context,redirect)=>{
		if(Meteor.user()){
			redirect('/dashboard');
		}
	}],
	action(){
		mount(MainLayoutOff,
			{content:()=><Login/>})
	}
});
FlowRouter.route('/create',{
	name:'createdispo',
	
	action(){
		mount(MainLayout,
			{content:()=><CreateDisponibility/>})
	}
});
FlowRouter.route('/admin',{
	name:'admin',
	action(){
		mount(MainLayoutOff,
			{content:()=><AdminLogin/>})
	}
});

FlowRouter.route('/dashboard',{
	name:'dashboard',
	triggersEnter:[(context,redirect)=>{
		if(!Meteor.user()){
			redirect('/');
		}
	}],
	action(){
		
		mount(MainLayout,
			{content:()=><Dashboard/>})
	}
});
FlowRouter.route('/dashboard/consult_dispo',{
	name:'dispo',
	triggersEnter:[(context,redirect)=>{
		if(!Meteor.user()){
			redirect('/');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><ConsultDispo userRole={Session.get("userRole")} banque={Session.get("banque")}/>})
	}
});
FlowRouter.route('/dashboard/list_dispo',{
	name:'dispolist',
	triggersEnter:[(context,redirect)=>{
		if(!Meteor.user()){
			redirect('/');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><ListDisponibilities/>})
	}
});
FlowRouter.route('/dashboard/export_excel',{
	name:'excel',
	triggersEnter:[(context,redirect)=>{
		if(!Meteor.user()){
			redirect('/');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><Exportation/>})
	}
});

FlowRouter.route('/admin/dashboard',{
	name:'adminDashboard',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><AdminDashboard/>})
	}
});

FlowRouter.route('/admin/dashboard/create_user',{
	name:'createUser',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><CreateUser/>})
	}
});

FlowRouter.route('/admin/dashboard/list_user',{
	name:'listUser',
	triggersEnter:[(context,redirect)=>{
		const isAdminConnected=store.getState().administrateurAction.adminConnected;
		console.log(isAdminConnected);
		if(!isAdminConnected){
			redirect('/admin');
		}
	}],
	action(){
		mount(MainLayout,
			{content:()=><AdminUserList/>})
	}
});