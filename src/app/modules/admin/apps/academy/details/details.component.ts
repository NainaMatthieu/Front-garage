import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Category, Course, ListeReparation, ReparationsVoitures, Voiture, Piece } from 'app/modules/admin/apps/academy/academy.types';
import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ModificationComponent } from '../modification/modification.component';


@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('courseSteps', { static: true }) courseSteps: MatTabGroup;
    listeReparations: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    reparation: any;
    listeVoitures: Voiture[];
    user : any;
    modificationEtat: UntypedFormGroup;
    listeEtat : String[];
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _academyService: AcademyService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.listeEtat = ['Terminé','En cours']

        this._academyService.reparation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((course: any) => {
                console.log(course)
                // Get the course
                this.reparation = course[0];
                console.log("--------------------------"+this.reparation?.dateArrivee)
                let user = sessionStorage.getItem("user");
                let jsonObject = JSON.parse(user);
                this.user = jsonObject;

                this.listeVoitures = jsonObject.listeVoiture;
                for (let i = 0; i < this.listeVoitures.length; i++) {
                    if (this.listeVoitures[i].id == this.reparation.idVoiture) this.reparation.voiture = this.listeVoitures[i];
                }

                for (let i = 0; i < this.reparation.listeReparation.length; i++) {
                    if (!this.reparation.listeReparation[i].piece) {

                        this._academyService.getPieceById(this.reparation.listeReparation[i].idPiece).subscribe(piece => {
                            this.reparation.listeReparation[i].piece = piece[0];
                            this._changeDetectorRef.markForCheck();
                        });
                    }
                    this._changeDetectorRef.markForCheck();
                }


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------









    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    initmodificationEtat(indexReparation){
        let select= '<p>'+
        +'<mat-form-field class="w-full"> <mat-label>Adresse email</mat-label><mat-select>'+
        '<mat-option [value]="terminé">'+'Terminé </mat-option>'+
        '<mat-option [value]="en cours">'+'En cours </mat-option>'+
          '</mat-select></mat-form-field>'+
        '</p>'
        this.modificationEtat = this._formBuilder.group({
          title      : 'Modification',
          message    : '<span class="font-medium">Vous allez modifié l\'état de :'+this.reparation.listeReparation[indexReparation].piece.designation+' !</span>'+select,
          icon       : this._formBuilder.group({
              show : true,
              name : 'heroicons_outline:check',
              color: 'success'
          }),
          actions    : this._formBuilder.group({
              confirm: this._formBuilder.group({
                  show : true,
                  label: 'OK',
                  color: 'warn',
              }),
          }),
          dismissible: true
        });
        const dialogRef = this._fuseConfirmationService.open(this.modificationEtat.value);
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
      }
    modifierEtat(index){
        this.initmodificationEtat(index)
    }
    openModifcationDialog(index:any): void
    {
        this._academyService.setReparation(this.reparation.listeReparation[index]);
        this._matDialog.open(ModificationComponent, {
            autoFocus: false,
        });
    }
    setEtat(event,index){
        if(event.value!='Modifier'){
            console.log(this.reparation)
            const onSuccess = (response:any)=>{
                if(response.message=='OK'){
                    // console.log(response)
                    this.refreshData();
                }
              }
            const data = {
            idReparation : this.reparation._id,
            idPiece : this.reparation.listeReparation[index].idPiece,
            etat : event.value
            }
            console.log(JSON.stringify(data))
              this._academyService.setEtat(data).subscribe(onSuccess);
            // console.log(this.reparation.listeReparation[index])
        }
    }
    refreshData(){
        this._academyService.reparation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((course: any) => {
                console.log(course)
                // Get the course
                this.reparation = course[0];
                console.log("--------------------------"+this.reparation?.dateArrivee)
                let user = sessionStorage.getItem("user");
                let jsonObject = JSON.parse(user);
                this.user = jsonObject;

                this.listeVoitures = jsonObject.listeVoiture;
                for (let i = 0; i < this.listeVoitures.length; i++) {
                    if (this.listeVoitures[i].id == this.reparation.idVoiture) this.reparation.voiture = this.listeVoitures[i];
                }

                for (let i = 0; i < this.reparation.listeReparation.length; i++) {
                    if (!this.reparation.listeReparation[i].piece) {

                        this._academyService.getPieceById(this.reparation.listeReparation[i].idPiece).subscribe(piece => {
                            this.reparation.listeReparation[i].piece = piece[0];
                            this._changeDetectorRef.markForCheck();
                        });
                    }
                    this._changeDetectorRef.markForCheck();
                }


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
