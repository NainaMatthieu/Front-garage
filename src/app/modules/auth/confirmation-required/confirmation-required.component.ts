/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent  implements OnInit
{

    @ViewChild('confirmNgForm') confirmNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    confirmForm: UntypedFormGroup;
    showAlert: boolean = false;
    /**
     * Constructor
     */
    constructor(private _authService: AuthService,
                private _formBuilder: UntypedFormBuilder,
                private _router: Router){
    }
    ngOnInit(): void
    {
        // Create the form
        this.confirmForm = this._formBuilder.group({
                code      : ['', Validators.required]
            }
        );
    }
    confirmCompte(): void{
        // Do nothing if the form is invalid
        if ( this.confirmForm.invalid ) {return;}
        // Disable the form
        this.confirmForm.disable();

        // Hide the alert
        this.showAlert = false;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const onSuccess  =(response: any)=>{
            if(response.message==='OK'){
                const user  = {
                    _id : response.value._id ,
                    identifiant : response.value.identifiant,
                    mail: response.value.mail,
                    valid: response.value._id ,
                    listeVoiture: response.value.listeVoiture,
                    profil: response.value.profil
                }
                sessionStorage.setItem('user',JSON.stringify(user));
                this._authService._authenticated = true;
                this._router.navigateByUrl('/dashboards/project');
            }else{
                 // Re-enable the form
                 this.confirmForm.enable();

                 // Reset the form
                 this.confirmNgForm.resetForm();

                 // Set the alert
                 this.alert = {
                     type   : 'error',
                     message: 'Une erreur est survenue. Veuillez réessayer. '
                 };

                 // Show the alert
                 this.showAlert = true;
            }
        };
        this._authService.confirmCompte(this.confirmForm.value).subscribe(onSuccess);
    }
}
