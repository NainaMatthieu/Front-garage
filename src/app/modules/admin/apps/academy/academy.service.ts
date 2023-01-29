import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Category, Course, ListeReparation, ReparationsVoitures } from 'app/modules/admin/apps/academy/academy.types';
import { baseUrl } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AcademyService
{
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _course: BehaviorSubject<Course | null> = new BehaviorSubject(null);
    private _courses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);
    private _listeReparations: BehaviorSubject<ListeReparation[] | null> = new BehaviorSubject(null);
    private reparation: Observable<ReparationsVoitures>;
    private reparationtoSet;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for courses
     */
    get courses$(): Observable<Course[]>
    {
        return this._courses.asObservable();
    }

    /**
     * Getter for course
     */
    get course$(): Observable<Course>
    {
        return this._course.asObservable();
    }

    get listereparations$() : Observable<ListeReparation[]>
    {
        return this._listeReparations.asObservable();
    }

    get reparation$() : Observable<any>
    {
        return this.reparation;
    }

    get reparationtoSet$(){
        return this.reparationtoSet;
    }
    setReparation(reparation){
        this.reparationtoSet = reparation;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]>
    {
        return this._httpClient.get<Category[]>('api/apps/academy/categories').pipe(
            tap((response: any) => {
                this._categories.next(response);
            })
        );
    }

    /**
     * Get courses
     */
    getCourses(): Observable<Course[]>
    {
        return this._httpClient.get<Course[]>('api/apps/academy/courses').pipe(
            tap((response: any) => {
                this._courses.next(response);
            })
        );
    }

    /**
     * Get course by id
     */
    getCourseById(id: string): Observable<Course>
    {
        return this._httpClient.get<Course>('api/apps/academy/courses/course', {params: {id}}).pipe(
            map((course) => {

                // Update the course
                this._course.next(course);

                // Return the course
                return course;
            }),
            switchMap((course) => {

                if ( !course )
                {
                    return throwError('Could not found course with id of ' + id + '!');
                }

                return of(course);
            })
        );
    }

    getAllReparation(){
        return this._httpClient.get("http://localhost:9000/reparation");
    }

    getAllReparationByUser(idUser: String){
        return this._httpClient.get("http://localhost:9000/reparation/"+idUser);
    }

    getReparationById(id: String){
        this.reparation = this._httpClient.get("http://localhost:9000/reparation/get/"+id);
        return this._httpClient.get("http://localhost:9000/reparation/get/"+id);
    }

    getPieceById(id: String){
        return this._httpClient.get("http://localhost:9000/piece/"+id);
    }

    getReparationById2(id: String) {
        return this._httpClient.get("http://localhost:9000/reparation/get/"+id).pipe(
            map(response => response as any)
        );
    }
    setEtat(data:any){
        let url = baseUrl+'reparation/set/etat';
        return this._httpClient.put(url,data);
    }
    
    getAllCars(){
        return this._httpClient.get("http://localhost:9000/user/car");
    }
}
