import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat, DemandePaiement, toggleCheck, Voiture } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { UntypedFormGroup } from '@angular/forms';

@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy
{
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    voiture:Voiture;
    listDemandePaiement:DemandePaiement[];
    listToggle:toggleCheck[];
    confirmPaiementForm: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    // private _resizeMessageInput(): void
    // {
    //     // This doesn't need to trigger Angular's change detection by itself
    //     this._ngZone.runOutsideAngular(() => {

    //         setTimeout(() => {

    //             // Set the height to 'auto' so we can correctly read the scrollHeight
    //             this.messageInput.nativeElement.style.height = 'auto';

    //             // Detect the changes so the height is applied
    //             this._changeDetectorRef.detectChanges();

    //             // Get the scrollHeight and subtract the vertical padding
    //             this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

    //             // Detect the changes one more time to apply the final height
    //             this._changeDetectorRef.detectChanges();
    //         });
    //     });
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
    // Chat
    this._chatService.chat$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((chat: Chat) => {
            this.chat = chat;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    // init data 
    this.initData();
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({matchingAliases}) => {

            // Set the drawerMode if the given breakpoint is active
            if ( matchingAliases.includes('lg') )
            {
                this.drawerMode = 'side';
            }
            else
            {
                this.drawerMode = 'over';
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
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
     * Open the contact info
     */
    openContactInfo(): void
    {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Reset the chat
     */
    resetChat(): void
    {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void
    {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
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

    createListToggle(list:any){
        if(list){
            this.listToggle = [];
            for(let i =0;i<list.length;i++){
                let newT = {
                    index : i,
                    checked : false
                }
                this.listToggle.push(newT);
            }
        }
        
    }
    validerPaiement(index){
       console.log(this.listDemandePaiement[index])
       const data = {
        demandePaiement : this.listDemandePaiement[index],
        datePaiement : new Date()
       }
       this._chatService.validationPaiement(data).subscribe((response:any)=>{
            if(response.message==='OK'){
                this._chatService.suppressionDemandePaiement(this.listDemandePaiement[index]._id).subscribe((rep:any)=>{
                    console.log(rep);
                    if(rep.message==='OK'){
                        this.listDemandePaiement.splice(index,1);
                        this._changeDetectorRef.markForCheck();
                    }
                });
            }
       })
    }
    initData(){
        //Voiture 
        this._chatService.voiture$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((car: Voiture) => {
                this.voiture = car;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        //liste demande paiement de la voiture 
            this._chatService.listeDemandePaiementVoiture$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((listDemandePaiement: DemandePaiement[]) => {
                this.listDemandePaiement = listDemandePaiement;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
