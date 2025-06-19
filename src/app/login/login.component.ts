import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , RouterOutlet,CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  loginForm : FormGroup;
  CreateForm : FormGroup;

  constructor(private fb : FormBuilder, 
    private authService : AuthService,
    private router : Router,
    private snackBar: MatSnackBar) 
    {

    this.loginForm = this.fb.group({
      email : this.fb.control(null,Validators.required),
      password : this.fb.control(null,Validators.required),
    });

    this.CreateForm = this.fb.group({
      username : this.fb.control(null,Validators.required),
      email : this.fb.control(null,Validators.required),
      password : this.fb.control(null,Validators.required),
      userType : this.fb.control(null,Validators.required),
      isAdmin : this.fb.control(false),
      adminCode : this.fb.control(null,Validators.required),
    });


    }

  Login(){
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
console.log("login");
    this.authService.login(email , password).subscribe({    
      next : (user) => {
        if(user){
          console.log(user);
          //localStorage.removeItem("User");
        //
       // localStorage.setItem("User" , JSON.stringify({id : user.userId , username : user.username , userType : user.userType , jwt : "JWT_TOKEN"}));
          this.successMessage = "Congratulations, you have successfully logged in.";
          //this.router.navigateByUrl('/catalog');  
        }
      },
      error : (error) => {
        this.errorMessage = "Incorrect email or password. Please try again.";
      }
    });
  }



CreateAccount(){
    let username = this.CreateForm.value.username;
    let email = this.CreateForm.value.email;
    let password = this.CreateForm.value.password;
    let userType = this.CreateForm.value.userType;
    let isAdmin = this.CreateForm.value.isAdmin;
    let adminCode = this.CreateForm.value.adminCode;

  if(isAdmin == true){
      if(adminCode == 1234){
            this.authService.createtUser(new User(username,email,password,'Admin')).subscribe({
             next : (user) => {
             console.log('Utilisateur créé avec succès : ', user);
            //this.router.navigateByUrl("/user/home/"+user.firstName+"/"+user.lastName+"/"+user.role+"/"+user.id);
            this.successMessage = "Congratulations, you have successfully created compte.";
             this.router.navigateByUrl("/login");     
              },
            error : () => {
                 this.showNotification('An error occurred. Please try again.');
                  console.log('erreur creer Utilisateur  ');
                   }
             });
          }
        else{
            this.showNotification('Error: Wrong admin code!');
         }


}
else{
  this.authService.createtUser(new User(username,email,password,'client')).subscribe({
   next : (user) => {
   console.log('Utilisateur créé avec succès : ', user);
  //this.router.navigateByUrl("/user/home/"+user.firstName+"/"+user.lastName+"/"+user.role+"/"+user.id);
   this.router.navigateByUrl("/login");     
    },
  error : () => {
       this.showNotification('An error occurred. Please try again.');
        console.log('erreur creer Utilisateur  ');
         }
   });
}


  }
   
showNotification(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 5000, // Duration in milliseconds
    horizontalPosition: 'center', // Position horizontally
    verticalPosition: 'top', // Position vertically
  });
}
hideError(): void {
  this.errorMessage = ''; // Efface le message d'erreur
}
resetForm(): void {
  this.loginForm.reset(); // Réinitialise les champs du formulaire
}
retry(): void {
  // Redirection vers la route actuelle
  this.router.navigateByUrl("/login");
}


/*onAdminCheckboxChange(event: any) {
  const adminCodeControl = this.loginForm.get('adminCode');
  if (event.target.checked) {
    adminCodeControl?.setValidators([Validators.required]);
  } else {
    adminCodeControl?.clearValidators();
  }
  adminCodeControl?.updateValueAndValidity();
}*/

onAdminCheckboxChange(event: any) {
  const adminCodeControl = this.CreateForm.get('adminCode');
  if (event.target.checked) {
    adminCodeControl?.setValidators([Validators.required]);
  } else {
    adminCodeControl?.clearValidators();
  }
  adminCodeControl?.updateValueAndValidity();
}
}  