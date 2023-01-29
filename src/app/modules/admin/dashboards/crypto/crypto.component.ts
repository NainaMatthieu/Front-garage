import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CryptoService } from 'app/modules/admin/dashboards/crypto/crypto.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ListeReparation } from './modele';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'crypto',
    templateUrl    : './crypto.component.html',
    styleUrls: ['./crypto.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoComponent implements OnInit, OnDestroy
{
    @ViewChild('btcChartComponent') btcChartComponent: ChartComponent;
    appConfig: any;
    btcOptions: ApexOptions = {};
    data: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    watchlistChartOptions: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    listVoiture :any;
    selectedVoiture : any = undefined;
    selectedDateReparation:any = undefined;
    user:any;
    reparationVoitureUser :any; //Objet réparation de l'utilisateur globalement (conforme à la base reparationVoiture)
    dialogRep :UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private _cryptoService: CryptoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
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
        this.listVoiture = user.listeVoiture;
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
    // code 
     reparationUser = []; // liste réparation de l'utilisateur (conforme à la base reparationVoiture[i].reparation)
    
      reparationToAdd: ListeReparation[] = [];
    
      drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        }
    
        this.pre = `
        reparation:
        ${JSON.stringify(this.reparationUser, null, ' ')}

        reparationToAdd:
        ${JSON.stringify(this.reparationToAdd, null, ' ')}`;
    }
    
    public markdown = `
    # Material Design: Angular 7, drag-and-drop list
    requires:
    - \`CdkDragDrop\`, \`moveItemInArray\` and \`transferArrayItem\` imports
    - \`cdkDropList\` directive and \`cdkDropListDropped\` event
    - CSS \`flex\` layout
    
    `;
    
    pre = `
        reparation:
        ${JSON.stringify(this.reparationUser, null, ' ')}
        
        reparationToAdd:
        ${JSON.stringify(this.reparationToAdd, null, ' ')}`;

    choisirVehicule(event){
        let idVoiture = event.value;
        this.selectedVoiture = this.listVoiture.find(voiture => voiture._id ===idVoiture);
        // console.log(this.selectedVoiture)
        const onSuccess = (response:any)=>{
            console.log(response);
            if(response.message==='OK'){
               this.reparationVoitureUser = response.value;
               this.reparationVoitureUser = this.deleteIsPaid(  response.value);
               this._cryptoService.getAllDemandePaiement().subscribe((rep:any)=>{
                    if(rep.message==='OK'){
                        let listeDemandePaiement = rep.value;
                        // console.log('_________________Liste demande Paiement_______________________')
                        // console.log(listeDemandePaiement);
                        let result = this.deleteIncluDemandePaiement(this.reparationVoitureUser,listeDemandePaiement);
                        console.log('_________________Filtre Liste demande Paiement_______________________')
                        console.log(result)
                        this.reparationVoitureUser = result;
                    }

               })
            }else{

            }
            
        }
        this._cryptoService.getHistoriqueReparation(this.user._id,idVoiture).subscribe(onSuccess);
    }
    async choisirReparation(event){
        let index =event.value;
        this.selectedDateReparation = true;
        // let depannage = this.reparationVoitureUser[index];
        await  this.reparationVoitureUser[index].listeReparation.forEach(repar => {
            let idPiece = repar.idPiece;
            repar.piece = {};
            const onSuccess = (response:any)=>{
                // repar.designationPiece = response
                // console.log('_________________PIECE____________________')
                // console.log(response)
                repar.piece = response[0];
            }
            this._cryptoService.getPieceById(idPiece).subscribe(onSuccess);
        });
        this.reparationUser = this.reparationVoitureUser[index].listeReparation;
        console.log('_______________Reparation___________________');
        console.log(this.reparationUser)
    }
    deleteReparationToAdd(index){
        let reparation = this.reparationToAdd[index];
        this.reparationUser.push(reparation);
        this.reparationToAdd.splice(index,1);
    }

    // fonction ty sisa apesaina
    confirmeDemandePaiement(){
        /*console.log("_________Demande Paiement_______________")
        console.log(this.reparationToAdd);*/
        const listeDemandePaiement = new Array();
        this.reparationToAdd.forEach(reptoAdd=>{
            const demandepaiement = {
                idReparation :reptoAdd._id,
                totalDue: reptoAdd.prix,
                piece: reptoAdd.piece, 
                date: new Date(),
                idVoiture : this.selectedVoiture._id,
                idUser : this.user._id

            }
            listeDemandePaiement.push(demandepaiement);
        })
        // console.log(listeDemandePaiement);
        const data ={listeDemandePaiement : listeDemandePaiement}
        const onSuccess = (response:any)=>{
            if(response.message==='OK'){
                this.dialogResponse('Demande de paiement','Félicitation votre demande a été reçu avec success');
                this.reparationToAdd  = [];
                this.reparationUser = [];
                this.selectedVoiture=undefined;
                this.selectedDateReparation=undefined;
            }else{
                this.dialogResponse('Demande de paiement',JSON.stringify(response.value),true);
            }
        }
        this._cryptoService.confirmDemandePaiement(data).subscribe(onSuccess);
    }
    deleteIsPaid(list: any) {
        let retour = list.map(reparation => {
          reparation.listeReparation = reparation.listeReparation.filter(rep => !rep.estPaye)
          return reparation;
        });
        let reponse = retour.map(reparation=>{
            if (reparation.listeReparation.length>0)
                return reparation;
        })
        reponse = reponse.filter(rep=> (rep!=undefined))
        return reponse;
    }
    dialogResponse(titre,message,isError=false){
        let icone = 'heroicons_outline:check';
        let couleur = 'success';
        if(isError){
          icone = 'heroicons_outline:exclamation';
          couleur = 'warn';
        }
        this.dialogRep = this._formBuilder.group({
          title      : titre,
          message    : '<span class="font-medium">'+message+' !</span>',
          icon       : this._formBuilder.group({
              show : true,
              name : icone,
              color: couleur
          }),
          dismissible: true
        });
        const dialogRef = this._fuseConfirmationService.open(this.dialogRep.value);
          dialogRef.afterClosed().subscribe((result) => {
                this.reparationToAdd  = [];
                this.reparationUser = [];
                this.selectedVoiture=undefined;
                this.selectedDateReparation=undefined;
                // location.reload()
              console.log("Reponse déposition : "+result);
          })
      }
    deleteIncluDemandePaiement(listeUsereparation,listeDemandePaiement){
        let result = listeUsereparation.map(userReparation => {
            userReparation.listeReparation = userReparation.listeReparation.filter(rep => {
            return !listeDemandePaiement.some(demandepaiement => demandepaiement.idReparation === rep._id);
        });
        return userReparation;
        });
        return result;
    }
}
