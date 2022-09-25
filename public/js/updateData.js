import axios from "axios"
import { showAlert } from "./alert"

export const updateData=async function(data){
    try{
    const res=await axios({
        method:'patch',
        url:"http://127.0.0.1:3000/api/v1/users/updateMe",
       data
    })
  //console.log(res);
    if(res)
    {
        showAlert("success","Data updated successfully");
        setTimeout(()=>{
        location.reload(true)},1000)
    }
}
catch(err)
{
    if(err.response.data.message==='Duplicate data')
    showAlert("error","Email is already taken");
}

}


// updating password using passward change route
export const updatePassword=async function(currentPassword,password,passwordConfirm){
    try{
    const res=await axios({
        method:'patch',
        url:"http://127.0.0.1:3000/api/v1/users/changePassword",
        data:{
            currentPassword:currentPassword,
            newPassword:password,
            newpasswordConfirm:passwordConfirm
        }
    })

    if(res)
    {
        showAlert("success","Password changed successfully");
        setTimeout(()=>{
        location.reload(true)},1000)
    }
}
catch(err)
{
    //console.log(err);
    showAlert("error","Email is already taken");
}

}