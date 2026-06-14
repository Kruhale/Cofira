import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {Seguimiento} from './seguimiento';

describe('Seguimiento', () => {
  let component: Seguimiento;
  let fixture: ComponentFixture<Seguimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seguimiento],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Seguimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
