import { Route } from '@angular/router';
import { BonDeSortieComponent } from './bon-de-sortie.component';
import { BonDeSortieResolver } from './bon-de-sortie.resolvers';

export const bonDeSortieRoutes: Route[] = [
    {
        path     : '',
        component: BonDeSortieComponent,
        resolve  : {
            bonDeSortie   : BonDeSortieResolver,
        },
    }
];
