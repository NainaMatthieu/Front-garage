import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { BonDeSortieService } from './bon-de-sortie.service';
import { Subject, takeUntil } from 'rxjs';
import { Voiture } from '../../apps/chat/chat.types';
@Component({
  selector: 'app-bon-de-sortie',
  templateUrl: './bon-de-sortie.component.html',
  styles         : [
    /* language=SCSS */
    `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
            }
        }
    `
],
encapsulation  : ViewEncapsulation.None,
changeDetection: ChangeDetectionStrategy.OnPush,
animations     : fuseAnimations
})
export class BonDeSortieComponent implements OnInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    listVoiture:any;
    constructor(private _bondeSortieServ : BonDeSortieService,  private _changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this._bondeSortieServ.listeVoiture$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((car: Voiture[]) => {
            this.listVoiture  = car;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

}
