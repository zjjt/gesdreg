import React,{PropTypes,Component} from 'react';
import {TextField} from 'redux-form-material-ui';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import {FilesCollection} from 'meteor/ostrio:files';
import FlatButton from 'material-ui/FlatButton';
import {Meteor} from 'meteor/meteor';
import {closeFileUploadDialog} from '../../redux/actions/user-actions.js';
import {RgtManuel} from '../../api/collections';
import {$} from 'meteor/jquery';


const styles={
    uploadInput:{
        cursor:'pointer',
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        left:0,
        width:'0%',
        opacity:0,
        zIndex:-100000
    }
}
 class FileUpload extends Component{
    constructor(){
        super();
        this.state={
            dialogIsOpen:false,
            dialogTIsOpen:false,
            errorMsg:'',
            showLoader:false,
            error:false,
            alreadyOp:false,
            decoupage:[],
            currentFile:false,
            progress:null,
            snackOpen:false,
            snackMsg:'',

        }
    }

   _dialogOpen(){
       this.setState({dialogIsOpen: true});
   }
   _dialogClose(){
       this.setState({dialogIsOpen: false});
   }
    _dialogTOpen(){
        this.setState({dialogTIsOpen: true,alreadyOp:true});
    }

    _dialogTClose(){
        this.setState({dialogTIsOpen: false,alreadyOp:true});
    }
    _snackClose(){
        this.setState({
            snackOpen:false
        });
    }
   componentWillUpdate(){
       const {dispatch}=this.props;
       /*if(this.state.decoupage.length>=1 && !this.state.alreadyOp){
            
            
       }  */    
   }
    render(){
         const {handleSubmit,pristine,submitting,dispatch}=this.props;
        if(this.state.currentFile && this.state.decoupage.length<=0){
            
        }
        
        const dialogActions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={this._dialogClose.bind(this)}
            />,
            ];
      
       
        
        return(
            <div className="loginformCont">
              <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    autoHideDuration={5000}
                    onRequestClose={this._snackClose.bind(this)}
                    style={{width:'auto !important'}}
                />

                <form>
                <Dialog
                    actions={dialogActions}
                    modal={false}
                    open={this.state.dialogIsOpen}
                    onRequestClose={this._dialogClose}
                    >
                        <span className="errorMsg">{this.state.errorMsg}</span>
                </Dialog>
                <input type="file" 
                    className="upl" 
                    style={styles.uploadInput}
                    onChange={(e)=>{
                        if(e.currentTarget.files && e.currentTarget.files[0]){
                            let file=e.currentTarget.files[0];
                            let upload=RgtManuel.insert({
                                file:file,
                                fileName:'rgt.xlsx',
                                streams:'dynamic',
                                chunkSize:'dynamic'
                            },false);
                            
                            upload.on('start',()=>{
                                this.setState({
                                    currentFile:this
                                });
                            });
                             upload.on('end',(error,fileObj)=>{
                                    if(error){
                                         this.setState({
                                             error:true,
                                            errorMsg:"Une erreur est survenue pendant le téléchargement. "+error
                                        });
                                        this._dialogOpen();
                                    }else{
                                        //on affiche pour dire aue c'est fini
                                         this.setState({
                                                    error:false,
                                                    errorMsg:`Le fichier a été téléchargé avec succès.`
                                                });
                                                this._dialogOpen();
                                                Meteor.call("updateDisposManuel",(err,res)=>{
                                                    console.dir(res);
                                                    //call flow router vers l'inventaire total
                                                    if(err){
                                                        if(err.error==="bad-date"||err.error==="bad-coderej"){
                                                            this.setState({
                                                            errorMsg:err.reason
                                                            });
                                                        }else{
                                                            console.log("Erreur survenue: "+err.reason);
                                                        }
                                                            
                                                        this._dialogOpen();
                                                    }
                                                    else{
                                                        this.setState({
                                                            snackMsg:`Mise à jour éffectuée, patientez...`,
                                                            snackOpen:true
                                                            });
                                                        setTimeout(()=>{
                                                            dispatch(closeFileUploadDialog());
                                                        },5500);
                                                    }
                                                        
                                                });
                                    }
                                    this.setState({
                                        //currentFile:false,
                                        error:false
                                    });
                                });

                                upload.start();
                                upload.on('progress',(prog,file)=>{
                                     this.setState({
                                        progress:prog
                                    });
                                });
                        }
                    }}/>
                    <div className="uploadDiv">
                        <div style={{height:'10px'}}></div>
                            <div>
                                <RaisedButton 
                                    label="Choisir un fichier excel" 
                                    labelColor="white"
                                    backgroundColor="#cd9a2e"  
                                    disabled={this.state.currentFile?true:false}
                                    onClick={()=>{
                                        $('.upl').click();
                                    }}  
                                />
                            </div>
                            <div style={{height:'10px'}}></div>
                            <div style={{height:'10px'}}></div>
                            <div>
                                {this.state.currentFile&&this.state.progress<=99?(<CircularProgress size={60} thickness={7}/>):this.state.progress!==100?(<span>Le fichier doit être au format excel et ne doit pas exéder 10MB</span>):null}
                                {this.state.progress===100?(<span style={{color:'green',textAlign:'center'}}>Fichier Téléchargé<br/>Veuillez patienter pendant l'intégration des règlements<LinearProgress mode="indeterminate"/></span>):null}
                            </div>
                        
                    </div>
                </form>
            </div>
        );
    }

}
FileUpload=reduxForm({
    form:'fileuprgt',
})(FileUpload);

const mapDispatchToProps=(dispatch)=>{
    return{
        dispatch
    };
}
FileUpload=connect(mapDispatchToProps)(FileUpload);
//decorate with connect to read form values



export default FileUpload;

