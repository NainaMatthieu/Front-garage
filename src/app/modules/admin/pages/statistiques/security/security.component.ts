import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { StatistiquesService } from 'app/modules/admin/pages/statistiques/statistiques.service';
import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';

@Component({
    selector: 'statistiques-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatistiquesSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;
    date1Control = new FormControl();
    date2Control = new FormControl();
    chart :any;
    chart2 : any;
    chiffreAffaires: any;
    chartData = [];
    yearControl = new FormControl();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder, private _statistiquesService: StatistiquesService, private _changeDetectorRef: ChangeDetectorRef
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: [''],
            newPassword: [''],
            twoStep: [true],
            askPasswordChange: [false]
        });
    }

    getDates(startDate: Date, endDate: Date) {
        let dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            let date = currentDate.toISOString().substring(0, 10);
            dates.push(date);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }
        

    /*getChiffreAffaires() {
        /*console.log(this.date1Control.value);
        console.log(this.date2Control.value);

        
        this._statistiquesService.getChiffreAffaire(this.date1Control.value,this.date2Control.value).subscribe((res:any)=>{
            this.chiffreAffaires = res.moyenne;
            this._changeDetectorRef.markForCheck();
        })
        
        let label = this.getDates(new Date(this.date1Control.value), new Date(this.date2Control.value))

        for(let i = 0;i<label.length;i++){
            
            this._statistiquesService.getChiffreAffaireByDay(label[i]).subscribe((res:number)=>{
                this.chartData[i] = res;
            })
        }

        if (this.chart) this.chart.destroy();
        this.chart = new Chart("MyChart", {
            type: 'bar', //this denotes tha type of chart
            data: {// values on X-Axis
              labels: label, 
                 datasets: [
                {
                  label: "Chiffre d'affaires",
                  data: this.chartData,
                  backgroundColor: 'blue'
                }
              ]
            },
            options: {
              aspectRatio:2.5
            }
        });

        console.log(this.chart.data)
    }*/

    async getChiffreAffaires() {
        let label = this.getDates(new Date(this.date1Control.value), new Date(this.date2Control.value))
        let promises = [];
        for(let i = 0;i<label.length;i++){
            promises.push(this._statistiquesService.getChiffreAffaireByDay(label[i]).toPromise());
        }
        let chartData = await Promise.all(promises);
        if (this.chart) this.chart.destroy();
        this.chart = new Chart("MyChart", {
            type: 'bar', 
            data: {
                labels: label, 
                datasets: [
                    {
                        label: "Chiffre d'affaires",
                        data: chartData,
                        backgroundColor: 'blue'
                    }
                ]
            },
            options: {
                aspectRatio:2.5
            }
        });
        console.log(this.chart.data)
        this._changeDetectorRef.markForCheck()
    }

    async getChiffreAffairesByYear(){
        let year = this.yearControl.value;

        let label = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        let promises = this._statistiquesService.getChiffreAffaireByYear(year).toPromise();
        
        let chartData = await promises
        if (this.chart2) this.chart2.destroy();
        this.chart2 = new Chart("MyChart2", {
            type: 'bar', 
            data: {
                datasets: [
                    {
                        label: "Chiffre d'affaires ( MGA )",
                        data: chartData,
                        backgroundColor: 'blue'
                    }
                ]
            },
            options: {
                aspectRatio:2.5
            }
        });
        console.log(this.chart2.data)
        this._changeDetectorRef.markForCheck()
    }

    onCheckboxChange(event) {
        const checkboxValue = event.target.checked;
        console.log(checkboxValue);
    }
}
