const Validations = (values) => {
    let errors = {};
  
    if (!values.username) {
      errors.username = "Name Required";
    }
  
    if (!values.password) {
      errors.password = "Password Required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    if (!values.email) {
      errors.email = "Email Required";
    } else {
      
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (!emailRegex.test(values.email)) {
        errors.email = "Invalid email address";
      }
    }
  
    return errors;
  };
  const ValidationHttp = (error) => {
    let errors = {};
  
    if (error === 400) {
      
        errors.email = "Username or Email already taken.";
    }       
    else if(error === 500) {
        errors.email = "An error occurred during registration.";
    }
  
    return errors;
  };
  

export default {Validations,ValidationHttp};