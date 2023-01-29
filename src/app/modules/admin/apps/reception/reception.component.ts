import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'reception',
    templateUrl    : './reception.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceptionComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
