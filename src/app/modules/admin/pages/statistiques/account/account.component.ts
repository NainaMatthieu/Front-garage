import { ChangeDetectionStrategy, ChangeDetectorRef,Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatistiquesService } from 'app/modules/admin/pages/statistiques/statistiques.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector       : 'statistiques-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatistiquesAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    listCars : any[];
    countryControl = new FormControl();
    temps = "";
    tempsGlobal : any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,private _statistiquesService: StatistiquesService,private _changeDetectorRef: ChangeDetectorRef
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
        // Create the form
        this.accountForm = this._formBuilder.group({
            name    : ['Brian Hughes'],
            username: ['brianh'],
            title   : ['Senior Frontend Developer'],
            company : ['YXZ Software'],
            about   : ['Hey! This is Brian; husband, father and gamer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
            email   : ['hughes.brian@mail.com', Validators.email],
            phone   : ['121-490-33-12'],
            country : ['usa'],
            language: ['english']
        });

        this.listCars = [];
        this._statistiquesService.getCars().subscribe((car:any)=>{
            let tempListCars = car;
            for(let i = 0; i<tempListCars.length;i++){
                for(let j=0;j<tempListCars[i].listeVoiture.length;j++){
                    this.listCars.push( tempListCars[i].listeVoiture[j]);
                }
            }
        })

        this._statistiquesService.getTempsGlobal().subscribe((temps:any)=>{
            this.tempsGlobal = this.getTime(temps.moyenne);
            this._changeDetectorRef.markForCheck();
        })
    }

    getTime(decimalHours: number) {
        let totalSeconds = decimalHours * 3600;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds -= hours * 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds - minutes * 60;
        return `${hours} heure(s) ${minutes} minute(s)`;
    }

    getTemps(){
        console.log(this.countryControl.value);

        this._statistiquesService.getTempsById(this.countryControl.value).subscribe((temps:any)=>{
            this.temps = this.getTime(temps.moyenne)
            this._changeDetectorRef.markForCheck();
        })
    }
}
