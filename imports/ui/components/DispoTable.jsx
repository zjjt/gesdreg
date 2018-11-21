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
import ModRegForm from './ModRegForm.jsx';
import {miseajourDispo,openBigDialog} from '../../redux/actions/user-actions.js'
import {englishDateToFr, formatNumberInMoney} from '../../utils/utilitaires.js';
import LinearProgress from 'material-ui/LinearProgress';
import {$} from 'meteor/jquery';
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

class DispoTable extends Component{

        constructor(){
            super();
            this.state={
                
                dialogTIsOpen:false,
                dialogIsOpen:false,
                errorMsg:'',
                selectedRows:[],
                regSelected:[],
                listeDispo:[],
                loaderVisible:false,
                table:{
                        fixedHeader:true,
                        fixedFooter:true,
                        stripedRows:false,
                        showRowHover:false,
                        selectable:true,
                        multiSelectable: true,
                        enableSelectAll:true,
                        allRowsSelected:false,
                        deselectOnClickaway:true,
                        showCheckboxes:true,
                        height:'450px'
                    }
            };
        }

        componentDidUpdate(){
          //console.dir(this.props);
          const {isBigDialogUp}=this.props;
          console.log(isBigDialogUp);
          if(!isBigDialogUp && this.state.dialogTIsOpen){
              console.log(isBigDialogUp);
                this._dialogTClose();
                this.props.refetch();
            }
          if(this.props.listeDispo!=this.state.listeDispo && typeof this.props.listeDispo!="undefined"){
            this.setState({listeDispo:this.props.listeDispo})
             }
             /*let newState = Object.assign({}, this.state);
             newState.table.allRowsSelected = this.props.sall;
             this.setState(newState);*/
        }
        componentWillUpdate(){
            
        }
        componentDidMount(){
            $('.tableau').parent().css("width","7017px");
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
            if(this.state.regSelected.length){
                this.setState({dialogTIsOpen: true});
                this.props.dispatch(openBigDialog("MOD"));
            }else{
                alert("Veuillez sélectionner au moins un règlement pour effectuer une modification");
            }
            
        }

        _dialogTClose(){
            console.dir(this.refs);
            if(Array.isArray(this.state.selectedRows)&& this.state.selectedRows.length){
                this.state.selectedRows.map((e,i,arr)=>{
                    this.refs[`ligne${i}`].props.selected=!this.refs[`ligne${i}`].props.selected;
                   // console.log(this.refs[`ligne${i}`].props.selected);
                });
            }
            
            this.setState({
                dialogTIsOpen: false,
                selectedRows:[],
                regSelected:[],
            });
           
            console.dir(this.props);
         // this.forceUpdate(()=>{});
        }

       

