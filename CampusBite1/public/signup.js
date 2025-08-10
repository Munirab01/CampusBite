document.addEventListener('DOMContentLoaded', () => {
    let sname = document.getElementById('fullName');
    let semail = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let terms = document.getElementById('terms');
    let btn = document.getElementById('signup');
  
    btn.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent the form from submitting by default
  
      if (sname.value && semail.value && password.value && confirmPassword.value && terms.checked) {
        if (password.value.length >= 8) {
          if (password.value === confirmPassword.value) {
            const post = async () => {
              try {
                const response = await fetch('http://localhost:3000/api/signup', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sname: sname.value,
                    semail: semail.value,
                    password: password.value
                  })
                });
                const res_data = await response.json();
                if (!res_data.ok) {
                  alert(res_data.msg);
                  return;
                }
                alert(res_data.msg);
                window.location.href = 'index.html';
              } catch (error) {
                console.log("Error", error);
              }
            };
  
            post();
          } else {
            alert("Passwords do not match");
          }
        } else {
          alert("Password length should be at least 8 characters");
        }
      } else {
        alert("Please fill all the details and accept the terms & conditions");
      }
    });
  });
  