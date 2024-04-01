const Validations= (values)=>{
    let errors={}
    if(!values.username){
        errors.username = "name Required"
    }
    if(!values.password){
        errors.password = "Password Required"
    }
    else if(values.password.length <6){
        errors.password = "Password must be at least 6 characters";
    }
    return errors;

}
const ValidationHttp=(error)=>{
   let errors={}
  
        
   if(error===404||error ===400){
      errors.username=( "incorrect password or user name");
   }
     return errors;
}

export default {Validations,ValidationHttp};