        _onRowSelection(selectedRows){
            let regarray=[];
            if(Array.isArray(selectedRows)){
                selectedRows.map((r)=>{
                regarray.push(this.props.listeDispo[r]);
                //console.dir(this.props.data.userSQL[r])
             });
            }else{
                regarray=this.props.listeDispo; 
                //alert("Afin de minimiser la memoire utilisé")
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
                selectedRows:selectedRows,
                regSelected:regarray,
                //dialogTIsOpen:true
            });
            //this.props.dispatch(openBigDialog("MOD"));
            console.dir(regarray);
            
        }
        render(){
            const {handleSubmit,pristine,submitting,dispatch,data,error,listeDispo,loadMoreEntries,loading,isBigDialogUp}=this.props;
            let statutClass='animated bounceInRight ';
            let liste=listeDispo;
            
            console.log(JSON.stringify(error));
            console.dir(this.props);
            const mettreAjour=()=>{
                this.setState({
                    loaderVisible:true
                });
                    Meteor.call('maj_database',(err,res)=>{
                            if(res){
                                this.setState({
                                    loaderVisible:false
                                });
                            }else if(err){
                                this.setState({
                                    errorMsg:"La mise à jour a échoué."
                                    });
                                this._dialogOpen();
                            }
                    });
                };

                const dialogTActions = [
                <FlatButton
                    label="FERMER"
                    primary={true}
                    onTouchTap={this._dialogTClose.bind(this)}
                />,
                <FlatButton
                    label="METTRE A JOUR"
                    primary={true}
                    onTouchTap={()=>dispatch(miseajourDispo())}
                />,
                ];
                //alert(JSON.stringify(data))
                console.dir(this.state);
            return(
                <div >
                    <Dialog
                    title={this.state.regSelected.length?this.props.numenv?`Modification de la disponibilité des règlements de l'envoi ${parseInt(this.props.numenv,10)}`:`Modification de la disponibilité des ${this.state.regSelected.length} règlements sélectionnés`:null}
                    actions={dialogTActions}
                    modal={false}
                    open={this.state.dialogTIsOpen}
                    onRequestClose={this._dialogTClose}
                    titleStyle={{backgroundColor:'#1f2d67',color:'white'}}
                    contentStyle={{width:'60%',maxWidth:'none'}}
                    autoScrollBodyContent={true}
                    >
                        <ModRegForm dispatch={dispatch} numenv={this.props.numenv?parseInt(this.props.numenv,10):null} regSelected={this.state.regSelected.length?this.state.regSelected:null} wnrgt={this.state.regSelected.length?this.state.regSelected[0].wnrgt:null} domaine={this.state.regSelected.length?this.state.regSelected[0].domaine:null}/>
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
                                <TableHeaderColumn tooltip="Nom du bénéficiaire">Bénéficiaire</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de naissance du bénéficiaire">Date de naissance du Bénéficiaire</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de l'assuré">No Assuré</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de police">No Police</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de décompte">No Décompte</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de règlement">No Règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro d'envoi">No Envoi</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Mode de règlement">Mode de règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Type du sinistre">Type du sinistre</TableHeaderColumn>
                                <TableHeaderColumn tooltip="libellé du sinistre">Libellé du sinistre</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Cause du sinistre">Cause du sinistre</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de réception de la demande">Date de réception de la demande</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date du règlement">Date du règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Montant net du règlement">Montant Net Règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Numéro de chèque">No Chèque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de rendez-vous pour retrait par le client">Rendez-Vous le</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de dépot à la trésorerie">Dépot Tréso</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de sortie de la trésorerie">Sortie Tréso</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de dépot pour la signature">Dépot Signature</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de réception du règlement après signature">Sortie Signature</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Date de retrait du règlement">Retrait Règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Statut du règlement dans le système">Statut règlement</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Domaine du règlement">Domaine</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Code rédacteur">Rédacteur</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Validation de la banque">Accord Banque</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Commentaires de Nsia Vie Assurances">Commentaires Nsia Vie</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Commentaires de la banque">Commentaires Banque</TableHeaderColumn>
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
                                               <TableRowColumn colSpan="8">
                                                    <div style={{textAlign:'center'}}>
                                                Recherchez les disponibilités en sélectionnant<br/>
                                                    le type de date puis la date recherchée et enfin le statut     
                                                    </div>
                                               </TableRowColumn>
                                            </TableRow>
                                           ): typeof this.state.listeDispo!=="undefined" && this.state.listeDispo.length?this.state.listeDispo.map((row,index)=>{
                                            let domaine='';
                                            let lineTitle="";
                                            let etat=row.etat?row.etat.alerte==="TERMINER"?(<Icon icon={tongue2} title={`Niveau d'alerte: ${row.etat.alerte} , il s'agit la des règlememts dont la date de rendez vous est dépassé`} style={{color:"gray"}}/>):row.etat.alerte==="RAS"?(<Icon icon={smile2} title={`Niveau d'alerte: ${row.etat.alerte}, le traitement du règlement suit son cours normal et est dans le délai imparti`} style={{color:"lightgreen"}}/>):row.etat.alerte==="NORMAL"?(<Icon icon={sad2} title={`Niveau d'alerte: ${row.etat.alerte}, il faudrait penser à traiter ce règlement`} style={{color:"orange"}}/>):(<Icon icon={crying2} title={`Niveau d'alerte: ${row.etat.alerte},le règlement doit être traité d'urgence`} style={{color:"red"}}/>):(<Icon icon={neutral2} title={`Voir le service prestations en charge des saisies dans le système`}/>);
                                            if(row.domaine==="I"){
                                                domaine="INDIVIDUEL";
                                            }
                                            if(row.domaine==="G"){
                                                domaine="GROUPE";
                                            }
                                            if(row.domaine==="R"){
                                                domaine="RENTE";
                                            }
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
                                            console.dir(row);
                                            return(<TableRow key={index} className={ statutClass } selected={this.state.selectedRows.length?true:false} ref={`ligne${index}`} title={lineTitle}>
                                                <TableRowColumn>{etat}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].DECOMPTE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.Num_envoi?row.Num_envoi:"AUCUN"}</TableRowColumn>
                                                <TableRowColumn>{row.MRGGT}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].TYPE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].LIBELLE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].CAUSE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_RECEPTION):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?formatNumberInMoney(row.infoSurRgt[0].MONTANT_NET_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE!=''?row.infoSurRgt[0].NUMERO_CHEQUE:'"NON DEFINI"':'"NON DEFINI"'}</TableRowColumn>
                                                <TableRowColumn>{row.dateRDV?moment(row.dateRDV).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.date_depot_treso?moment(row.date_depot_treso).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn >{row.date_sort_treso?moment(row.date_sort_treso).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn> 
                                                <TableRowColumn>{row.date_depot_sign?moment(row.date_depot_sign).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn>{row.date_recep_sign_reg?moment(row.date_recep_sign_reg).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn>
                                                <TableRowColumn >{row.date_retrait_reg?moment(row.date_retrait_reg).format("DD-MM-YYYY"):"NON DEFINIE"}</TableRowColumn> 
                                                <TableRowColumn>{row.statut_reg_retirer}</TableRowColumn>
                                                <TableRowColumn>{domaine}</TableRowColumn>
                                                <TableRowColumn>{row.redac==="ADM"?"Administrateur":row.redac}</TableRowColumn>
                                                <TableRowColumn>{row.ValBank?row.ValBank:"Pas encore"}</TableRowColumn>
                                                <TableRowColumn>{row.Comments?row.Comments:"Aucun commentaire"}</TableRowColumn>
                                                <TableRowColumn>{row.CommentsBank?row.CommentsBank:"Aucun commentaire"}</TableRowColumn>
                                                <TableRowColumn></TableRowColumn>
                                            </TableRow>);
                                        }):<TableRow>
                                               <TableRowColumn colSpan="8">
                                                    <div style={{textAlign:'center'}}>
                                                Aucun resultat    
                                                    </div>
                                               </TableRowColumn>
                                            </TableRow>
                                        
                        }
                        </TableBody>
                    </Table>
                     <div className="loadmoreDiv">
                     <RaisedButton 
                            label="Rafraîchir la base de données" 
                            title="Insérer les derniers règlements traités/générés dans sunshine"
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={()=>mettreAjour()}
                        />
                        <div style={{width:'3%'}}></div>
                        <RaisedButton 
                            label="Modifier les règlements sélectionnés" 
                            title="Que dire...Tout est dans le libéllé"
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={this._dialogTOpen.bind(this)}
                        />
                        <div style={{width:'3%'}}></div>
                        <RaisedButton 
                            label="Voir les 10 prochaines lignes" 
                            title="afficher les dix lignes suivantes"
                            labelColor="white"
                            backgroundColor="#cd9a2e"
                            onClick={()=>loadMoreEntries()}
                        />
                        
                    </div>
                    <div style={{textAlign:"center"}}>{loading?"Chargement...":null}</div>
                    <LinearProgress mode="indeterminate" style={this.state.loaderVisible?{visibility:'visible'}:{visibility:'hidden'}}/>
                    <div className="helperDiv">
                    Veuillez cliquer dans les cases à cocher pour sélectionner un ou plusieur règlements.<br/> 
                     Pour effectuer une recherche de règlement,veuillez choisir un type de date comme critère de recherche et entrez la date selon le format indiqué.Pour plus de pertinence dans la recherche,
                     Veuillez ajouter les precisions suivantes:<br/>
                     - Statut du règlement dans la base de données (SORTIE,PRET,EN COURS...)<br/>
                     - Domaine (INDIVIDUEL,GROUPE,RENTE)<br/><br/>
                      Vous pouvez aussi utiliser les critères de recherche suivant individuellement:<br/>
                      -RECHERCHE PAR STATUT<br/>
                      -RECHERCHE PAR DOMAINE<br/>
                      -RECHERCHE PAR NUMERO DE REGLEMENT<br/>
                      -RECHERCHE PAR INTERVALLE DE NUMERO DE REGLEMENT<br/>
                      -RECHERCHE PAR NUMERO DE POLICE<br/>
                      -RECHERCHE PAR NOM DU BENEFICIAIRE<br/>

                      Vous pouvez reconnaitre le statut qu'un règlement a dans le système en observant la couleur de fond de la ligne du tableau qu'il occupe<br/>
                      Ces couleurs sont:<br/>
                        -<span style={{color:"white"}}>BLANC</span> pour le statut <b>EN COURS</b><br/>
                        -<span style={{color:"yellow"}}>JAUNE</span> pour le statut <b>A LA TRESO</b><br/>
                        -<span style={{color:"orange"}}>ORANGE</span> pour le statut <b>SORTIE DE TRESO</b><br/> 
                        -<span style={{color:"pink"}}>ROSE</span> pour le statut <b>A LA SIGNATURE</b><br/> 
                        -<span style={{color:"green"}}>VERT</span> pour le statut <b>PRET</b><br/> 
                        -<span style={{color:"red"}}>ROUGE</span> pour le statut <b>SORTIE</b><br/><br/>
                        -<span style={{color:"brown"}}>MARRON</span> pour le statut <b>REFUSER</b><br/><br/>
                        -<span style={{color:"#63600a"}}>JAUNE VOMI</span> pour le statut <b>ANNULER</b><br/><br/>
                     Ces informations ci-dessus associées au type de date et à la date renverront des résultats précis.<br/><br/>
                     Si ces informations ne sont pas disponibles,effectuez une recherche par numéro de règlement, par statut, par domaine ou numéro de police ou par le nom du bénéficiaire.
                     <br/>Les recherches par numéro de règlement ou numéro de police ou nom du bénéficiaire sont exclusives et ne necessitent aucune autre information.<br/>
                     <b>NB:LES RECHERCHES SONT EXECUTEES DYNAMIQUEMENT.</b>
                     </div>
                </div>
            );
        }

}


