import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { receptionRoutes } from 'app/modules/admin/apps/reception/reception.routing';
import { ReceptionComponent } from 'app/modules/admin/apps/reception/reception.component';
import { ReceptionDetailsComponent } from 'app/modules/admin/apps/reception/details/details.component';
import { ReceptionListComponent } from 'app/modules/admin/apps/reception/list/list.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        ReceptionComponent,
        ReceptionDetailsComponent,
        ReceptionListComponent
    ],
    imports     : [
        RouterModule.forChild(receptionRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatTabsModule
    ]
})
export class ReceptionModule
{
}
