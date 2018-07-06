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
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import InfoReg from './InfoReg.jsx';
import {$} from 'meteor/jquery';
import {miseajourDispo} from '../../redux/actions/user-actions.js'


//Quand on click sur les checkbox on compte le nombre de lignes selectionnes et on dispacth une action sur store avec side effects de modification dans la database
let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}


const ITEMS_PER_PAGE=10;

class ConsultDispoTable extends Component{

        constructor(){
            super();
            this.state={
                
                dialogTIsOpen:false,
                dialogIsOpen:false,
                errorMsg:'',
                selectedRows:[],
                regSelected:[],
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

        componentDidUpdate(){
          
        }
        componentDidMount(){
            $('.tableau').parent().css("width","2646px");
        }

        _dialogTOpen(){
            this.setState({dialogTIsOpen: true});
        }

        _dialogTClose(){
            this.setState({dialogTIsOpen: false});
        }

        _onRowSelection(rowsarr){
            let regarray=[];
            if(rowsarr){
                rowsarr.map((r)=>{
                regarray.push(this.props.listeDispo[r]);
                //console.dir(this.props.data.userSQL[r])
             });
            }
            switch(regarray[0].domaine){
                case "I":
                regarray[0].domainefull="INDIVIDUEL";
                break;
                 case "G":
                regarray[0].domainefull="GROUPE";
                break;
                 case "R":
                regarray[0].domainefull="RENTE";
                break;
                
            }
            this.setState({
                selectedRows:rowsarr,
                regSelected:regarray,
                dialogTIsOpen:true
            });
            console.dir(regarray);
            
        }
        
        render(){
            const {handleSubmit,pristine,submitting,dispatch,data,consultDispo,loadMoreEntries,loading}=this.props;
            console.log(this.props.birthdate+"birthdate");
           
                const dialogTActions = [
                <FlatButton
                    label="FERMER"
                    primary={true}
                    onTouchTap={this._dialogTClose.bind(this)}
                />,
               
                ];
console.dir(this.props);
            return(
                <div >
                    <Dialog
                    title={this.state.regSelected.length?`Informations sur le  règlement ${this.state.regSelected[0].wnrgt} dans le domaine ${this.state.regSelected[0].domainefull}`:null}
                    actions={dialogTActions}
                    modal={false}
                    open={this.state.dialogTIsOpen}
                    onRequestClose={this._dialogTClose}
                    titleStyle={{backgroundColor:'#1f2d67',color:'white'}}
                    contentStyle={{width:'60%',maxWidth:'none'}}
                    autoScrollBodyContent={true}
                    >
                        <InfoReg dispatch={dispatch} regSelected={this.state.regSelected.length?this.state.regSelected[0]:null} wnrgt={this.state.regSelected.length?this.state.regSelected[0].wnrgt:null} domaine={this.state.regSelected.length?this.state.regSelected[0].domaine:null}/>
                    </Dialog>
                    <Table
                        height={this.state.table.height}
                        fixedHeader={this.state.table.fixedHeader}
                        fixedFooter={this.state.table.fixedFooter}
                        selectable={this.state.table.selectable}
                        multiSelectable={this.state.table.multiSelectable}
                        onRowSelection={this._onRowSelection.bind(this)}
                        className="tableau"
                    >
                        <TableHeader
                            displaySelectAll={this.state.table.showCheckboxes}
                            adjustForCheckbox={this.state.table.showCheckboxes}
                            enableSelectAll={this.state.table.enableSelectAll}
                        >
                            <TableRow>
                                <TableHeaderColumn tooltip="Numéro du bénéficiaire">Bénéficiaire No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de règlement">Règlement No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">Police</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Nom du bénéficiaire">Bénéficiaire</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de naissance du bénéficiaire">Date de naissance</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Statut du règlement">Statut</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Domaine du règlement">Domaine</TableHeaderColumn>
                              
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={this.state.table.showCheckboxes}
                            deselectOnClickaway={this.state.table.deselectOnClickaway}
                            showRowHover={this.state.table.showRowHover}
                            stripedRows={this.state.table.stripedRows}
                        >
                        {
                            
                           (loading)?(
                                            <TableRow>
                                               <TableRowColumn colSpan="14">
                                                    <div style={{textAlign:'center'}}>
                                                Recherchez les disponibilités en sélectionnant<br/>
                                                    le type de date puis la date recherchée et enfin le statut     
                                                    </div>
                                               </TableRowColumn>
                                            </TableRow>
                                           ):typeof consultDispo!=='undefined'?consultDispo.map((row,index)=>{
                                            let domaine='';
                                            let statutClass='';
                                            if(row.domaine==="I")domaine="INDIVIDUEL";
                                            if(row.domaine==="G")domaine="GROUPE";
                                            if(row.domaine==="R")domaine="RENTE";
                                            if(row.statut_reg_retirer==="EN COURS")statutClass='animated bounceInRight ';
                                            if(row.statut_reg_retirer==="A LA TRESO")statutClass='animated bounceInRight yellowBack';
                                            if(row.statut_reg_retirer==="SORTIE DE TRESO")statutClass='animated bounceInRight orangeBack';
                                            if(row.statut_reg_retirer==="A LA SIGNATURE")statutClass='animated bounceInRight roseBack';
                                            if(row.statut_reg_retirer==="PRET")statutClass='animated bounceInRight greenBack';
                                            if(row.statut_reg_retirer==="SORTIE")statutClass='animated bounceInRight redBack';
                                            return(<TableRow key={index} className={statutClass} selected={this.state.selectedRows.indexOf(index)!==-1} ref={`user${index}`}>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                               <TableRowColumn>{row.statut_reg_retirer}</TableRowColumn>
                                                <TableRowColumn>{domaine}</TableRowColumn>
                                             
                                            </TableRow>);
                                        }):<TableRow>
                                               <TableRowColumn colSpan="14">
                                                    <div style={{textAlign:'center'}}>
                                                Aucun reglement disponible    
                                                    </div>
                                               </TableRowColumn>
                                            </TableRow>
                                        
                        }
                        </TableBody>
                    </Table>
                     <div className="loadmoreDiv">
                     
                        <RaisedButton 
                            label="Voir les 10 prochaines lignes" 
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={()=>loadMoreEntries()}
                        />
                        {loading?"Chargement...":null}
                    </div>
                    <div className="helperDiv">
                     Pour effectuer une recherche de règlement disponibles,veuillez entrez la date de naissance du bénéficiaire selon le format indiqué <b>AAAA-MM-JJ</b>, ou le numéro de police ou le nom complet du bénéficiaire.<br/>
                     Vous pouvez reconnaitre le statut qu'un règlement a dans le système en observant la couleur de fond de la ligne du tableau qu'il occupe<br/>
                      Ces couleurs sont:<br/>
                        -<span style={{color:"white"}}>BLANC</span> pour le statut <b>EN COURS</b><br/>
                        -<span style={{color:"yellow"}}>JAUNE</span> pour le statut <b>A LA TRESO</b><br/>
                        -<span style={{color:"orange"}}>ORANGE</span> pour le statut <b>SORTIE DE TRESO</b><br/> 
                        -<span style={{color:"pink"}}>ROSE</span> pour le statut <b>A LA SIGNATURE</b><br/> 
                        -<span style={{color:"green"}}>VERT</span> pour le statut <b>PRET</b><br/> 
                        -<span style={{color:"red"}}>ROUGE</span> pour le statut <b>SORTIE</b><br/><br/>
                     <br/>Les recherches sont complémentaires et peuvent être combinés pour un résultat plus précis.<br/>
                     <b>NB:LES RECHERCHES SONT EXECUTEES DYNAMIQUEMENT.</b>
                     </div>
                </div>
            );
        }

}


ConsultDispoTable=reduxForm({
    form:'modifForm',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(ConsultDispoTable);
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
ConsultDispoTable=connect(mapDispatchToProps)(ConsultDispoTable);

ConsultDispoTable.propTypes={
    
        loading:PropTypes.bool,
       consultDispo:PropTypes.array,
    
    typeDate:PropTypes.string,
     //date:PropTypes.instanceOf(date),
    statut:PropTypes.string,
    domaine:PropTypes.string,
    numregl:PropTypes.number
    
};

const checkDisponible=gql`
    query checkDisponible($numpol:Int,$nomtotal:String,$birthdate:String,$offset:Int,$limit:Int){
        consultDispo(numpolice:$numpol,nomtotal:$nomtotal,birthdate:$birthdate,offset:$offset,limit:$limit){
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
        },
        
    }`;


export default graphql(checkDisponible,{
    options:({ birthdate,numpol,nomtotal}) => ({ 
        
        variables: {
            birthdate,
            numpol,
            nomtotal,
            offset:0,
            limit:ITEMS_PER_PAGE          
    },fetchPolicy: 'cache-and-network' }),
        props:({data:{loading,consultDispo,fetchMore}})=>{
            return{
                loading,
                consultDispo,
                loadMoreEntries(){
                    return fetchMore({
                        variables:{
                            offset:consultDispo.length
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            if(!fetchMoreResult.data){return previousResult;}
                            return Object.assign({},previousResult,{
                                consultDispo:[...previousResult.consultDispo,...fetchMoreResult.data.consultDispo],
                            });
                        }
                    });
                }
            }
        }
   
})(ConsultDispoTable);


