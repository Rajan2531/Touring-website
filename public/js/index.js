import '@babel/polyfill'
import { bookTour } from './stripe.js'
import {logout} from './login.js'
import  {login} from './login.js'
import { updateData, updatePassword } from './updateData.js'
const loginForm=document.querySelector(".form--login")
const saveForm=document.querySelector(".form-user-data");
const changePasswordForm=document.querySelector(".form-user-settings");
const bookingTour=document.getElementById('book-tour');
if(loginForm){
    loginForm.addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    
    login(email,password);
})}

const logoutButton=document.querySelector(".nav__el--logout");
if(logoutButton)
{
    logoutButton.addEventListener('click',logout)
}


if(saveForm)
{
    saveForm.addEventListener('submit',e=>{
        e.preventDefault();
        const form = new FormData();

        form.append("name",document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);
      
       
        updateData(form);
    })
}

if(changePasswordForm)
{
    changePasswordForm.addEventListener('submit',e=>{
        e.preventDefault();
        const currentPassword=document.getElementById('password-current').value;
        const password=document.getElementById('password').value;
        const passwordConfirm=document.getElementById('password-confirm').value;
        updatePassword(currentPassword,password,passwordConfirm);
    })
}

if(bookingTour)
{
    bookingTour.addEventListener('click',e=>{
        e.target.textContent='Processing';
        const tourId=e.target.dataset.tourId;
        console.log(tourId);
        bookTour(tourId);
    })
}