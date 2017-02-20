import * as actions from '../actions/user-actions';

const initialState={
    mettreAjour:false
};

export default function userReducer(state=initialState,action){

    switch(action.type){
        case actions.MAJDISPO:
            return{
                ...state,
                mettreAjour:!state.mettreAjour
            };
        
        default:
            return state;

    }

}