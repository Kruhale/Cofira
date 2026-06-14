import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormRegister} from './form-register';

describe('FormRegister', () => {
  let component: FormRegister;
  let fixture: ComponentFixture<FormRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRegister],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
