import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Category, Course } from 'app/modules/admin/apps/reception/reception.types';
import { ReceptionService } from 'app/modules/admin/apps/reception/reception.service';

@Injectable({
    providedIn: 'root'
})
export class ReceptionCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _receptionService: ReceptionService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]>
    {
        return this._receptionService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReceptionCoursesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _receptionService: ReceptionService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]>
    {
        return this._receptionService.getCourses();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ReceptionCourseResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _receptionService: ReceptionService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
         return this._receptionService.getReparationById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested task is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
        /*return this._receptionService.getCourseById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested task is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );*/
    }

    
}
