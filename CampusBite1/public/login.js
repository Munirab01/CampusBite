
let loginemail = document.getElementById('email');
let loginbtn = document.getElementById('loginbtn');
let loginpass = document.getElementById('password');



loginbtn.addEventListener('click',(event)=>{
    event.preventDefault();
    console.log("Clicked")
    const login = async()=>{

        try {
            const response = await fetch('http://localhost:3000/api/login',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email:loginemail.value,password:loginpass.value})
            });
            const res_data = await response.json();
            if(!(res_data.ok)){
                alert(res_data.msg);
                return 
            }
            console.log(res_data);
            alert(res_data.msg);
            window.location.href = "index.html";
        
        } catch (error) {
            console.log("Error",error);
        }
    }
    if(loginemail.value && loginpass.value &&loginpass.value.length <9 ){
        console.log("Called")
        login();
    }
    else{
        alert("Password length should be less than 8 character and fill all the details")
    }

})