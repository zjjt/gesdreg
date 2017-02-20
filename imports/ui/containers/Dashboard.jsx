import React,{PropTypes,Component} from 'react';
import {Card,CardHeader,CardMedia} from 'material-ui/Card';

export default class Dashboard extends Component{
    constructor(){
        super();
    }

    render(){
        return(
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
        );
    }
}