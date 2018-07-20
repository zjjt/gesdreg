const momentBusiness = require('moment-business-days');
import {moment} from 'meteor/momentjs:moment';


momentBusiness.locale('us', {
    workingWeekdays: [1,2,3,4,5] 
 });

export const englishDateToFr=(date)=>{
    if(typeof date=="undefined"||date==null)
    return "NON DEFINI";
    let yy=date.substring(0,4);
    let mm=date.substring(5,7);
    let dd=date.substring(8);
    return dd+"-"+mm+"-"+yy;
} 
export const frenchDateToEn=(date)=>{
    let yy=date.substring(0,4);
    let mm=date.substring(5,7);
    let dd=date.substring(8);
    return dd+"-"+mm+"-"+yy;
} 

export let formatNumberInMoney=(x)=>{
    console.log(x);
    let parts=x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    return parts.join(".");
}

export function isEmptyObject(o) {
    return Object.keys(o).every(function(x) {
        return o[x]===''||o[x]===null || typeof o[x]=="undefined";  // or just "return o[x];" for falsy values
    });
}

export function isEmptyObjectProps(o,prop){
    return o[prop]===''||o[prop]===null || typeof o[prop]=="undefined";
}
//Les fonctions suivantes servent a enlever les dupliquer des tableaux
let head  = function(ls)  { return ls[0] };
let tail  = function(ls)  { return ls.slice(1) };
let empty = function(ls)  { return ls.length == 0 };
let cons  = function(a, b) { return [a].concat(b) };

let has = function(x, ls) {
    return empty(ls) ? false : head(ls) == x || has(x, tail(ls));
};

let _uniq = function(ls, seen) {
    return empty(ls) ? [] :
        has(head(ls), seen) ?
            _uniq(tail(ls), seen) :
            cons(head(ls),
                _uniq(tail(ls),
                    cons(head(ls), seen)));
};

export const uniq = function(ls) {
    return _uniq(ls, []);
}; 

export const DAYS_IN_MONTH = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function daysInMonth(year, month) {
    // isValidDate checked that year and month are integers already.

    // February of leap years. Assumes that the Gregorian calendar extends
    // infinitely in the future and in the past.
    if (month === 2 && (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) {
        return 29
    }

    // Everything else.
    return DAYS_IN_MONTH[month]
}

export function isValidDate(year, month, day) {
    day=parseInt(day,10);
    month=parseInt(month,10);
    year=parseInt(year,10);
    console.log(day+"-"+month+"-"+year);
    return (
        // Check that year, month and day are integers. Deals with NaN.
        year === Math.round(year) && month === Math.round(month) && day === Math.round(day) &&
        // Any year is valid. Check that month and day are valid.
        month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)
    )
}

export let convertInTextFromFrenchDate=(e)=>{
    //alert(e);
    if(e.length>=10){
        let day=e.substring(0,2);
        let mois=e.substring(3,5);
        let year=e.substring(6);
    //alert(isValidDate(year,mois,day))    
        if(isValidDate(year,mois,day))
            return year+mois+day;
        else{
            alert("Veuillez fournir une date valide");
            //location.reload()
        }
    }  
}

