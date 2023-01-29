import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { ConfirmAjoutComponent } from './confirm-ajout.component';

export const routes: Route[] = [
    {
        path     : '',
        component: ConfirmAjoutComponent
    }
];

@NgModule({
    declarations: [
        ConfirmAjoutComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FuseHighlightModule,
        SharedModule
    ]
})
export class ConfirmAjoutModule
{
}
