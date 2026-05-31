import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture:   ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('submit button should be disabled when form is invalid', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should mark form valid with valid email and password', () => {
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    expect(component.form.valid).toBeTrue();
  });

  it('should show error message for invalid email', () => {
    component.form.get('email')?.setValue('not-an-email');
    component.form.get('email')?.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('p.text-red-500');
    expect(errorEl?.textContent).toContain('Valid email required');
  });

  it('should set loading to true on submit with valid form', () => {
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.submit();
    expect(component.loading).toBeTrue();
  });
});
