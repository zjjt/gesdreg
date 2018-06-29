export const MAJDISPO='MAJDISPO';
export const MAJDISPOBANK='MAJDISPOBANK';
export const DONTMAJDISPOBANK='DONTMAJDISPOBANK';
export const CLOSEBIGDIALOG='CLOSEBIGDIALOG';
export const CLOSEBIGDIALOGBANK='CLOSEBIGDIALOGBANK';
export const OPENBIGDIALOG='OPENBIGDIALOG';
export const OPENBIGDIALOGBANK='OPENBIGDIALOGBANK';

export const USERCONNECTED='USERCONNECTED';

export function miseajourDispoBank(){
	return{
		type:MAJDISPOBANK
	}
}
export function dontmiseajourDispoBank(){
	return{
		type:DONTMAJDISPOBANK
	}
}
export function miseajourDispo(){
	return{
		type:MAJDISPO
	}
}
export function openBigDialog(who){
	//alert(who);
	if(who=="BANK"){
		return{
			type:OPENBIGDIALOGBANK
		}
	}else if(who=="MOD"){
		return{
			type:OPENBIGDIALOG
		}
	}
	
}
export function closeBigDialog(who){
	//alert(who);
	if(who=="BANK"){
		return{
			type:CLOSEBIGDIALOGBANK
		}
	}else if(who=="MOD"){
		return{
			type:CLOSEBIGDIALOG
		}
	}
	
}
export function userconnected(userobj){
	return{
		type:USERCONNECTED,
		user:userobj
	}
}