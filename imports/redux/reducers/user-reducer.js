import * as actions from '../actions/user-actions';

const initialState={
    mettreAjour:false,
    mettreAjourBank:false,
    isUserConnected:false,
    isBigDialogUp:false,
    user:null
};

export default function userReducer(state=initialState,action){
   // console.dir(action);
    switch(action.type){
        case actions.MAJDISPO:
            return{
                ...state,
                mettreAjour:!state.mettreAjour
            };
        case actions.MAJDISPOBANK:
        //alert("in resolver majbank")
        return{
            ...state,
            mettreAjourBank:true
        };
        case actions.DONTMAJDISPOBANK:
        //alert("in resolver majbank")
        return{
            ...state,
            mettreAjourBank:false
        };
        case actions.OPENBIGDIALOG:
        case actions.OPENBIGDIALOGBANK:
        //alert("in resolver majbank")
        return{
            ...state,
            isBigDialogUp:true
        };
        case actions.CLOSEBIGDIALOG:
        case actions.CLOSEBIGDIALOGBANK:
        //alert("in resolver majbank")
        return{
            ...state,
            isBigDialogUp:false
        };
        case actions.USERCONNECTED:
       // alert(action.user);
        return{
            ...state,
            isUserConnected:true,
            user:action.user
        };
        
        default:
            return state;

    }

}