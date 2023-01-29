import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Chat, Contact, Profile, Voiture } from 'app/modules/admin/apps/chat/chat.types';
import { BonDeSortieService } from './bon-de-sortie.service';

@Injectable({
    providedIn: 'root'
})
export class BonDeSortieResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _bonDeSortieServ: BonDeSortieService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chat[]> | any
    {
        return this._bonDeSortieServ.getListeVoiture();
    }
    
}