DispoTable=reduxForm({
    form:'modifForm',
   //fields:['nom','prenom','username','password','passwordconf','codeRedac']
})(DispoTable);
function mapDispatchToProps(state,dispatch){
    let isBigDialogUp=state.userActions.isBigDialogUp;
    return{
        dispatch,
        isBigDialogUp
    }
}
DispoTable=connect(mapDispatchToProps)(DispoTable);

DispoTable.propTypes={
    
        loading:PropTypes.bool,
       listeDispo:PropTypes.array,
    
    typeDate:PropTypes.string,
     //date:PropTypes.instanceOf(date),
    statut:PropTypes.string,
    domaine:PropTypes.string,
    numregl:PropTypes.number
    
};

const listeDisponibilities=gql`
    query listeDisponibilities($typeDate:String,$date:String,$statut:String,$domaine:String,$numenv:Int,$numregl:Int,$numpol:Int,$nomtotal:String,$numreglStart:Int,$numreglEnd:Int,$offset:Int,$limit:Int){
        listeDispo(typeDate:$typeDate,date:$date,statut:$statut,domaine:$domaine,numenv:$numenv,numregl:$numregl,numpol:$numpol,nomtotal:$nomtotal,numreglStart:$numreglStart,numreglEnd:$numreglEnd,offset:$offset,limit:$limit){
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
            dateRDV
            Comments
            CommentsBank
            redac
            MNTGT
            MRGGT
            etat{
                nbj
                alerte
            }
            infoSurRgt{
                LIBELLE_SINISTRE
                CAUSE_SINISTRE
                TYPE_SINISTRE
                DATE_RECEPTION
                DATE_REGLEMENT
                DECOMPTE
                NUMERO_CHEQUE
                MONTANT_BRUT
                MONTANT_NET_REGLEMENT
                NUMERO_BENEFICIAIRE
            }
        },
        
    }`;


export default graphql(listeDisponibilities,{
    options:({ typeDate,date,statut,domaine,numenv,numregl,numpol,nomtotal,numreglStart,numreglEnd}) => ({ 
        variables: {
            typeDate,
            date,
            statut,
            domaine,
            numenv:parseInt(numenv,10),
            numregl:parseInt(numregl,10),
            numpol,
            nomtotal,
            numreglStart,
            numreglEnd,
            offset:0,
            limit:parseInt(numenv,10)?10:ITEMS_PER_PAGE          
    },fetchPolicy: 'cache-and-network' }),
        props:({data:{loading,error,listeDispo,fetchMore,refetch}})=>{
            //alert(JSON.stringify(error));
            
            return{
                loading,
                error,
                listeDispo,
                refetch,
                loadMoreEntries(){
                    return fetchMore({
                        variables:{
                            offset:listeDispo.length
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            if(!fetchMoreResult){return previousResult;}
                            return Object.assign({},previousResult,{
                                listeDispo:[...previousResult.listeDispo,...fetchMoreResult.listeDispo],
                            });
                        }
                    });
                }
            }
        }
   
})(DispoTable);


