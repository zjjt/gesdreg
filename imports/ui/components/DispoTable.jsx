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
import {miseajourDispo} from '../../redux/actions/user-actions.js'
import {englishDateToFr} from '../../utils/utilitaires.js';
import LinearProgress from 'material-ui/LinearProgress';
import {$} from 'meteor/jquery';

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
                loaderVisible:false,
                table:{
                        fixedHeader:true,
                        fixedFooter:true,
                        stripedRows:false,
                        showRowHover:false,
                        selectable:true,
                        multiSelectable: true,
                        enableSelectAll:false,
                        deselectOnClickaway:true,
                        showCheckboxes:true,
                        height:'450px'
                    }
            };
        }

        componentDidUpdate(){
          console.dir(this.props);
        }
        componentDidMount(){
            $('.tableau').parent().css("width","5250px");
        }

        _dialogTOpen(){
            if(this.state.regSelected.length)
            this.setState({dialogTIsOpen: true});
        }

        _dialogTClose(){
            console.dir(this.refs);
            this.state.selectedRows.map((e,i,arr)=>{
                this.refs[`ligne${i}`].props.selected=!this.refs[`ligne${i}`].props.selected;
               // console.log(this.refs[`ligne${i}`].props.selected);
            });
            this.setState({
                dialogTIsOpen: false,
                selectedRows:[],
                regSelected:[],
            });
            console.dir(this.refs);
          this.forceUpdate(()=>{});
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
                //dialogTIsOpen:true
            });
            console.dir(regarray);
            
        }
        render(){
            const {handleSubmit,pristine,submitting,dispatch,data,error,listeDispo,loadMoreEntries,loading}=this.props;
            let statutClass='animated bounceInRight ';
            console.log(JSON.stringify(error));
            console.dir(this.state.regSelected);
            const mettreAjour=()=>{
                this.setState({
                    loaderVisible:true
                });
                    Meteor.call('maj_database',(err,res)=>{
                            if(res){
                                this.setState({
                                    loaderVisible:false
                                });
                                this.forceUpdate(); 
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
            return(
                <div >
                    <Dialog
                    title={this.state.regSelected.length?`Modification de la disponibilité des ${this.state.regSelected.length} règlements sélectionnés`:null}
                    actions={dialogTActions}
                    modal={false}
                    open={this.state.dialogTIsOpen}
                    onRequestClose={this._dialogTClose}
                    titleStyle={{backgroundColor:'#1f2d67',color:'white'}}
                    contentStyle={{width:'60%',maxWidth:'none'}}
                    autoScrollBodyContent={true}
                    >
                        <ModRegForm dispatch={dispatch} regSelected={this.state.regSelected.length?this.state.regSelected:null} wnrgt={this.state.regSelected.length?this.state.regSelected[0].wnrgt:null} domaine={this.state.regSelected.length?this.state.regSelected[0].domaine:null}/>
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
                                <TableHeaderColumn tooltip="Date du règlement">Date du règlement</TableHeaderColumn>
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
                                           ):typeof listeDispo!=='undefined'?listeDispo.map((row,index)=>{
                                            let domaine='';
                                            if(row.domaine==="I")domaine="INDIVIDUEL";
                                            if(row.domaine==="G")domaine="GROUPE";
                                            if(row.domaine==="R")domaine="RENTE";
                                            if(row.statut_reg_retirer==="EN COURS")statutClass='animated bounceInRight ';
                                            if(row.statut_reg_retirer==="A LA TRESO")statutClass='animated bounceInRight yellowBack';
                                            if(row.statut_reg_retirer==="SORTIE DE TRESO")statutClass='animated bounceInRight orangeBack';
                                            if(row.statut_reg_retirer==="A LA SIGNATURE")statutClass='animated bounceInRight roseBack';
                                            if(row.statut_reg_retirer==="PRET")statutClass='animated bounceInRight greenBack';
                                            if(row.statut_reg_retirer==="SORTIE")statutClass='animated bounceInRight redBack';

                                            return(<TableRow key={index} className={ statutClass } selected={this.state.selectedRows.length?true:false} ref={`ligne${index}`}>
                                                <TableRowColumn>{row.wasrg}</TableRowColumn>
                                                <TableRowColumn>{row.wnrgt}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].NUMERO_CHEQUE!=''?row.infoSurRgt[0].NUMERO_CHEQUE:'"NON DEFINI"':'"NON DEFINI"'}</TableRowColumn>
                                                <TableRowColumn>{row.MNTGT}</TableRowColumn>
                                                <TableRowColumn>{row.MRGGT}</TableRowColumn>
                                                <TableRowColumn>{row.wnupo}</TableRowColumn>
                                                <TableRowColumn>{row.nom_beneficiaire}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].LIBELLE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].CAUSE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?row.infoSurRgt[0].TYPE_SINISTRE:"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_RECEPTION):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.infoSurRgt[0]?englishDateToFr(row.infoSurRgt[0].DATE_REGLEMENT):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.date_naiss?moment(row.date_naiss).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.date_depot_treso?moment(row.date_depot_treso).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn >{row.date_sort_treso?moment(row.date_sort_treso).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn> 
                                                <TableRowColumn>{row.date_depot_sign?moment(row.date_depot_sign).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn>{row.date_recep_sign_reg?moment(row.date_recep_sign_reg).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn>
                                                <TableRowColumn >{row.date_retrait_reg?moment(row.date_retrait_reg).format("DD-MM-YYYY"):"NON DEFINI"}</TableRowColumn> 
                                                <TableRowColumn>{row.statut_reg_retirer}</TableRowColumn>
                                                <TableRowColumn>{domaine}</TableRowColumn>
                                                <TableRowColumn>{row.redac==="ADM"?"Administrateur":row.redac}</TableRowColumn>
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
function mapDispatchToProps(dispatch){
    return{
        dispatch
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
    query listeDisponibilities($typeDate:String,$date:String,$statut:String,$domaine:String,$numregl:Int,$numpol:Int,$nomtotal:String,$numreglStart:Int,$numreglEnd:Int,$offset:Int,$limit:Int){
        listeDispo(typeDate:$typeDate,date:$date,statut:$statut,domaine:$domaine,numregl:$numregl,numpol:$numpol,nomtotal:$nomtotal,numreglStart:$numreglStart,numreglEnd:$numreglEnd,offset:$offset,limit:$limit){
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
                DATE_REGLEMENT
                NUMERO_CHEQUE
                MONTANT_BRUT
                MONTANT_NET_REGLEMENT
                NUMERO_BENEFICIAIRE
            }
        },
        
    }`;


export default graphql(listeDisponibilities,{
    options:({ typeDate,date,statut,domaine,numregl,numpol,nomtotal,numreglStart,numreglEnd}) => ({ 
        variables: {
            typeDate,
            date,
            statut,
            domaine,
            numregl,
            numpol,
            nomtotal,
            numreglStart,
            numreglEnd,
            offset:0,
            limit:ITEMS_PER_PAGE          
    },forceFetch:true }),
        props:({data:{loading,error,listeDispo,fetchMore}})=>{
            //alert(JSON.stringify(error));
            return{
                loading,
                error,
                listeDispo,
                loadMoreEntries(){
                    return fetchMore({
                        variables:{
                            offset:listeDispo.length
                        },
                        updateQuery:(previousResult,{fetchMoreResult})=>{
                            if(!fetchMoreResult.data){return previousResult;}
                            return Object.assign({},previousResult,{
                                listeDispo:[...previousResult.listeDispo,...fetchMoreResult.data.listeDispo],
                            });
                        }
                    });
                }
            }
        }
   
})(DispoTable);


