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
import {GRAPHQL_PORT} from "../../api/graphql/server";
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import ServRegBankForm from './ServRegBankForm';
import {$} from 'meteor/jquery';
import {englishDateToFr,formatNumberInMoney} from '../../utils/utilitaires.js';
import {miseajourDispoBank,openBigDialog} from '../../redux/actions/user-actions.js'


//Quand on click sur les checkbox on compte le nombre de lignes selectionnes et on dispacth une action sur store avec side effects de modification dans la database
let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}


  
const ITEMS_PER_PAGE=10;

class ConsultDispoTableBank extends Component{

        constructor(){
            super();
            this.state={
                
                dialogTIsOpen:false,
                dialogIsOpen:false,
                errorMsg:'',
                bankdispo:[],
                setBankDispo:false,
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
            if(!this.props.shouldCloseDialog && this.state.dialogTIsOpen){
                this._dialogTClose();
            }
         /* if(typeof this.props.consultDispoBank !="undefined" && !this.state.setBankDispo){
              this.setState({
                  bankdispo:this.props.consultDispoBank
              })
          }else{
              if(this.state.setBankDispo){
                this.setState({
                    setBankDispo:false
                })
              }  
          }*/
        }
        componentDidMount(){
            $('.tableau').parent().css("width","3786px");
        }

        _dialogTOpen(){
            this.props.dispatch(openBigDialog("BANK"));
            this.setState({dialogTIsOpen: true});
            
        }

        _dialogTClose(){
            this.setState({dialogTIsOpen: false});
        }

        _onRowSelection(rowsarr){
            let regarray=[];
            if(rowsarr){
                rowsarr.map((r)=>{
                regarray.push(this.props.consultDispoBank[r]);
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
            this.props.dispatch(openBigDialog("BANK"));
            console.dir(regarray);
            
        }
        
        render(){
            const {handleSubmit,pristine,submitting,dispatch,data,consultDispoBank,loadMoreEntries,loading}=this.props;
            //console.log(this.props.birthdate+"birthdate");
                const dialogTActions = [
                <FlatButton
                    label="FERMER"
                    primary={true}
                    onTouchTap={this._dialogTClose.bind(this)}
                />,
                <FlatButton
                    label="METTRE A JOUR"
                    primary={true}
                    onTouchTap={()=>dispatch(miseajourDispoBank())}
                />
                ];
console.dir(this.props);
console.dir(this.state);
//alert("mais que pasa?");
            return(
                <div >
                    <Dialog
                    title={this.state.regSelected.length?`Servir le  règlement ${this.state.regSelected[0].wnrgt} ?`:null}
                    actions={dialogTActions}
                    modal={false}
                    open={this.state.dialogTIsOpen}
                    autoDetectWindowHeight={true}
                    onRequestClose={this._dialogTClose}
                    titleStyle={{backgroundColor:'#1f2d67',color:'white'}}
                    contentStyle={{width:'60%',maxWidth:'none'}}
                    autoScrollBodyContent={true}
                    >
                        <ServRegBankForm dispatch={dispatch} initialvalues={{ wnrgt:this.state.regSelected.length?this.state.regSelected[0].wnrgt:null,police:this.state.regSelected.length?this.state.regSelected[0].police:null}} regSelected={this.state.regSelected.length?this.state.regSelected[0]:null} wnrgt={this.state.regSelected.length?this.state.regSelected[0].wnrgt:null} domaine={this.state.regSelected.length?this.state.regSelected[0].domaine:null}/>
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
                            <TableHeaderColumn tooltip="Numéro de règlement">Règlement N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Nom du bénéficiaire">Bénéficiaire</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro du bénéficiaire">Bénéficiaire N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">Police N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de chèque">Chèque N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de naissance du bénéficiaire">Date de naissance</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Type de prestation">Type prestation</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de réception de la demande">Date de réception de la demande</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date du règlement">Date du règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant brut du règlement">Mt brut Règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant net du règlement">Mt net Règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Statut du règlement">Statut</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Validation de la banque">Accord Banque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Commentaires de Nsia Vie Assurances">Commentaires Nsia Vie</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Commentaires de la banque">Commentaires</TableHeaderColumn>
                          
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
                                           ):typeof consultDispoBank!=='undefined'?consultDispoBank.map((row,index)=>{
                                            let statutClass='';
                                            if(row.statut_reg_retirer==="EN COURS")statutClass='animated bounceInRight ';
                                            if(row.statut_reg_retirer==="A LA TRESO")statutClass='animated bounceInRight yellowBack';
                                            if(row.statut_reg_retirer==="SORTIE DE TRESO")statutClass='animated bounceInRight orangeBack';
                                            if(row.statut_reg_retirer==="A LA SIGNATURE")statutClass='animated bounceInRight roseBack';
                                            if(row.statut_reg_retirer==="PRET")statutClass='animated bounceInRight greenBack';
                                            if(row.statut_reg_retirer==="SORTIE")statutClass='animated bounceInRight';
                                            if(row.statut_reg_retirer==="REFUSER")statutClass='animated bounceInRight redBack';
                                            return(<TableRow key={index} className={statutClass} selected={this.state.selectedRows.indexOf(index)!==-1} ref={`user${index}`}>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE!=''?row.infoSurRgt[0].NUMERO_CHEQUE:'"NON DEFINI"':'"NON DEFINI"'}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].TYPE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_RECEPTION):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0].MONTANT_BRUT!=""?row.infoSurRgt[0].MONTANT_BRUT:"NON DISPONIBLE"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0].MONTANT_NET_REGLEMENT!=""?formatNumberInMoney(row.infoSurRgt[0].MONTANT_NET_REGLEMENT):"NON DISPONIBLE"}</TableRowColumn>
                                               <TableRowColumn>{row.statut_reg_retirer==="SORTIE"?"DISPONIBLE":"NON DISPONIBLE"}</TableRowColumn>
                                               <TableRowColumn>{row.ValBank==null||row.ValBank==""?"A DEFINIR":row.ValBank}</TableRowColumn>
                                               <TableRowColumn>{row.Comments==""?"R.A.S":row.Comments}</TableRowColumn>
                                               <TableRowColumn>{row.CommentsBank==""?"R.A.S":row.CommentsBank}</TableRowColumn>
                                             
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


ConsultDispoTableBank=reduxForm({
    form:'modifFormBank',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(ConsultDispoTableBank);

function mapDispatchToProps(state,dispatch){
    const shouldCloseDialog=state.userActions.isBigDialogUp;
    return{
        dispatch,
        shouldCloseDialog
    }
}
ConsultDispoTableBank=connect(mapDispatchToProps)(ConsultDispoTableBank);

ConsultDispoTableBank.propTypes={
    
        loading:PropTypes.bool,
        consultDispoBank:PropTypes.array,
    
    typeDate:PropTypes.string,
     //date:PropTypes.instanceOf(date),
    statut:PropTypes.string,
    domaine:PropTypes.string,
    numregl:PropTypes.number
    
};

const checkDisponibleBank=gql`
    query checkDisponibleBank($startDate:String,$endDate:String,$numrgt:Int,$nomtotal:String,$birthdate:String,$offset:Int,$limit:Int){
        consultDispoBank(startDate:$startDate,endDate:$endDate,numrgt:$numrgt,nomtotal:$nomtotal,birthdate:$birthdate,offset:$offset,limit:$limit){
            wasrg
            wnrgt
            wnupo
            domaine
            nom_beneficiaire
            date_naiss
            date_retrait_reg
            statut_reg_retirer
            Comments
            CommentsBank
            infoSurRgt{
                LIBELLE_SINISTRE
                CAUSE_SINISTRE
                TYPE_SINISTRE
                DATE_RECEPTION
                DATE_REGLEMENT
                NUMERO_CHEQUE
                DECOMPTE
                MONTANT_BRUT
                MONTANT_NET_REGLEMENT
                NUMERO_BENEFICIAIRE
            }
        },
        
    }`;


export default graphql(checkDisponibleBank,{
    options:({startDate,endDate,birthdate,numrgt,nomtotal}) => ({ 
        
        variables: {
            startDate,
            endDate,
            birthdate,
            numrgt,
            nomtotal,
            offset:0,
            limit:ITEMS_PER_PAGE          
    },forceFetch:true }),
        props:({data:{loading,consultDispoBank,fetchMore}})=>{
            return{
                loading,
                consultDispoBank,
                loadMoreEntries(){
                    return fetchMore({
                        variables:{
                            offset:consultDispoBank.length
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            if(!fetchMoreResult.data){return previousResult;}
                            return Object.assign({},previousResult,{
                                consultDispoBank:[...previousResult.consultDispoBank,...fetchMoreResult.data.consultDispoBank],
                            });
                        }
                    });
                }
            }
        }
   
})(ConsultDispoTableBank);


