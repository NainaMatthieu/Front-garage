import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { StatistiquesComponent } from 'app/modules/admin/pages/statistiques/statistiques.component';
import { StatistiquesAccountComponent } from 'app/modules/admin/pages/statistiques/account/account.component';
import { StatistiquesSecurityComponent } from 'app/modules/admin/pages/statistiques/security/security.component';
import { StatistiquesPlanBillingComponent } from 'app/modules/admin/pages/statistiques/plan-billing/plan-billing.component';
import { StatistiquesNotificationsComponent } from 'app/modules/admin/pages/statistiques/notifications/notifications.component';
import { StatistiquesTeamComponent } from 'app/modules/admin/pages/statistiques/team/team.component';
import { statistiquesRoutes } from 'app/modules/admin/pages/statistiques/statistiques.routing';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        StatistiquesComponent,
        StatistiquesAccountComponent,
        StatistiquesSecurityComponent,
        StatistiquesPlanBillingComponent,
        StatistiquesNotificationsComponent,
        StatistiquesTeamComponent
    ],
    imports     : [
        RouterModule.forChild(statistiquesRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        MatFormFieldModule,
        MatTabsModule
    ]
})
export class StatistiquesModule
{
}
