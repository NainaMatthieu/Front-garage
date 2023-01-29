import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcademyService } from '../academy.service';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
})
export class ModificationComponent implements OnInit {
  etatForm:UntypedFormGroup;
  listEtat:String[];
  reparation:any
  constructor(public matDialogRef: MatDialogRef<ModificationComponent>,
              private _formBuilder: UntypedFormBuilder,
              private _changeDetectorRef: ChangeDetectorRef,
              private _academyService: AcademyService,
              private _router: Router,
              ) {
  }
  
  ngOnInit(): void {
    this.reparation = this._academyService.reparationtoSet$;
    this.listEtat =['Terminé','En cours'];
    this.etatForm = this._formBuilder.group({
      etat   : ['', [Validators.required]]
    })
  }
  close(): void
  {
    // Close the dialog
      this.matDialogRef.close();
  }
  setEtat(): void{
      const onSuccess = (response:any)=>{
        if(response.message=='OK'){
          console.log(response)
          this.matDialogRef.close();
        }
      }
      const data = {
        idReparation : this.reparation._id,
        etat : this.etatForm.value
      }
      console.log(JSON.stringify(data))
      // this._academyService.setEtat()
  }
}
