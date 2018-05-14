export const MAJDISPO='MAJDISPO';
export const MAJDISPOBANK='MAJDISPOBANK';
export const USERCONNECTED='USERCONNECTED';

export function miseajourDispoBank(){
	return{
		type:MAJDISPOBANK
	}
}
export function miseajourDispo(){
	return{
		type:MAJDISPO
	}
}
export function userconnected(userobj){
	return{
		type:USERCONNECTED,
		user:userobj
	}
}