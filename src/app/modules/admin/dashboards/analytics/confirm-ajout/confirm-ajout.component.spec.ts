import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAjoutComponent } from './confirm-ajout.component';

describe('ConfirmAjoutComponent', () => {
  let component: ConfirmAjoutComponent;
  let fixture: ComponentFixture<ConfirmAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAjoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