export let checkRdvDate=(e)=>{
    //console.log("in util funct rdv")
    let dateReceptionY=e.infoSurRgt[0]&&e.infoSurRgt[0].DATE_RECEPTION?e.infoSurRgt[0].DATE_RECEPTION.substring(0,4):null;
    let dateReceptionM=e.infoSurRgt[0]&&e.infoSurRgt[0].DATE_RECEPTION?e.infoSurRgt[0].DATE_RECEPTION.substring(5,7):null;
    let dateReceptionD=e.infoSurRgt[0]&&e.infoSurRgt[0].DATE_RECEPTION?e.infoSurRgt[0].DATE_RECEPTION.substring(8):null;
    let typeSinistre=e.infoSurRgt[0]?e.infoSurRgt[0].TYPE_SINISTRE:null
    let dateRDV=e.dateRDV;
    let today=moment(Date.now()).format("YYYY-MM-DD");
    let data;
    let res;
    typeSinistre=typeSinistre?typeSinistre.trim():null;
    //console.log("dateRDV= "+moment(dateRDV).format("DD-MM-YYYY")+" todayIs= "+moment(today).format("DD-MM-YYYY"));
    if(isValidDate(dateReceptionY,dateReceptionM,dateReceptionD) && dateRDV && (e.statut_reg_retirer!=="PRET"||e.statut_reg_retirer!=="SORTIE"||e.statut_reg_retirer!=="REFUSER")){
        //on check le type de prestation
        console.log("le statut est "+e.statut_reg_retirer);
       // console.log("typeSinistre: "+typeSinistre);
        switch(typeSinistre){
            case "RACHAT PARTIEL":
            case "AVANCE":
            //delai de traitement de 21 jr et alerte 7jr avant
            if(moment(dateRDV).isBefore(today)){
                data={
                    nbj:-1,
                    alerte:"TERMINER"
                }
                return data;
            }else{
                res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                if(res<=7){
                    data={
                        nbj:res,
                        alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                    }
                    //console.log("in util funct rachat partiel")
                    //console.dir(res);
                    return data;
                }else{
                    data={
                        nbj:res,
                        alerte:"RAS"
                    }
                    return data;
                }
            }
                
            break;
            case "TERME":
            case "IFC":
                if(moment(dateRDV).isBefore(today)){
                    data={
                        nbj:-1,
                        alerte:"TERMINER"
                    }
                    return data;
                }else{
                    //delai de traitement de 15 jr et alerte 7jr avant
                    res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                    if(res<=7){
                        data={
                            nbj:res,
                            alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                        }
                        //console.log("in util funct ifc")
                        console.log(res);
                        return data;
                    }else{
                        data={
                            nbj:res,
                            alerte:"RAS"
                        }
                        return data;
                    }
                }
            
            break;
            case "RACHAT TOTAL":
                let codeProduit=e.wnupo.toString().substring(0,3);
                //console.log("codeproduit: "+codeProduit+" et type= "+typeof codeProduit)
                switch(codeProduit){
                   case "110":
                   case "112":
                   case "116":
                   case "120":
                   case "122":
                   case "130":
                   case "140":
                   case "162":
                   case "166":
                   case "168":
                   case "210":
                   case "212":
                   case "216":
                   case "218":
                   case "220":
                   case "224":
                   case "230":
                   case "234":
                   case "241":
                   case "242":
                   case "243":
                   case "246":
                   case "247":
                   case "248":
                   case "260":
                   case "310":
                   case "312":
                   case "330":
                   case "331":
                   case "332":
                   case "333":
                   case "334":
                   case "360":
                   case "791":
                   case "793":
                    if(moment(dateRDV).isBefore(today)){
                        data={
                            nbj:-1,
                            alerte:"TERMINER"
                        }
                        return data;
                    }else{
                        //cas individuelle
                        //delai de traitement de 60 jr et alerte 15jr avant
                        res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                        //console.log("resultat de res: "+res);
                        if(res<=15){
                            data={
                                nbj:res,
                                alerte:res<=15 && res>=13?"NORMAL":"HAUTE"
                            }
                            //console.log("in util funct rachat total i")
                            //console.dir(res);
                            return data;
                        }else{
                            data={
                                nbj:res,
                                alerte:"RAS"
                            }
                            return data;
                        }
                    }
                        
                    break;
                    case "710":
                    case "713":
                    case "715":
                    case "717":
                    case "720":
                    case "722":
                    case "724":
                    case "726":
                    case "731":
                    case "732":
                    case "742":
                    case "745":
                    case "752":
                    case "755":
                    case "760":
                    case "766":
                    case "770":
                    case "772":
                    case "773":
                    case "774":
                    case "776":
                    case "777":
                    case "778":
                    case "782":
                    case "784":
                    case "786":
                        if(moment(dateRDV).isBefore(today)){
                            data={
                                nbj:-1,
                                alerte:"TERMINER"
                            }
                            return data;
                        }else{
                            //cas bancassurances
                            //delai de traitement de 45 jr et alerte 10jr avant
                            res=momentBusiness(dateRDV,'YYYY-MM-DD').businessDiff(momentBusiness(today,'YYYY-MM-DD'));
                            console.log("resultat de res: "+res);
                            if(res<=10){
                                data={
                                    nbj:res,
                                    alerte:res<=10 && res>=8?"NORMAL":"HAUTE"
                                }
                                console.log("in util funct rachat total b")
                                console.dir(res);
                                return data;
                            }else{
                                data={
                                    nbj:res,
                                    alerte:"RAS"
                                }
                                return data;
                            }
                        }
                            
                }
            
            
            break;
            case "CAREC":
                if(moment(dateRDV).isBefore(today)){
                    data={
                        nbj:-1,
                        alerte:"TERMINER"
                    }
                    return data;
                }else{
                    //delai de traitement de 30 jr et alerte 7jr avant
                    res=momentBusiness(dateRDV,'YYYY-MM-DD').businessDiff(momentBusiness(today,'YYYY-MM-DD'));
                    if(res<=7){
                        data={
                            nbj:res,
                            alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                        }
                        console.log("in util funct rdv")
                        console.dir(res);
                        return data;
                    }else{
                        data={
                            nbj:res,
                            alerte:"RAS"
                        }
                        return data;
                    }
                }
            
            break;
            default:
            return null;
            break;
        }
    }else{
        return null;
    }
    
}
//pour infosurrgt en multidimension
export let checkRdvDateMD=(e)=>{
    //console.log("in util funct rdv")
    let dateReceptionY=e.infoSurRgt[0][0]&&e.infoSurRgt[0][0].DATE_RECEPTION?e.infoSurRgt[0][0].DATE_RECEPTION.substring(0,4):null;
    let dateReceptionM=e.infoSurRgt[0][0]&&e.infoSurRgt[0][0].DATE_RECEPTION?e.infoSurRgt[0][0].DATE_RECEPTION.substring(5,7):null;
    let dateReceptionD=e.infoSurRgt[0][0]&&e.infoSurRgt[0][0].DATE_RECEPTION?e.infoSurRgt[0][0].DATE_RECEPTION.substring(8):null;
    let typeSinistre=e.infoSurRgt[0][0]?e.infoSurRgt[0][0].TYPE_SINISTRE:null
    let dateRDV=e.dateRDV;
    let today=moment(Date.now()).format("YYYY-MM-DD");
    let data;
    let res;
    typeSinistre=typeSinistre?typeSinistre.trim():null;
    //console.log("dateRDV= "+moment(dateRDV).format("DD-MM-YYYY")+" todayIs= "+moment(today).format("DD-MM-YYYY"));
    if(isValidDate(dateReceptionY,dateReceptionM,dateReceptionD)){
        //on check le type de prestation
        //console.log("in the func");
       // console.log("typeSinistre: "+typeSinistre);
        switch(typeSinistre){
            case "RACHAT PARTIEL":
            case "AVANCE":
            //delai de traitement de 21 jr et alerte 7jr avant
            if(moment(dateRDV).isBefore(today)){
                data={
                    nbj:-1,
                    alerte:"TERMINER"
                }
                return data;
            }else{
                res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                if(res<=7){
                    data={
                        nbj:res,
                        alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                    }
                    //console.log("in util funct rachat partiel")
                    //console.dir(res);
                    return data;
                }else{
                    data={
                        nbj:res,
                        alerte:"RAS"
                    }
                    return data;
                }
            }
                
            break;
            case "TERME":
            case "IFC":
                if(moment(dateRDV).isBefore(today)){
                    data={
                        nbj:-1,
                        alerte:"TERMINER"
                    }
                    return data;
                }else{
                    //delai de traitement de 15 jr et alerte 7jr avant
                    res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                    if(res<=7){
                        data={
                            nbj:res,
                            alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                        }
                        //console.log("in util funct ifc")
                        console.log(res);
                        return data;
                    }else{
                        data={
                            nbj:res,
                            alerte:"RAS"
                        }
                        return data;
                    }
                }
            
            break;
            case "RACHAT TOTAL":
                let codeProduit=e.wnupo.toString().substring(0,3);
                //console.log("codeproduit: "+codeProduit+" et type= "+typeof codeProduit)
                switch(codeProduit){
                   case "110":
                   case "112":
                   case "116":
                   case "120":
                   case "122":
                   case "130":
                   case "140":
                   case "162":
                   case "166":
                   case "168":
                   case "210":
                   case "212":
                   case "216":
                   case "218":
                   case "220":
                   case "224":
                   case "230":
                   case "234":
                   case "241":
                   case "242":
                   case "243":
                   case "246":
                   case "247":
                   case "248":
                   case "260":
                   case "310":
                   case "312":
                   case "330":
                   case "331":
                   case "332":
                   case "333":
                   case "334":
                   case "360":
                   case "791":
                   case "793":
                    if(moment(dateRDV).isBefore(today)){
                        data={
                            nbj:-1,
                            alerte:"TERMINER"
                        }
                        return data;
                    }else{
                        //cas individuelle
                        //delai de traitement de 60 jr et alerte 15jr avant
                        res=momentBusiness(dateRDV).businessDiff(momentBusiness(today));
                        //console.log("resultat de res: "+res);
                        if(res<=15){
                            data={
                                nbj:res,
                                alerte:res<=15 && res>=13?"NORMAL":"HAUTE"
                            }
                            //console.log("in util funct rachat total i")
                            //console.dir(res);
                            return data;
                        }else{
                            data={
                                nbj:res,
                                alerte:"RAS"
                            }
                            return data;
                        }
                    }
                        
                    break;
                    case "710":
                    case "713":
                    case "715":
                    case "717":
                    case "720":
                    case "722":
                    case "724":
                    case "726":
                    case "731":
                    case "732":
                    case "742":
                    case "745":
                    case "752":
                    case "755":
                    case "760":
                    case "766":
                    case "770":
                    case "772":
                    case "773":
                    case "774":
                    case "776":
                    case "777":
                    case "778":
                    case "782":
                    case "784":
                    case "786":
                        if(moment(dateRDV).isBefore(today)){
                            data={
                                nbj:-1,
                                alerte:"TERMINER"
                            }
                            return data;
                        }else{
                            //cas bancassurances
                            //delai de traitement de 45 jr et alerte 10jr avant
                            res=momentBusiness(dateRDV,'YYYY-MM-DD').businessDiff(momentBusiness(today,'YYYY-MM-DD'));
                            console.log("resultat de res: "+res);
                            if(res<=10){
                                data={
                                    nbj:res,
                                    alerte:res<=10 && res>=8?"NORMAL":"HAUTE"
                                }
                                console.log("in util funct rachat total b")
                                console.dir(res);
                                return data;
                            }else{
                                data={
                                    nbj:res,
                                    alerte:"RAS"
                                }
                                return data;
                            }
                        }
                            
                }
            
            
            break;
            case "CAREC":
                if(moment(dateRDV).isBefore(today)){
                    data={
                        nbj:-1,
                        alerte:"TERMINER"
                    }
                    return data;
                }else{
                    //delai de traitement de 30 jr et alerte 7jr avant
                    res=momentBusiness(dateRDV,'YYYY-MM-DD').businessDiff(momentBusiness(today,'YYYY-MM-DD'));
                    if(res<=7){
                        data={
                            nbj:res,
                            alerte:res<=7 && res>=5?"NORMAL":"HAUTE"
                        }
                        console.log("in util funct rdv")
                        console.dir(res);
                        return data;
                    }else{
                        data={
                            nbj:res,
                            alerte:"RAS"
                        }
                        return data;
                    }
                }
            
            break;
            default:
            return null;
            break;
        }
    }else{
        return null;
    }
    
}