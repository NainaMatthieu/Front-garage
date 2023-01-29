import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ModernComponent } from 'app/modules/admin/pages/invoice/printable/modern/modern.component';
import { modernRoutes } from 'app/modules/admin/pages/invoice/printable/modern/modern.routing';
import { DatePipe } from '@angular/common';
@NgModule({
    declarations: [
        ModernComponent
    ],
    imports     : [
        RouterModule.forChild(modernRoutes),
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        DatePipe
    ]
})
export class ModernModule
{
}
