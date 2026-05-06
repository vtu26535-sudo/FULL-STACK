let nameField = document.getElementById("name");
let emailField = document.getElementById("email");

nameField.addEventListener("keyup", validateName);
emailField.addEventListener("keyup", validateEmail);

function validateName(){
    if(nameField.value.length < 3){
        nameField.classList.add("error");
        nameField.classList.remove("success");
    }else{
        nameField.classList.remove("error");
        nameField.classList.add("success");
    }
}

function validateEmail(){
    if(emailField.value.includes("@")){
        emailField.classList.add("success");
        emailField.classList.remove("error");
    }else{
        emailField.classList.add("error");
        emailField.classList.remove("success");
    }
}
let inputs = document.querySelectorAll("input, textarea");

inputs.forEach(function(field){

field.addEventListener("mouseover", function(){
field.classList.add("highlight");
});

field.addEventListener("mouseout", function(){
field.classList.remove("highlight");
});

});
function submitForm(){

alert("Thank you! Your feedback has been submitted.");

}