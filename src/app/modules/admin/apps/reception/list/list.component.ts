import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { ReceptionService } from 'app/modules/admin/apps/reception/reception.service';
import { Category, Course } from 'app/modules/admin/apps/reception/reception.types';

@Component({
    selector       : 'reception-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceptionListComponent implements OnInit, OnDestroy
{
    categories: Category[];
    courses: Course[];
    filteredCourses: Course[];
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    filteredListeReparations: any;
    allCars: any;
    listeReparations: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _receptionService: ReceptionService
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
        // Get the categories
        this._receptionService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            this._receptionService.getNonReceptionne()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((liste: any) => {
                this.filteredListeReparations = this.listeReparations = liste;
                this._receptionService.getAllCars().pipe(takeUntil(this._unsubscribeAll)).subscribe((liste:any)=>{
                    this.allCars = liste
                    
                    for (let i = 0; i < this.filteredListeReparations.length; i++) {
                        for (let j = 0; j < this.allCars.length; j++) {
                            for(let k = 0; k < this.allCars[j].listeVoiture.length; k++){
                                if (this.filteredListeReparations[i].idVoiture === this.allCars[j].listeVoiture[k]._id) {
                                    this.filteredListeReparations[i].modele = this.allCars[j].listeVoiture[k].modele;
                                    this.filteredListeReparations[i].numero = this.allCars[j].listeVoiture[k].numero;
                                    
                                    console.log(this.filteredListeReparations[0].modele)
                                }
                            }
                        }
                    }
                    
                    this._changeDetectorRef.markForCheck();
                });
                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the courses
        this._receptionService.courses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((courses: Course[]) => {
                this.courses = this.filteredCourses = courses;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Filter the courses
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered courses
                this.filteredCourses = this.courses;

                // Filter by category
                if ( categorySlug !== 'all' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.category === categorySlug);
                }

                // Filter by search query
                if ( query !== '' )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.title.toLowerCase().includes(query.toLowerCase())
                        || course.description.toLowerCase().includes(query.toLowerCase())
                        || course.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if ( hideCompleted )
                {
                    this.filteredCourses = this.filteredCourses.filter(course => course.progress.completed === 0);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void
    {
        this.filters.categorySlug$.next(change.value);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
