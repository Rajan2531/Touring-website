import axios from 'axios'
import { showAlert } from './alert';

export const register=async function  (name,email,password,passwordConfirm){
    
    try{
    const res=await axios({
        method:'POST',
        url:"/api/v1/users/signup",
        data:{
            name:name,
            email:email,
            password:password,
            passwordConfirm:passwordConfirm
        }
    })
    if(res)
    {
        showAlert("success","Successfully registed your account");
        setTimeout(() => {
            location.assign('/login')
        }, 1000);
    }
}
catch(err)
{
   showAlert("error",err.response.data.message);
}
}