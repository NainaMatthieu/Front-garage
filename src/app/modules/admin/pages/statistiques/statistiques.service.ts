import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class StatistiquesService{
    constructor(private _httpClient: HttpClient)
    {
    }

    getCars(){
        return this._httpClient.get("http://localhost:9000/user/car");
    }

    getTempsById(id:String){
        return this._httpClient.get("http://localhost:9000/reparation/stats/tempsMoyen/"+id);
    }

    getTempsGlobal(){
        return this._httpClient.get("http://localhost:9000/reparation/stats/tempsMoyen/");
    }

    getChiffreAffaire(date1:String,date2:String){
        return this._httpClient.get("http://localhost:9000/reparation/stats/chiffreAffaire/"+date1+"/"+date2);
    }

    getChiffreAffaireByDay(date:String){
        return this._httpClient.get("http://localhost:9000/reparation/stats/chiffreAffaire/"+date);
    }

    getChiffreAffaireByYear(date:String){
        return this._httpClient.get("http://localhost:9000/reparation/stats/chiffreAffaire/year/"+date);
    }

    insertBenefice(salaire:String,loyer:String,pieces:String,autres:String,mois:String,annee:String,benefice:String){
        return this._httpClient.get("http://localhost:9000/benefice/insert/"+salaire+"/"+loyer+"/"+pieces+"/"+autres+"/"+mois+"/"+annee+"/"+benefice);
    }

    getBenefice(mois:String,annee:String){
        return this._httpClient.get("http://localhost:9000/benefice/find/"+mois+"/"+annee);
    }

    getListePiece(mois:String,annee:String){
        return this._httpClient.get("http://localhost:9000/reparation/byDate/"+mois+"/"+annee);
    }

}