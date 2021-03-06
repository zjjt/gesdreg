export const MAJDISPO='MAJDISPO';
export const MAJDISPOBANK='MAJDISPOBANK';
export const DONTMAJDISPOBANK='DONTMAJDISPOBANK';
export const CLOSEBIGDIALOG='CLOSEBIGDIALOG';
export const CLOSEBIGDIALOGBANK='CLOSEBIGDIALOGBANK';
export const OPENBIGDIALOG='OPENBIGDIALOG';
export const OPENFILEUPLOADDIALOG='OPENFILEUPLOADDIALOG';
export const CLOSEFILEUPLOADDIALOG='CLOSEFILEUPLOADDIALOG';
export const OPENBIGDIALOGBANK='OPENBIGDIALOGBANK';
export const SELECTREG='SELECTREG';

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
export function openFileUploadDialog(){
	
		return{
			type:OPENBIGDIALOG
		}
	
	
}

export function closeFileUploadDialog(){
	return{
		type:CLOSEFILEUPLOADDIALOG
	}
}
export function selectedReg(wnrgt){
	//alert(wnrgt);
	return{
		type:SELECTREG,
		wnrgt
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