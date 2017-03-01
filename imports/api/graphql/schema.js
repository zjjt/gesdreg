const schema=`
        
        type User{
            username:String
            uncrypted:String
            nom:String
            prenoms:String
            fullname: String
            codeRedac:String
            role:String
            createdAt:String
        }
        type UserSQL{
            ulogin:String
            mdp:String
            nom:String
            prenom:String
            role:String
            redac:String
        }
        type InfosREG{
            DATE_SURVENANCE_SINISTRE:String
            NOM_BENEFICIAIRE:String
            NUMERO_BENEFICIAIRE:String
            LIBELLE_SINISTRE:String
            NUMERO_SINISTRE:String
            NUMERO_REGLEMENT:String
            DECOMPTE:String
            POLICE:String
            DATE_REGLEMENT:String
            DATE_RECEPTION:String
            CAUSE_SINISTRE:String
            TYPE_SINISTRE:String
            MONTANT_BRUT:String
            MONTANT_NET_REGLEMENT:String
        }
        type DisporegSQL{
            wasrg:String
            wnrgt:Int
            wnupo:Int
            nom_beneficiaire:String
            date_naiss:String
            date_depot_treso:String
            date_sort_treso:String
            date_depot_sign:String
            date_recep_sign_reg:String
            date_retrait_reg:String
            statut_reg_retirer:String
            domaine:String
            redac:String
            infoSurRgt:[InfosREG]
        }
        type Query{
            user(username:String):[User]
            userSQL(nom:String,orderDesc:Boolean!):[UserSQL] 
            dataToExport(typeDate:String,startDate:String,endDate:String,domaine:String):[DisporegSQL]
            consultDispo(numpolice:Int,nomtotal:String,birthdate:String,offset:Int,limit:Int):[DisporegSQL]
            listeDispo(typeDate:String,date:String,statut:String,domaine:String,numregl:Int,numpol:Int,nomtotal:String,offset:Int,limit:Int):[DisporegSQL]
            voirInfoReg(wnrgt:Int,domaine:String):[InfosREG]
        }
        type Mutation{
            deleteUsers(usercodes:[String]!):[UserSQL]
        }
        schema{
            query:Query
            mutation:Mutation
        }

`;

export default schema;