import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector,submit} from 'redux-form';
import {TextField,DatePicker,SelectField} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {graphql,gql} from 'react-apollo';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import ModRegForm from './ModRegForm.jsx';
import {miseajourDispo} from '../../redux/actions/user-actions.js'
import {englishDateToFr,arrayUnique} from '../../utils/utilitaires.js';
import Baby from 'babyparse';
import * as FileSaver from 'file-saver';
import {$} from 'meteor/jquery';
import * as json2xls from 'json2xls';
//import * as excel from 'node-excel-export';


const dataEXL={};
let fullEXL=[];



class InfExport extends Component{
    constructor(props){
        super(props);
        this.state={
             selectedRows:[],
                regSelected:[],
                offset:0,
                limit:10,
                table:{
                        fixedHeader:true,
                        fixedFooter:true,
                        stripedRows:false,
                        showRowHover:false,
                        selectable:true,
                        multiSelectable: false,
                        enableSelectAll:false,
                        deselectOnClickaway:false,
                        showCheckboxes:true,
                        height:'450px'
                    }
        };
    }

    componentDidMount(){
        $('.tableau').parent().css("width","5100px");
    }
    componentWillReceiveProps(){
        fullEXL=[];
        this.setState({
            offset:0,
            limit:10
        })
    }
    render(){
        const {data}=this.props;
        const loadMoreEntries=()=>{
            this.setState({
                offset:this.state.offset+10,
                limit:this.state.limit+10
            });
        };
//tranche du tableau total a afficher
       let tranche=typeof data.dataToExport !=="undefined"?data.dataToExport.slice(this.state.offset,this.state.limit):null;
            fullEXL=tranche?[...fullEXL,...tranche]:[...fullEXL];

        return(
            <div className="infExportContainer">
                <div>
                <div style={{display:'flex',flexDirection:'row',textAlign:'center',justifyContent:'space-around',alignItems:'center',height:'50px'}}>
                    <div>Nombre de lignes actuellement chargées:{data.dataToExport?data.dataToExport.length:(<marquee>Veuillez patientez traitement en cours</marquee>)} </div>
                     <RaisedButton
                                    label="exporter vers excel" 
                                    labelColor="white"
                                    backgroundColor="#141e51"
                                    className="inAppBtnForm"
                                    onClick={()=>{
                                        if(data.dataToExport&&data.dataToExport.length){//si les donnees excel existent
                                            console.dir(fullEXL);
                                            let filename=prompt("Veuillez entrez le nom du fichier");

                                           if(!filename){
                                            return;
                                           }else{
                                                Meteor.call("exportToExcel",data.dataToExport,(err,res)=>{
                                                if(res){
                                                    const buf=new ArrayBuffer(res.length);
                                                    const view=new Uint8Array(buf);
                                                    for(let i=0;i!=res.length;i++) view[i]=res.charCodeAt(i) & 0xFF;
                                                    const blob=new Blob([buf],{
                                                        type:'application/octet-stream'
                                                    });

                                                    const a=window.document.createElement('a');
                                                    a.href=window.URL.createObjectURL(blob,{
                                                        type:'data:attachment/xlsx'
                                                    });
                                                    a.download=filename+'.xlsx';
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                }
                                            });
                                           }
                                            //FileSaver.saveAs(xls,[filename+'.xls']);
                                        }else{
                                            return;
                                        }
                                    }}
                                    />
                </div>
                <Divider/>
                      <Table
                        height={this.state.table.height}
                        fixedHeader={this.state.table.fixedHeader}
                        fixedFooter={this.state.table.fixedFooter}
                        selectable={this.state.table.selectable}
                        multiSelectable={this.state.table.multiSelectable}
                        onRowSelection={()=>{}}
                        className="tableau"
                    >
                        <TableHeader
                            displaySelectAll={this.state.table.showCheckboxes}
                            adjustForCheckbox={this.state.table.showCheckboxes}
                            enableSelectAll={this.state.table.enableSelectAll}
                        >
                            <TableRow>
                            <TableHeaderColumn tooltip="Numéro de l'assuré">No Assuré</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Numéro de règlement">No Règlement</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Numéro de chèque">No Chèque</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Montant du règlement">Montant Règlement</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Mode de règlement">Mode de règlement</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Numéro de police">No Police</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Nom du bénéficiaire">Bénéficiaire</TableHeaderColumn>
                            <TableHeaderColumn tooltip="libellé du sinistre">Libellé du sinistre</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Cause du sinistre">Cause du sinistre</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Type du sinistre">Type du sinistre</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de réception de la demande">Date de réception de la demande</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de naissance du bénéficiaire">Date de naissance du Bénéficiaire</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de dépot à la trésorerie">Dépot Tréso</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de sortie de la trésorerie">Sortie Tréso</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de dépot pour la signature">Dépot Signature</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de réception du règlement après signature">Sortie Signature</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Date de retrait du règlement">Retrait Règlement</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Statut du règlement dans le système">Statut règlement</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Domaine du règlement">Domaine</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Code rédacteur">Rédacteur</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={this.state.table.showCheckboxes}
                            deselectOnClickaway={this.state.table.deselectOnClickaway}
                            showRowHover={this.state.table.showRowHover}
                            stripedRows={this.state.table.stripedRows}
                        >
                    {data.loading?( ''):typeof data.dataToExport!=="undefined"?arrayUnique(fullEXL).map((row,index)=>{
                                            let domaine='';
                                            if(row.domaine==="I")domaine="INDIVIDUEL";
                                            if(row.domaine==="G")domaine="GROUPE";
                                            if(row.domaine==="R")domaine="RENTE";
                                            
                                            return(<TableRow key={index} className="animated bounceInRight" selected={this.state.selectedRows.indexOf(index)!==-1} ref={`user${index}`}>
                                                <TableRowColumn>{++index}</TableRowColumn>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE!=''?row.infoSurRgt[0].NUMERO_CHEQUE:'Aucun numero':'Aucun numero'}</TableRowColumn>
                                                <TableRowColumn>{row.MNTGT}</TableRowColumn>
                                                <TableRowColumn>{row.MRGGT}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].LIBELLE_SINISTRE:''}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].CAUSE_SINISTRE:''}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].TYPE_SINISTRE:''}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].DATE_RECEPTION:''}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.date_depot_treso?moment(row.date_depot_treso).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn >{row.date_sort_treso?moment(row.date_sort_treso).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn> 
                                                <TableRowColumn>{row.date_depot_sign?moment(row.date_depot_sign).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.date_recep_sign_reg?moment(row.date_recep_sign_reg).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn >{row.date_retrait_reg?moment(row.date_retrait_reg).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn> 
                                                <TableRowColumn>{row.statut_reg_retirer}</TableRowColumn>
                                                <TableRowColumn>{domaine}</TableRowColumn>
                                                <TableRowColumn>{row.redac==="ADM"?"Administrateur":row.redac}</TableRowColumn>
                                            </TableRow>);
                                        })
                    :null}
                     </TableBody>
                    </Table>
                    <div className="loadmoreDiv">
                        <RaisedButton 
                            label="Voir les 10 prochaines lignes" 
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={()=>loadMoreEntries()}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

InfExport.propTypes={
    data:PropTypes.shape({
        loading:PropTypes.bool,
        dataToExport:PropTypes.array
    }).isRequired,
  
};

const exportdata=gql`
    query exportdata($typeDate:String,$startDate:String,$endDate:String,$domaine:String){
        dataToExport(typeDate:$typeDate,startDate:$startDate,endDate:$endDate,domaine:$domaine){
            wasrg
            wnrgt
            wnupo
            nom_beneficiaire
            date_naiss
            date_depot_treso
            date_sort_treso
            date_depot_sign
            date_recep_sign_reg
            date_retrait_reg
            statut_reg_retirer
            domaine
            redac
            MNTGT
            MRGGT
            infoSurRgt{
                LIBELLE_SINISTRE
                CAUSE_SINISTRE
                TYPE_SINISTRE
                DATE_RECEPTION
                NUMERO_CHEQUE
                MONTANT_BRUT
                MONTANT_NET_REGLEMENT
                NUMERO_BENEFICIAIRE
            }
        },
        
    }`;

   export default graphql(exportdata,{
    options:({ typeDate,startDate,endDate,domaine}) => ({ variables: { typeDate,startDate,endDate,domaine},fetchPolicy: 'network-only'}),
})(InfExport)