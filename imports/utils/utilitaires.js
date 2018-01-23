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