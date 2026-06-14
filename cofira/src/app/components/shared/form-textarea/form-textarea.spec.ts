import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormTextarea} from './form-textarea';

describe('FormTextarea', () => {
  let component: FormTextarea;
  let fixture: ComponentFixture<FormTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTextarea],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTextarea);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('etiqueta', 'Test');
    fixture.componentRef.setInput('nombre', 'test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
