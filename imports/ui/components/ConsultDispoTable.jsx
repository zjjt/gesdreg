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
import {isEmptyObjectProps,formatNumberInMoney,arrayUnique} from '../../utils/utilitaires';
import gql from 'graphql-tag';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import InfoReg from './InfoReg.jsx';
import {$} from 'meteor/jquery';
import {miseajourDispo} from '../../redux/actions/user-actions.js';
import Icon from 'react-icons-kit';
import {neutral2} from 'react-icons-kit/icomoon/neutral2'//quand letat est null
import {smile2} from 'react-icons-kit/icomoon/smile2'// normal pour RAS
import {tongue2} from 'react-icons-kit/icomoon/tongue2'// pour les OPUS ou avant 2017
import {sad2} from 'react-icons-kit/icomoon/sad2'//quand le delai se rapproche
import {crying2} from 'react-icons-kit/icomoon/crying2'//quand c'est chaud 

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
                        selectable:false,
                        multiSelectable: false,
                        enableSelectAll:false,
                        deselectOnClickaway:false,
                        showCheckboxes:false,
                        height:'450px'
                    }
            };
        }

        componentDidUpdate(){
         
        }
        componentDidMount(){
            $('.tableau').parent().css("width","5032px");
            
            setInterval(()=>{
                Bert.alert({
                    title: 'Informations',
                    message: `Vous pouvez estimer les délais de traitement de chaque règlements en mettant le curseur sur les faces dans la colonne état.<br/>Ce sont:<br/>
                    <ul>
                    <li><img src="/img/tongue2.svg" class="mySvgs" > --> il s'agit la des règlememts dont la date de rendez vous est dépassée</li>
                    <li><img src="/img/smile2.svg"  class="mySvgs" /> --> le traitement du règlement suit son cours normal et est dans le délai imparti</li>
                    <li><img src="/img/sad2.svg"  class="mySvgs" /> --> Le délai assigné est presque atteint il faudrait penser à finaliser le traitement de ce règlement</li>
                    <li><img src="/img/crying2.svg"  class="mySvgs" /> --> le règlement doit être traité d'urgence</li>
                    <li><img src="/img/neutral2.svg"  class="mySvgs" /> --> Regroupe les anciens règlements OPUS ou autres règlements à problème, veuillez contacter le service prestations pour ces cas</li>
                    </ul>`,
                    type: 'info',
                    style: 'growl-top-right',
                    icon: 'fa-check'
                  });
            },250000)
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
//console.dir(this.props);
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
                                <TableHeaderColumn tooltip="Etat d'avancement et suivi interne des délais de traitement du règlement">Suivi du règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro du bénéficiaire">Bénéficiaire No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de règlement">Règlement No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro d'envoi">Envoi No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Mode de règlement">Mode de règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Banque">Banque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Mode de règlement">Numéro de chèque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">Police</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de décompte">Décompte No</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Type de prestations">Type de prestations</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de réception de la demande">Date de réception</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de règlement">Date de règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant brut du règlement">Montant Brut</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant net du règlement">Montant Net</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Nom du bénéficiaire">Bénéficiaire</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de naissance du bénéficiaire">Date de naissance</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de rendez-vous">Date RDV</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Statut du règlement">Statut</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Domaine du règlement">Domaine</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Commentaire">Commentaire</TableHeaderColumn>
                              
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
                                           ):typeof consultDispo!=='undefined'?arrayUnique(consultDispo).map((row,index)=>{
                                               console.log("1 reglement");
                                               console.dir(row);
                                            let domaine='';
                                            let lineTitle="";
                                            let statutClass='';
                                            let prestation='';
                                            let comments=row.Comments;
                                            let etat=row.etat?row.etat.alerte==="TERMINER"?(<Icon icon={tongue2} title={`Niveau d'alerte: ${row.etat.alerte} , il s'agit la des règlememts dont la date de rendez vous est dépassé`} style={{color:"gray"}}/>):row.etat.alerte==="RAS"?(<Icon icon={smile2} title={`Niveau d'alerte: ${row.etat.alerte}, le traitement du règlement suit son cours normal et est dans le délai imparti`} style={{color:"lightgreen"}}/>):row.etat.alerte==="NORMAL"?(<Icon icon={sad2} title={`Niveau d'alerte: ${row.etat.alerte}, il faudrait penser à traiter ce règlement`} style={{color:"orange"}}/>):(<Icon icon={crying2} title={`Niveau d'alerte: ${row.etat.alerte},le règlement doit être traité d'urgence`} style={{color:"red"}}/>):(<Icon icon={neutral2} title={`Voir le service prestations en charge des saisies dans le système`}/>);
                                            let dateRecep=row.infoSurRgt[0]?moment(row.infoSurRgt[0].DATE_RECEPTION).format("DD-MM-YYYY"):'';
                                            let dateRgt=row.infoSurRgt[0]?moment(row.infoSurRgt[0].DATE_REGLEMENT).format("DD-MM-YYYY"):'';
                                            if(row.domaine==="I")domaine="INDIVIDUEL";
                                            if(row.domaine==="G")domaine="GROUPE";
                                            if(row.domaine==="R")domaine="RENTE";
                                            if(row.statut_reg_retirer==="EN COURS"){
                                                statutClass='animated bounceInRight ';
                                                lineTitle="ce règlement attend d'être traité";
                                            }
                                            if(row.statut_reg_retirer==="A LA TRESO"){
                                                statutClass='animated bounceInLeft yellowBack';
                                                lineTitle="ce règlement est à la trésorerie";
                                            }
                                            if(row.statut_reg_retirer==="SORTIE DE TRESO"){
                                                statutClass='animated bounceInLeft orangeBack';
                                                lineTitle="ce règlement est sortie de la trésorerie";
                                            }
                                            if(row.statut_reg_retirer==="A LA SIGNATURE"){
                                                statutClass='animated bounceInLeft roseBack';
                                                lineTitle="ce règlement est à la signature";
                                            }
                                            if(row.statut_reg_retirer==="PRET"){
                                                statutClass='animated bounceInLeft greenBack';
                                                lineTitle="ce règlement est disponible pour être retiré par le client";
                                            }
                                            if(row.statut_reg_retirer==="SORTIE"){
                                                statutClass='animated bounceInLeft redBack';
                                                lineTitle=row.ValBank?"ce règlement a été retiré par le client et a été traité à la banque ":"ce règlement a été retiré par le client";
                                            }
                                            if(row.statut_reg_retirer==="REFUSER"){
                                                statutClass='animated fadeInInLeft brownBack';
                                                lineTitle="ce règlement a été refusé";
                                            }
                                            if(row.statut_reg_retirer==="ANNULER"){
                                                statutClass='animated fadeInInLeft grayBack';
                                                lineTitle="ce règlement a été annulé";
                                            }
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
                                            if((row.MRGGT=="C" && row.chequeState && row.chequeState!="CHEQUE VALIDE")/*&& row.infoSurRgt[0].NUMERO_CHEQUE==""*/){
                                                statutClass='animated fadeInInLeft darkBack';
                                                lineTitle="Le chèque de ce règlement a été annulé";
                                            }
                                            let typeSinistre=row.infoSurRgt[0]&&!statutClass.includes("kakiBack")?row.infoSurRgt[0].TYPE_SINISTRE:statutClass.includes("kakiBack")?prestation:"NON DEFINI";

                                            return(<TableRow key={index} className={statutClass} selected={this.state.selectedRows.indexOf(index)!==-1} ref={`user${index}`} title={lineTitle}>
                                                <TableRowColumn>{statutClass.includes("kakiBack")?"M":etat}</TableRowColumn>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.Num_envoi?row.Num_envoi:"AUCUN"}</TableRowColumn>
                                                <TableRowColumn>{row.MRGGT}</TableRowColumn>
                                                <TableRowColumn>{row.banque?row.banque:"AUCUNE"}</TableRowColumn>
                                                <TableRowColumn>{row.cheque?row.cheque:row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE:"AUCUN"}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{typeof row.infoSurRgt[0]!="undefined"?row.infoSurRgt[0].DECOMPTE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{typeSinistre!=""?typeSinistre:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{dateRecep!=""?dateRecep:"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{dateRgt!=""?dateRgt:"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{typeof row.infoSurRgt[0]!="undefined"?formatNumberInMoney(row.infoSurRgt[0].MONTANT_BRUT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{typeof row.infoSurRgt[0]!="undefined"?formatNumberInMoney(row.infoSurRgt[0].MONTANT_NET_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.dateRDV?moment(row.dateRDV).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                               <TableRowColumn>{row.statut_reg_retirer}</TableRowColumn>
                                                <TableRowColumn>{domaine}</TableRowColumn>
                                                <TableRowColumn>{row.Comments?comments:"R.A.S"}</TableRowColumn>

                                             
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
                     Pour effectuer une recherche de règlement disponibles,veuillez entrez la date de naissance du bénéficiaire selon le format indiqué <b>JJ-MM-AAAA</b>, ou le numéro de police ou le nom complet du bénéficiaire.<br/>
                     Vous pouvez reconnaitre le statut qu'un règlement a dans le système en observant la couleur de fond de la ligne du tableau qu'il occupe<br/>
                      Ces couleurs sont:<br/>
                        -<span style={{color:"white"}}>BLANC</span> pour le statut <b>EN COURS</b><br/>
                        -<span style={{color:"yellow"}}>JAUNE</span> pour le statut <b>A LA TRESO</b><br/>
                        -<span style={{color:"orange"}}>ORANGE</span> pour le statut <b>SORTIE DE TRESO</b><br/> 
                        -<span style={{color:"pink"}}>ROSE</span> pour le statut <b>A LA SIGNATURE</b><br/> 
                        -<span style={{color:"green"}}>VERT</span> pour le statut <b>PRET</b><br/> 
                        -<span style={{color:"red"}}>ROUGE</span> pour le statut <b>SORTIE</b><br/><br/>
                        -<span style={{color:"brown"}}>MARRON</span> pour le statut <b>REFUSER</b><br/><br/>
                        -<span style={{color:"#63600a"}}>JAUNE VOMI</span> pour le statut <b>ANNULER</b>dans <b>GESDREG</b><br/><br/>
                        -<span style={{color:"#eddb9f"}}>KAKI</span> pour les reglements manuels <b>MANUELS</b><br/><br/>
                        -<span style={{color:"#1a1918"}}>NOIR SOMBRE</span> pour les reglements dont les chèques / envois sont annulés depuis <b>SUNSHINE</b><br/><br/>


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
    query checkDisponible($numrgt:Int,$numcheque:Int,$numpol:Int,$numenv:Int,$nomtotal:String,$birthdate:String,$offset:Int,$limit:Int){
        consultDispo(numrgt:$numrgt,numcheque:$numcheque,numpolice:$numpol,numenv:$numenv,nomtotal:$nomtotal,birthdate:$birthdate,offset:$offset,limit:$limit){
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
            MRGGT
            statut_reg_retirer
            cheque
            banque
            domaine
            redac
            dateRDV
            chequeState
            etat{
                nbj
                alerte
            }
            infoSurRgt{
                LIBELLE_SINISTRE
                CAUSE_SINISTRE
                TYPE_SINISTRE
                DECOMPTE
                DATE_RECEPTION
                DATE_REGLEMENT
                NUMERO_CHEQUE
                MONTANT_BRUT
                MONTANT_NET_REGLEMENT
                NUMERO_BENEFICIAIRE
            }
        },
        
    }`;


export default graphql(checkDisponible,{
    options:({ birthdate,numpol,numrgt,nomtotal,numenv,numcheque}) => ({ 
        
        variables: {
            birthdate,
            numpol,
            numrgt,
            numcheque,
            numenv,
            nomtotal,
            offset:0,
            limit:ITEMS_PER_PAGE          
    },fetchPolicy: 'network-only' }),
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
                            if(!fetchMoreResult){return previousResult;}
                            return Object.assign({},previousResult,{
                                consultDispo:[...previousResult.consultDispo,...fetchMoreResult.consultDispo],
                            });
                        }
                    });
                }
            }
        }
   
})(ConsultDispoTable);


