const username = document.querySelector("#username")
const password = document.querySelector("#password")

$( "#signup" ).submit( async function(event) {
    event.preventDefault();
    const response = await axios.post("/auth/signup", {username : username.value, password: password.value})
    if(!response.data.error){
        window.location.replace('/login')
    }
    console.log(response)
    
});