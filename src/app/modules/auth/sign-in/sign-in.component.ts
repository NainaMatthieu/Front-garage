/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilisateurSerice } from 'app/service/utilisateur.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    email:String[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _utilisateurServ : UtilisateurSerice
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
        
        this.email = []
        this.email.push('andrianmattax@gmail.com')
        this.email.push('responsable@gmail.com')
        this.email.push('axelinfiny19@gmail.com')
        // Create the form
        this.signInForm = this._formBuilder.group({
            mail     : ['', [Validators.required]],
            password  : ['12345', Validators.required],
            rememberMe: ['']
        });
        // mail     : ['andrianmattax@gmail.com', [Validators.required, Validators.email]],

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    // signIn(): void
    // {
    //     // Return if the form is invalid
    //     if ( this.signInForm.invalid )
    //     {
    //         return;
    //     }

    //     // Disable the form
    //     this.signInForm.disable();

    //     // Hide the alert
    //     this.showAlert = false;

    //     // Sign in
    //     this._authService.signIn(this.signInForm.value)
    //         .subscribe(
    //             () => {

    //                 // Set the redirect url.
    //                 // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
    //                 // to the correct page after a successful sign in. This way, that url can be set via
    //                 // routing file and we don't have to touch here.
    //                 const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

    //                 // Navigate to the redirect url
    //                 this._router.navigateByUrl(redirectURL);

    //             },
    //             (response) => {

    //                 // Re-enable the form
    //                 this.signInForm.enable();

    //                 // Reset the form
    //                 this.signInNgForm.resetForm();

    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'L\'email ou le mot de passe saisis est incorrect. Veuillez vérifier vos informations de connexion et réessayer.'
    //                 };

    //                 // Show the alert
    //                 this.showAlert = true;
    //             }
    //         );
    // }
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        console.log(this.signInForm.value);
        // Sign in
        const onSuccess = (response: any)=>{
            if(response.message==='KO'){
                 // Re-enable the form
                 this.signInForm.enable();

                 // Reset the form
                 this.signInNgForm.resetForm();

                 // Set the alert
                 this.alert = {
                     type   : 'error',
                     message: 'L\'email ou le mot de passe saisis est incorrect. Veuillez vérifier vos informations de connexion et réessayer.'
                 };

                 // Show the alert
                 this.showAlert = true;
            }else{
                    this._authService._authenticated = true;
                    const user  = {
                        _id : response.value._id ,
                        identifiant : response.value.identifiant,
                        mail: response.value.mail,
                        valid: response.value._id ,
                        listeVoiture: response.value.listeVoiture,
                        profil: response.value.profil
                    }
                    sessionStorage.setItem('user',JSON.stringify(user));
                    if(user.profil==='user'){
                        this._router.navigateByUrl('/dashboards/project');
                    }else if(user.profil==='responsable_atelier'){
                        this._router.navigateByUrl('/apps/academy')
                        return;
                    }
                    // console.log(response.value)
                    // Navigate to the redirect url
                    // this._router.navigateByUrl('/dashboards/project');
            }
        };

        this._authService.signIn(this.signInForm.value)
            .subscribe(onSuccess);
    }
}
