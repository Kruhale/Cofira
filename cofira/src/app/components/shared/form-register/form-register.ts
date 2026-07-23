import { Component, OnInit, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { NotificacionService } from '../../../services/notificacion.service';
import { IdiomaService } from '../../../services/idioma.service';
import { TEXTOS_REGISTRO } from './textos-registro';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormCheckbox, Button],
  templateUrl: './form-register.html',
  styleUrl: './form-register.scss',
})
export class FormRegister implements OnInit {
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private readonly idiomaService = inject(IdiomaService);

  /* Textos del formulario en el idioma vigente: al cambiar el signal se repinta todo */
  readonly textos = computed(() => TEXTOS_REGISTRO[this.idiomaService.idioma()]);

  formularioRegistro!: FormGroup;

  ngOnInit(): void {
    this.formularioRegistro = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        terminos: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.validadorContrasenasCoinciden,
      },
    );
  }

  validadorContrasenasCoinciden(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  alEnviar(): void {
    if (this.formularioRegistro.valid) {
      console.log('Formulario de registro enviado:', this.formularioRegistro.value);
      this.notificacion.exito(this.textos().exitoRegistro);
      this.formularioRegistro.reset();
    } else {
      this.formularioRegistro.markAllAsTouched();
      this.notificacion.advertencia(this.textos().avisoCamposInvalidos);
    }
  }

  get controlesDelFormulario() {
    return this.formularioRegistro.controls;
  }

  get terminosControl(): FormControl {
    return this.formularioRegistro.get('terminos') as FormControl;
  }
}
