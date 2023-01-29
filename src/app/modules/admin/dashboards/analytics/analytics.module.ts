import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { AnalyticsComponent } from 'app/modules/admin/dashboards/analytics/analytics.component';
import { analyticsRoutes } from 'app/modules/admin/dashboards/analytics/analytics.routing';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { UtilisateurSerice } from 'app/service/utilisateur.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmAjoutComponent } from './confirm-ajout/confirm-ajout.component';

@NgModule({
    declarations: [
        AnalyticsComponent,
        ConfirmAjoutComponent
    ],
    imports     : [
        RouterModule.forChild(analyticsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        NgApexchartsModule,
        MatStepperModule,
        MatRadioModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FuseHighlightModule,
        MatProgressSpinnerModule,
        SharedModule
    ],
    providers: [
        UtilisateurSerice
    ]
})
export class AnalyticsModule
{
}
