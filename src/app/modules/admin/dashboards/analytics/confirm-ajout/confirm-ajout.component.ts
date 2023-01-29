import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-confirm-ajout',
  templateUrl: './confirm-ajout.component.html',
  styleUrls: ['./confirm-ajout.component.scss']
})
export class ConfirmAjoutComponent implements OnInit {
  

  configForm: UntypedFormGroup;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService
)
{
}
  ngOnInit(): void {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title      : 'Remove contact',
      message    : 'Are you sure you want to remove this contact permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon       : this._formBuilder.group({
          show : true,
          name : 'heroicons_outline:exclamation',
          color: 'success'
      }),
      actions    : this._formBuilder.group({
          confirm: this._formBuilder.group({
              show : true,
              label: 'Remove',
              color: 'success'
          }),
          cancel : this._formBuilder.group({
              show : true,
              label: 'Cancel'
          })
      }),
      dismissible: true
  });
  }

}
