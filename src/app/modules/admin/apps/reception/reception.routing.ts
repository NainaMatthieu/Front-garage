import { Route } from '@angular/router';
import { ReceptionComponent } from 'app/modules/admin/apps/reception/reception.component';
import { ReceptionListComponent } from 'app/modules/admin/apps/reception/list/list.component';
import { ReceptionDetailsComponent } from 'app/modules/admin/apps/reception/details/details.component';
import { ReceptionCategoriesResolver, ReceptionCourseResolver, ReceptionCoursesResolver } from 'app/modules/admin/apps/reception/reception.resolvers';

export const receptionRoutes: Route[] = [
    {
        path     : '',
        component: ReceptionComponent,
        resolve  : {
            categories: ReceptionCategoriesResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: ReceptionListComponent,
                resolve  : {
                    courses: ReceptionCoursesResolver
                }
            },
            {
                path     : ':id',
                component: ReceptionDetailsComponent,
                resolve  : {
                    course: ReceptionCourseResolver
                }
            }
        ]
    }
];
