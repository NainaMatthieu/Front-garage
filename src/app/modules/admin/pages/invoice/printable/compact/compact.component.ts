import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'compact',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompactComponent {
    /**
     * Constructor
     */
    id: string;
    reparation: any;
    listePieces: any;
    totalPrix: number;
    user:any;
    dateBondeSortie : Date = new Date();
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private route: ActivatedRoute, private _academyService: AcademyService, private _changeDetectorRef: ChangeDetectorRef,) {

    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.route.paramMap.subscribe(params => {
                this.id = params.get('id');
            });

        });

        
        this._academyService.getReparationById(this.id).subscribe((response) => {
            this.reparation = response[0];

            let user = sessionStorage.getItem("user");
            let jsonObject = JSON.parse(user);
            this.user = jsonObject;
            const listeVoitures = jsonObject.listeVoiture;
            for (let i = 0; i < listeVoitures.length; i++) {
                if (listeVoitures[i].id == this.reparation.idVoiture) {
                    this.reparation.modele = listeVoitures[i].modele;
                }
            }
            this._changeDetectorRef.markForCheck();

            this.totalPrix = 0;


            for (let i = 0; i < this.reparation.listeReparation.length; i++) {
                this.totalPrix += this.reparation.listeReparation[i].prix;
                if (!this.reparation.listeReparation[i].piece) {

                    this._academyService.getPieceById(this.reparation.listeReparation[i].idPiece).subscribe(piece => {
                        this.reparation.listeReparation[i].piece = piece[0];
                        this._changeDetectorRef.markForCheck();
                    });
                }
                this._changeDetectorRef.markForCheck();
            }

            console.log(this.reparation);
        })

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
