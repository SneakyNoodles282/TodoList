const username = document.querySelector("#username")
const password = document.querySelector("#password")

$( "#login" ).submit( async function(event) {
    event.preventDefault();
    const response = await axios.post("/auth/login", {username : username.value, password: password.value});
    if(!response.data.error){
        window.location.replace('/')
    }
    
});
