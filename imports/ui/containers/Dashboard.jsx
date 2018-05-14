import React,{PropTypes,Component} from 'react';
import {Card,CardHeader,CardMedia} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {createContainer} from 'meteor/react-meteor-data';
import {WhatsNew} from '../../api/collections.js';
import { connect } from 'react-redux';
import {Session} from 'meteor/session';

 class Dashboard extends Component{
    constructor(){
        super();
        this.state={
            dialogIsOpen:false,
            news:null
        };
    }
    _dialogOpen(news){
        this.setState({dialogIsOpen: true});
        //alert(JSON.stringify(this.state.news))
    }

    _dialogClose(){
        Meteor.call("updateNewsScreenTime",()=>{
           // alert("lool");
        });
        this.setState({dialogIsOpen: false});
    }
    componentWillReceiveProps(nextProps){
        const {news}=this.props;
        if(news.length>0 && typeof news[0].updates!="undefined"){
            this._dialogOpen();
        }
    }
    
    render(){
        
        console.log("object de sessiion user "+Session.get('userRole'));
            let user=Session.get('userRole');
            //alert(user);
            const {news,currentUser}=this.props;
            const dialogActions = [
                <FlatButton
                    label="FERMER"
                    primary={true}
                    onTouchTap={this._dialogClose.bind(this)}
                />,
                ];
                if(typeof user!=="undefined" && user==="B"){//GESTIONNAIRE BANQUAIRE
                    return(<div className="centeredContent">
                          
                                <div className="cardMenu " >
                                    <div className="cardContainer fadeInRight animated">
                                        <Card className="cards " onClick={()=>FlowRouter.go('dispo')}>
                                            <CardHeader 
                                                title="Règlements disponibles pour retrait chez Nsia Vie Assurances"
                                                className="cardsHeader" 
                                            />
                                            <CardMedia className="cardsMedia">
                                                <img src="../img/disporeg.png"/>
                                            </CardMedia>
                                        </Card>
                                    </div>
                                </div>
                            </div>);
                }    
            else if(typeof user!=="undefined" && user==="C"){//NSIA CONSULTANT
                return(<div className="centeredContent">
                      
                            <div className="cardMenu " >
                                <div className="cardContainer fadeInRight animated">
                                    <Card className="cards " onClick={()=>FlowRouter.go('dispo')}>
                                        <CardHeader 
                                            title="Règlements disponibles"
                                            className="cardsHeader" 
                                        />
                                        <CardMedia className="cardsMedia">
                                            <img src="../img/disporeg.png"/>
                                        </CardMedia>
                                    </Card>
                                </div>
                                <div className="cardContainer fadeInRight animated">
                                    <Card className="cards" onClick={()=>FlowRouter.go('excel')}>
                                        <CardHeader 
                                            title="Exporter les données"
                                            className="cardsHeader" 
                                        />
                                        <CardMedia className="cardsMedia">
                                            <img src="../img/exportxls.png"/>
                                        </CardMedia>
                                    </Card>
                                </div>
                            </div>
                        </div>);
            }else if(typeof user!=="undefined" && user==="G"){
                //alert(JSON.stringify(news));
                console.dir(news);
                return(<div className="centeredContent">
                            <Dialog
                            actions={dialogActions}
                            modal={false}
                            title="Quoi de neuf ?"
                            open={this.state.dialogIsOpen}
                            onRequestClose={this._dialogClose}
                            contentStyle={{width:'45%',height:'500px',maxWidth:'none'}}
                            autoScrollBodyContent={true}
                            >
                                <ul>
                                    {news.length>0 && typeof news[0].updates!="undefined" ?news[0].updates.map((e,i,arr)=>
                                        {
                                            
                                            return(<li key={i}>{e}</li>)
                                        }
                                    ):null}
                                </ul>
                            </Dialog>

                            <div className="cardMenu " >
                            <div className="cardContainer fadeInRight animated">
                                <Card className="cards " onClick={()=>FlowRouter.go('dispo')}>
                                    <CardHeader 
                                        title="Règlements disponibles"
                                        className="cardsHeader" 
                                    />
                                    <CardMedia className="cardsMedia">
                                        <img src="../img/disporeg.png"/>
                                    </CardMedia>
                                </Card>
                            </div>
                            <div className="cardContainer fadeInRight animated">
                                <Card className="cards" onClick={()=>FlowRouter.go('dispolist')}>
                                    <CardHeader 
                                        title="Modifier les disponibilités"
                                        className="cardsHeader" 
                                    />
                                    <CardMedia className="cardsMedia">
                                        <img src="../img/modifrgt.png"/>
                                    </CardMedia>
                                </Card>
                            </div>
                        <div className="cardContainer fadeInRight animated">
                                <Card className="cards" onClick={()=>FlowRouter.go('excel')}>
                                    <CardHeader 
                                        title="Exporter les données"
                                        className="cardsHeader" 
                                    />
                                    <CardMedia className="cardsMedia">
                                        <img src="../img/exportxls.png"/>
                                    </CardMedia>
                                </Card>
                            </div>
                            </div>
                        </div>);
            }
        else{
            return (<div>lol</div>);
        }
        /*return(
            <div className="centeredContent">
                <div className="cardMenu " >
                    
                    <div className="cardContainer fadeInRight animated">
                        <Card className="cards " onClick={()=>FlowRouter.go('dispo')}>
                            <CardHeader 
                                title="Règlements disponibles"
                                className="cardsHeader" 
                            />
                            <CardMedia className="cardsMedia">
                                <img src="../img/disporeg.png"/>
                            </CardMedia>
                        </Card>
                    </div>
                    <div className="cardContainer fadeInRight animated">
                         <Card className="cards" onClick={()=>FlowRouter.go('dispolist')}>
                            <CardHeader 
                                title="Modifier les disponibilités"
                                className="cardsHeader" 
                            />
                            <CardMedia className="cardsMedia">
                                <img src="../img/modifrgt.png"/>
                            </CardMedia>
                         </Card>
                    </div>
                   <div className="cardContainer fadeInRight animated">
                         <Card className="cards" onClick={()=>FlowRouter.go('excel')}>
                            <CardHeader 
                                title="Exporter les données"
                                className="cardsHeader" 
                            />
                            <CardMedia className="cardsMedia">
                                <img src="../img/exportxls.png"/>
                            </CardMedia>
                         </Card>
                    </div>
                </div>
            </div>
        );*/
    }
}
const mapStateToProps= (state) => {
    return{
        currentUser:state.userActions.user
    };
  }
Dashboard=connect(
   mapStateToProps
)(Dashboard);

export default createContainer(()=>{
    const newshandle=Meteor.subscribe('latestNews');
    const newsloading=!newshandle.ready();
    const newsone=WhatsNew.findOne({});
    const newsExist=!newsloading && !!newsone;
    const currentUser=Meteor.user();
    return{
        newsloading,
        newsone,
        newsExist,
        news:newsExist? WhatsNew.find({}).fetch():[],
        currentUser
    };
},Dashboard);
