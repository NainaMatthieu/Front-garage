import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilisateurSerice } from 'app/service/utilisateur.service';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit, OnDestroy
{
    @ViewChild('ajoutNgForm') ajoutNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean = false;

    formFieldHelpers: string[] = [''];
    ajoutForm: UntypedFormGroup;
    configForm: UntypedFormGroup;


    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
                private _utilisateurServ : UtilisateurSerice,
                private _fuseConfirmationService: FuseConfirmationService)
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
        this.ajoutForm = this._formBuilder.group({
            numero     : ['8991TBB', Validators.required],
            modele  : ['Nissan', Validators.required],
        });
        this.configForm = this._formBuilder.group({
            title      : 'Ajout d\'une nouvelle voiture',
            message    : '<span class="font-medium">L\'ajout d\'une nouvelle voiture a été effectuer avec succès!</span>',
            icon       : this._formBuilder.group({
                show : true,
                name : 'heroicons_outline:check',
                color: 'success'
            }),
            actions    : this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show : true,
                    label: 'OK',
                    color: 'warn'
                }),
            }),
            dismissible: true
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {}
    getFormFieldHelpersAsString(): string
    {
        return this.formFieldHelpers.join(' ');
    }
    ajouterVoiture(){
        if ( this.ajoutForm.invalid )
        {
            return;
        }
        console.log(this.ajoutForm.value)
        const onSuccess = (response: any)=>{
            console.log(response);
            if(response.message==='KO'){
                 // Re-enable the form
                 this.ajoutForm.enable();

                 // Reset the form
                 this.ajoutNgForm.resetForm();

                 // Set the alert
                 this.alert = {
                     type   : 'error',
                     message: response.value
                 };

                 // Show the alert
                 this.showAlert = true;
            }else{
                //    reussie
                this.ajoutForm.enable();

                 // Reset the form
                 this.ajoutNgForm.resetForm();
                console.log('______________________Update liste voiture SUCCESS___________________________')
                console.log(response)
                this.openConfirmationDialog();
            }
        };
        let user =JSON.parse(sessionStorage.getItem('user'));
        this.ajoutForm.disable();
        const data = {
            idUser : user._id,
            modele : this.ajoutForm.get('modele').value , 
            numero : this.ajoutForm.get('numero').value,
            dateAjout : new Date()
        }
        console.log(data);
        this._utilisateurServ.ajouterVoiture(data).subscribe(onSuccess);
        
    }
    openConfirmationDialog(): void
    {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }
}
