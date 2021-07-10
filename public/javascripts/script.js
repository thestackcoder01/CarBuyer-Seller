let usernameinp = document.querySelector('#usernameinp');
        let sbtn = document.querySelector('#sbtn');

        usernameinp.addEventListener('input',function(e){
            let username = usernameinp.value;
           fetch(`/checkusername/${username}`)
             .then(val => val.json())
             .then(function(res){
                 if(res.usernameValid) {
                     usernameinp.style.border = '2px solid red';
                     sbtn.style.display = 'none';
                    }
                 else{
                    usernameinp.style.border = '2px solid green'; 
                    sbtn.style.display = 'initial';
                 } 
               })
           
        })
    
       //
        var myInput = document.getElementById("psw");
        var letter = document.getElementById("letter");
        var capital = document.getElementById("capital");
        var number = document.getElementById("number");
        var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
    sbtn.style.display = 'intial';
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
    sbtn.style.display = 'none';
}

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
    sbtn.style.display = 'initial';
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
    sbtn.style.display = 'none';
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
    sbtn.style.display = 'initial';
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
    sbtn.style.display = 'none';
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
    sbtn.style.display = 'initial';
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
    sbtn.style.display = 'none';
  }
}