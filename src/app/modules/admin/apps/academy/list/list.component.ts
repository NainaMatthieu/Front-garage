import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import { Category, Course, ListeReparation, ReparationsVoitures } from 'app/modules/admin/apps/academy/academy.types';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'academy-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyListComponent implements OnInit, OnDestroy {
    isLoading: boolean = true;

    categories: Category[];
    courses: Course[];
    filteredCourses: Course[];
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
            categorySlug$: new BehaviorSubject('all'),
            query$: new BehaviorSubject(''),
            hideCompleted$: new BehaviorSubject(false)
        };
    listereparations: any;
    filteredListeReparations: any;
    voiture: any;
    listeVoitures: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _academyService: AcademyService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._academyService.getAllReparation().pipe(takeUntil(this._unsubscribeAll)).subscribe((res: ReparationsVoitures) => {
            this.voiture = res;
        });

        let user = sessionStorage.getItem("user");
        let jsonObject = JSON.parse(user);
        
        this.listeVoitures = jsonObject.listeVoiture

        if(jsonObject.profil=="responsable_atelier"||jsonObject.profil=="responsable_financier"){
            this._academyService.getAllReparation()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {

                this.isLoading = false;
                this.listereparations = this.filteredListeReparations = response;

                
                this._academyService.getAllCars().subscribe((res:any)=>{
                    let newList = res.map(user => {
                        return user.listeVoiture.map(voiture=>{
                                return {
                                    _id: voiture._id,
                                    modele: voiture.modele,
                                    numero: voiture.numero
                                }
                        }).flat();
                    })
                    newList = this.flattenData(newList)
                    this.listeVoitures = newList;
                    for (let i = 0; i < this.listereparations.length; i++) {
                        for (let j = 0; j < this.listeVoitures.length; j++) {
                            if (this.listereparations[i].idVoiture == this.listeVoitures[j]._id) {
                                
                                this.listereparations[i].modele = this.listeVoitures[j].modele;
                                this._changeDetectorRef.markForCheck();
                            }
                        }
                    }
                    console.log(this.listereparations)
                    for (let i = 0; i < this.listereparations.length; i++) {
                        if (!this.listereparations[i].modele) this.listereparations[i].modele = "";
                    }
                })
                
                this._changeDetectorRef.markForCheck();
            });
        }else if(jsonObject.profil=="user"){
            this._academyService.getAllReparationByUser(jsonObject._id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {

                this.isLoading = false;
                this.listereparations = this.filteredListeReparations = response;

                for (let i = 0; i < this.listereparations.length; i++) {
                    for (let j = 0; j < this.listeVoitures.length; j++) {
                        if (this.listereparations[i].idVoiture == this.listeVoitures[j]._id) {
                            
                            this.listereparations[i].modele = this.listeVoitures[j].modele;
                        }
                    }
                }

                for (let i = 0; i < this.listereparations.length; i++) {
                    if (!this.listereparations[i].modele) this.listereparations[i].modele = "";
                }
                this._changeDetectorRef.markForCheck();
            });
        }
        /**/

            

        // Get the categories
        this._academyService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the courses
        this._academyService.courses$
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
                //this.filteredCourses = this.courses;
                this.filteredListeReparations = this.listereparations;
                // Filter by category
                if (categorySlug !== 'all') {
                    //this.filteredCourses = this.filteredCourses.filter(course => course.category === categorySlug);
                    this.filteredListeReparations = this.filteredListeReparations.filter(course => course.etat === categorySlug);
                }

                // Filter by search query
                if (query !== '') {
                    /*this.filteredCourses = this.filteredCourses.filter(course => course.title.toLowerCase().includes(query.toLowerCase())
                        || course.description.toLowerCase().includes(query.toLowerCase())
                        || course.category.toLowerCase().includes(query.toLowerCase()));*/
                    this.filteredListeReparations = this.filteredListeReparations.filter(course => course.modele.toLowerCase().includes(query.toLowerCase())
                    );
                }

                // Filter by completed
                if (hideCompleted) {
                    this.filteredCourses = this.filteredCourses.filter(course => course.progress.completed === 0);
                }
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

    flattenData(data) {
        let flatArray = [];
        data.forEach(subArray => {
            subArray.forEach(item => {
                if (item) {
                    flatArray.push(item);
                }
            });
        });
        return flatArray;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void {
        this.filters.categorySlug$.next(change.value);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
