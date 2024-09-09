function Validation(values, currentStep) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobile_pattern = /^[0-9]{10}$/;

  if (currentStep === 1) {
    if (values.name === "") {
      error.name = "Name is required";
    } else {
      error.name = "";
    }
  }

  if (currentStep === 2) {
    if (values.email === "") {
      error.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
      error.email = "Email is invalid";
    } else {
      error.email = "";
    }

    if (values.mobile === "") {
      error.mobile = "Mobile number is required";
    } else if (!mobile_pattern.test(values.mobile)) {
      error.mobile = "Mobile number is invalid";
    } else {
      error.mobile = "";
    }
  }

  if (currentStep === 3) {
    if (values.password === "") {
      error.password = "Password is required";
    } else {
      error.password = "";
    }

    if (values.confirmPassword === "") {
      error.confirmPassword = "Confirm password is required";
    } else if (values.confirmPassword !== values.password) {
      error.confirmPassword = "Passwords do not match";
    } else {
      error.confirmPassword = "";
    }
  }

  return error;
}

export default Validation;