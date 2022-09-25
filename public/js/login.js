/*eslint-disable*/
import axios from 'axios'

import { showAlert } from './alert';
export const login=async (email,password)=>{
   
   try{
    const res=await axios({
    method:"post",
    url:"http://127.0.0.1:3000/api/v1/users/login",
    
    data:{
        email:email,
        password:password
    }
   })
   showAlert('success',"you logged in successfully.")
   setTimeout(() => {
    location.assign('/');
   }, 1200);
   
}
catch(err)
{
    
   showAlert("error",err.response.data.message);
}
}


export const logout=async()=>{
    try{
        const res=await axios({
            method:"GET",
            url:"http://127.0.0.1:3000/api/v1/users/logout",

        })
        
        if(res.data.status==='success')
        location.assign('/');
        setTimeout(()=>{
            location.reload(true);},1000)
        showAlert('success',"your logged out successfully");
    }
    catch(err)
    {
        console.log(err.response);
        showAlert("error","Failed to log out");
    }
}