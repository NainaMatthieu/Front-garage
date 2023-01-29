import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Category, Course } from 'app/modules/admin/apps/reception/reception.types';

@Injectable({
    providedIn: 'root'
})
export class ReceptionService
{
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _course: BehaviorSubject<Course | null> = new BehaviorSubject(null);
    private _courses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);
    private _reparation: any;

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
    get reparation$(): Observable<any>
    {
        return this._reparation
    }

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

    getNonReceptionne(){
        const body = { };
        return this._httpClient.post("http://localhost:9000/reparation/depose",body);
    }

    getReparationById(id: String){
        this._reparation = this._httpClient.get("http://localhost:9000/reparation/get/"+id);
        return this._httpClient.get("http://localhost:9000/reparation/get/"+id);
    }

    getPieces() {
        return this._httpClient.get("http://localhost:9000/piece").pipe(
            map(response => response as any)
        );
    }

    insertReparations(piece:any,id:String){
        const body = {id,idPiece:piece.idPiece,description:piece.description,prix:piece.prix};
        return this._httpClient.put("http://localhost:9000/reparation/add/"+id,body);
    }

    updateReceptionne(id:String){
        const body = {id};
        return this._httpClient.put("http://localhost:9000/reparation/estReceptionne/"+id,body);
    }

    getAllCars(){
        return this._httpClient.get("http://localhost:9000/user/car");
    }
}
