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