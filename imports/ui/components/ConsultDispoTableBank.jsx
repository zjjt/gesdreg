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
import ServRegBankForm from './ServRegBankForm';
import {$} from 'meteor/jquery';
import {englishDateToFr,formatNumberInMoney} from '../../utils/utilitaires.js';
import {miseajourDispoBank,openBigDialog,selectedReg} from '../../redux/actions/user-actions.js'


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

        componentWillMount(){
           
        }
        componentWillUpdate(){
            //Ici on gere la subscription 
            console.log(this.props);
            
        }
        componentDidUpdate(){
            console.log(this.props.shouldCloseDialog+"  "+this.state.dialogTIsOpen);
            if(!this.props.shouldCloseDialog && this.state.dialogTIsOpen){
                this.props.subscribeToRegUpdate({wnrgt:this.props.selectedRgt});
                this._dialogTClose();
                this.props.refetch();
            }
        }
        componentDidMount(){
            $('.tableau').parent().css("width","4037px");
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
            if(regarray.length){
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
                this.props.dispatch(selectedReg(regarray[0].wnrgt));
                //console.dir(regarray);
            }
            
            
            
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
                                <TableHeaderColumn tooltip="Nom de la banque">Banque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">Police N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de chèque">Chèque N°</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro d'envoi">Envoi N°</TableHeaderColumn>
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
                                <TableHeaderColumn tooltip="Caissier">Traité par</TableHeaderColumn>                        
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
                                            //on filtre que pour montreer les reglements NB
                                                let statutClass='';
                                                let prestation='';
                                                let comments=row.Comments;
                                            if(row.ValBank=="")statutClass='animated bounceInRight ';
                                            if(row.ValBank==="OUI")statutClass='animated bounceInLeft greenBack';
                                            if(row.ValBank==="NON")statutClass='animated bounceInLeft redBack';
                                            if(row.Comments && row.Comments.includes("%MAN%")){
                                                statutClass='animated fadeInInLeft kakiBack';
                                                lineTitle="c'est un règlement manuel";
                                                comments.replace("%MAN%"," ");
                                                //recuperation du type de prestation
                                                prestation = row.Comments.substring(
                                                    row.Comments.lastIndexOf("$") + 1, 
                                                    row.Comments.lastIndexOf("!")
                                                );
                                                comments.replace(`$${prestation}!`," ");
                                            }
                                            console.dir(row);
                                            return(<TableRow key={index} className={statutClass} selected={this.state.selectedRows.indexOf(index)!==-1} ref={`user${index}`}>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.banque}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE!=''?row.infoSurRgt[0].NUMERO_CHEQUE:'"NON DEFINI"':'"NON DEFINI"'}</TableRowColumn>
                                                <TableRowColumn>{row.Num_envoi?row.Num_envoi:"AUCUN"}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]&&!statutClass.includes("kakiBack")?row.infoSurRgt[0].TYPE_SINISTRE:statutClass.includes("kakiBack")?prestation:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_RECEPTION):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?formatNumberInMoney(row.infoSurRgt[0].MONTANT_BRUT):"NON DISPONIBLE"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?formatNumberInMoney(row.infoSurRgt[0].MONTANT_NET_REGLEMENT):"NON DISPONIBLE"}</TableRowColumn>
                                               <TableRowColumn>{row.statut_reg_retirer==="SORTIE"?"DISPONIBLE":"NON DISPONIBLE"}</TableRowColumn>
                                               <TableRowColumn>{row.ValBank==null||row.ValBank==""?"A DEFINIR":row.ValBank}</TableRowColumn>
                                               <TableRowColumn>{row.Comments?comments:"R.A.S"}</TableRowColumn>
                                               <TableRowColumn>{row.CommentsBank?row.CommentsBank:"RIEN"}</TableRowColumn>
                                               <TableRowColumn>{row.infosRedac[0].nom+' '+row.infosRedac[0].prenom}</TableRowColumn>
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
                     Pour effectuer une recherche de règlement disponibles pour retrait:<br/>- Veuillez entrez la date de naissance du bénéficiaire selon le format indiqué <b>JJ/MM/AAAA</b>, ou le numéro de règlement figurant sur le chèque ou encore le nom complet du bénéficiaire.<br/>
                     Vous pouvez savoir si un règlement a été servi ou non en observant la couleur de fond de la ligne du tableau qu'il occupe<br/>
                      Ces couleurs sont:<br/>
                        -<span style={{color:"white"}}>BLANC</span> pour un règlement en cours<br/>
                        -<span style={{color:"green"}}>VERT</span> pour un règlement effectué <b>PRET</b><br/> 
                        -<span style={{color:"red"}}>ROUGE</span> pour un règlement rejeté<br/><br/>
                     <br/>Les recherches sont complémentaires et peuvent être combinés pour un résultat plus précis.<br/>
                     <b>NB:LES RECHERCHES SONT EXECUTEES DYNAMIQUEMENT / AUTOMATIQUEMENT.</b>
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
    query checkDisponibleBank($numrgt:Int,$numcheque:Int,$numpol:Int,$banque:String,$numenv:Int,$nomtotal:String,$birthdate:String,$offset:Int,$limit:Int){
        consultDispoBank(numrgt:$numrgt,numcheque:$numcheque,numpolice:$numpol,banque:$banque,numenv:$numenv,nomtotal:$nomtotal,birthdate:$birthdate,offset:$offset,limit:$limit){
            wasrg
            wnrgt
            wnupo
            Num_envoi
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
            dateRDV
            ValBank
            banque
            Comments
            CommentsBank
            infosRedac {
                nom
                prenom
                role
                redac
            }
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

const regUpdatedSub=gql`
    subscription regUpdated($wnrgt:Int){
        rgtUpdated(wnrgt:$wnrgt){
            wnrgt
            domaine   
        }
    }
`;
export default graphql(checkDisponibleBank,{
    options:({startDate,endDate,birthdate,numpol,banque,numrgt,nomtotal,numenv,numcheque}) => ({ 
        
        variables: {
            startDate,
            endDate,
            birthdate,
            numpol,
            banque,
            numrgt,
            nomtotal,
            numenv,
            numcheque,
            offset:0,
            limit:ITEMS_PER_PAGE          
    },fetchPolicy: 'cache-and-network' }),
        props:({data:{loading,consultDispoBank,fetchMore,subscribeToMore,refetch},selectedRgt})=>{
            return{
                loading,
                refetch,
                consultDispoBank,
                subscribeToRegUpdate:params=>{
                    return subscribeToMore({
                        document: regUpdatedSub,
                        variables: {
                          wnrgt: params.wnrgt,
                        },
                        updateQuery: (prev, {subscriptionData}) => {
//alert(JSON.stringify(subscriptionData));
                          if (!subscriptionData.data) {
                            return prev;
                          }
                  
                          const regModified = subscriptionData.data.regUpdated;
                          //alert(regModified);
                          return Object.assign({}, prev, {
                            consultDispoBank:[...prev.consultDispoBank, regModified]
                          
                        });
                          // don't double add the message
                          /*if (!prev.consultDispoBank.find((msg) => msg.ValBank && msg.CommentsBank === regModified.ValBank && regModified.CommentsBank)) {
                            return Object.assign({}, prev, {
                                consultDispoBank:[...prev.consultDispoBank, regModified]
                              
                            });
                          } else {
                            return prev;
                          }*/
                        }
                      });
                },
                loadMoreEntries(){
                    return fetchMore({
                        variables:{
                            offset:consultDispoBank.length
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            if(!fetchMoreResult){return previousResult;}
                            return Object.assign({},previousResult,{
                                consultDispoBank:[...previousResult.consultDispoBank,...fetchMoreResult.consultDispoBank],
                            });
                        }
                    });
                }
            }
        }
   
})(ConsultDispoTableBank);


