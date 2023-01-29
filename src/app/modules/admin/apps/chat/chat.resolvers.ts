import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { Chat, Contact, Profile, Voiture } from 'app/modules/admin/apps/chat/chat.types';

@Injectable({
    providedIn: 'root'
})
export class ChatChatsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
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
        // return this._chatService.getChats();
        return this._chatService.getListeVoiture();
    }
    
}

@Injectable({
    providedIn: 'root'
})
export class ChatChatResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
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
    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chat>
    // {
    //     return this._chatService.getChatById(route.paramMap.get('id'))
    //                .pipe(
    //                    // Error here means the requested chat is not available
    //                    catchError((error) => {

    //                        // Log the error
    //                        console.error(error);

    //                        // Get the parent url
    //                        const parentUrl = state.url.split('/').slice(0, -1).join('/');
    //                         console.log(parentUrl)
    //                        // Navigate to there
    //                        this._router.navigateByUrl(parentUrl);

    //                        // Throw an error
    //                        return throwError(error);
    //                    })
    //                );
    // }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Voiture>
    {
        return this._chatService.getVoitureById(route.paramMap.get('id'))
                   .pipe(
                        switchMap((voiture)=>{
                            this._chatService.getListeDemandePaiementVoitureById(voiture.voitureId).subscribe();
                            return of(voiture);
                        }),
                       // Error here means the requested chat is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');
                            console.log(parentUrl)
                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ChatContactsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contact[]> | any
    {
        return this._chatService.getContacts();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ChatProfileResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Profile> | any
    {
        return this._chatService.getProfile();
    }
}
