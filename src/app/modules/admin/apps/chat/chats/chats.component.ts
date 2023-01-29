import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Chat, Profile, Voiture } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: Profile;
    selectedCar:any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    listDemandePaiement :any;
    user: any;
    listVoiture: any = undefined;
    filteredCars: any[];
    isLoaded :Boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.user = user;

        // Chats
        // this._chatService.chats$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chats: Chat[]) => {
        //         this.chats = this.filteredChats = chats;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
            this._chatService.listeVoiture$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((car: Voiture[]) => {
                this.listVoiture = this.filteredCars = car;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        // Profile
        // this._chatService.profile$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((profile: Profile) => {
        //         this.profile = profile;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Selected chat
        // this._chatService.chat$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chat: Chat) => {
        //         this.selectedCar = chat;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
        // const onSuccessCar =  (response:any)=>{
        //     if(response.message=='OK'){
        //          console.log('_____________Car___________________')
        //         console.log(response)
        //         let liste = response.value
        //         const newList = liste.map(user => {
        //             return user.listeVoiture.map(voiture => {
        //                 return {
        //                     utilisateurId: user._id,
        //                     numero: voiture.numero,
        //                     modele: voiture.modele,
        //                     dateAjout: voiture.dateAjout,
        //                     enCoursDepot: voiture.enCoursDepot,
        //                     voitureId: voiture._id
        //                 };
        //             });
        //         }).flat();
        //         console.log(newList);
        //         this.listVoiture = newList;
        //         this.isLoaded = true;
        //     }
           
        // }
        // this._chatService.getAllCar().subscribe(onSuccessCar);
            const onSuccess = (response:any)=>{
                if(response.message==='OK'){
                    this.listDemandePaiement = response.value;
                }
            }
            this._chatService.getAllDemandePaiement().subscribe(onSuccess);
            
        }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        // Reset the filter
        if ( !query )
        {
            this.filteredChats = this.chats;
            this.filteredCars = this.listVoiture;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
        this.filteredCars = this.listVoiture.filter(car=>car.modele.toLowerCase().includes(query.toLowerCase));
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void
    {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void
    {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    getAllDemandePaiement(){
        const onSuccess = (response:any)=>{
            if(response.message==='OK'){
                this.listDemandePaiement = response.value;
            }
        }
        this._chatService.getAllDemandePaiement().subscribe(onSuccess);
    }

    reccupererListeVoiture(liste){
        // let liste = response.value
        let newListe = [];
        liste.forEach(user => {
            user.listeVoiture.forEach(voiture => {
                let newItem = {
                        utilisateurId: user._id,
                        numero: voiture.numero,
                        modele: voiture.modele,
                        dateAjout: voiture.dateAjout,
                        enCoursDepot: voiture.enCoursDepot,
                        voitureId: voiture._id
                }
                newListe.push(newItem);
                });
        });
        console.log(newListe)
        return newListe;
    }
}
