import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, MaterialsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  signInForm: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
    ]),
  });
  returnUrl = '/main';
  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams['redirectURL'])
    this.returnUrl = this.route.snapshot.queryParams['redirectURL'] || '/main';
  }

  signIn() {
    this.authService.signIn(this.signInForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        // this.router.navigate(['/main']);
        console.log(this.returnUrl)
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: any) => {
        console.log(error.error.message);
        this.dialogService.openDialogNegative(error.error.message);
      },
    });
  }
}
