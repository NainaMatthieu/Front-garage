import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { baseUrl } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CryptoService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/crypto').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
    getHistoriqueReparation(idUser,idCar): Observable<any>{
        let url = baseUrl+'reparation/historique/'+idUser+"/"+idCar;
        return this._httpClient.get(url);
    }
    getPieceById(idPiece): Observable<any>{
        let url = baseUrl+'piece/'+idPiece
        return this._httpClient.get(url);
    }
    confirmDemandePaiement(data): Observable<any>{
        let url = baseUrl+'demandepaiement/';
        return this._httpClient.post(url,data);
    }
    getAllDemandePaiement(): Observable<any>{
        let url = baseUrl+'demandepaiement/pendingValidation';
        return this._httpClient.get(url);
    }
}
