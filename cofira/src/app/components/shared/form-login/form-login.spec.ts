import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormLogin} from './form-login';

describe('FormLogin', () => {
  let component: FormLogin;
  let fixture: ComponentFixture<FormLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLogin],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
