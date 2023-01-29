import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Category, Course } from 'app/modules/admin/apps/reception/reception.types';
import { ReceptionService } from 'app/modules/admin/apps/reception/reception.service';
import { Router } from '@angular/router';

@Component({
    selector: 'reception-details',
    templateUrl: './details.component.html',
    template: `
    <p>{{ id }}</p>
  `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceptionDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('courseSteps', { static: true }) courseSteps: MatTabGroup;
    @ViewChild('descriptionInput') descriptionInput: ElementRef;
    @ViewChild('prixInput') prixInput: ElementRef;

    categories: Category[];
    course: Course;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    reparation: any;
    options: any;
    selectedOption: { id: '', designation: '' };
    listeReparations = [];

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _receptionService: ReceptionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._receptionService.reparation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((reparation: any) => {
                this.reparation = reparation;
                console.log(reparation);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._receptionService.getPieces().pipe(takeUntil(this._unsubscribeAll)).subscribe((piece: any) => {
            this.options = piece;
            this.selectedOption = this.options[0]._id;
            this._changeDetectorRef.markForCheck();
        });
        this.options = [
            { value: 'option1', name: 'Option 1' },
            { value: 'option2', name: 'Option 2' },
            { value: 'option3', name: 'Option 3' },
        ];
        this.selectedOption = this.options[0].value;

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
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
     * Go to given step
     *
     * @param step
     */




    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Scrolls the current step element from
     * sidenav into the view. This only happens when
     * previous/next buttons pressed as we don't want
     * to change the scroll position of the sidebar
     * when the user actually clicks around the sidebar.
     *
     * @private
     */
    private _scrollCurrentStepElementIntoView(): void {
        // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
        setTimeout(() => {

            // Get the current step element and scroll it into view
            const currentStepElement = this._document.getElementsByClassName('current-step')[0];
            if (currentStepElement) {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    addReparation(): void {
        let item = {
            idPiece: this.selectedOption.id,
            designation: this.selectedOption.designation,
            description: this.descriptionInput.nativeElement.value,
            prix: this.prixInput.nativeElement.value
        }
        this.listeReparations.push(item);
    }

    deleteItem(index: number) {
        this.listeReparations.splice(index, 1);
    }

    insert() {
        // logic to insert data
        for (let i = 0; i < this.listeReparations.length; i++) {
            this._receptionService.insertReparations(this.listeReparations[i],this.reparation[0]._id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                });
            this._receptionService.updateReceptionne(this.reparation[0]._id).subscribe(()=>{
            });
        }
        this.router.navigate(['apps/academy/'+this.reparation[0]._id]);
    }

}
