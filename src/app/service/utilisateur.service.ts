import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { baseUrl } from 'environments/environment';
@Injectable({
    providedIn: 'root'
})
export class UtilisateurSerice
{
    private url = baseUrl+'user/';
    private urlReparation = baseUrl+'reparation/';
    public listVoiture:any;
    constructor(
        private _httpClient: HttpClient,
    )
    {
    }
    ajouterVoiture(data:any): Observable<any>{
        const url = this.url+'add/car';
        return this._httpClient.post(url,data);
    }
    getListVoiture(idUser): Observable<any>{
        console.log("getListVoiture : " +idUser)
        return this._httpClient.get(this.url+'car/'+idUser);
    }
    depotVoiture(data:any): Observable<any>{
        return this._httpClient.post(this.urlReparation+'/insert',data);
    }
}