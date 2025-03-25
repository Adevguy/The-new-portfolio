document.getElementById("contact").addEventListener("submit", function (e) {
    e.preventDefault(); 

    let isValid = true; 

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = name.nextElementSibling;
    const emailError = email.nextElementSibling;
    const messageError = message.nextElementSibling;

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    name.style.border = "1px solid #ccc";
    email.style.border = "1px solid #ccc";
    message.style.border = "1px solid #ccc";

    if (name.value.trim() === "") {
      nameError.textContent = "Name is required!";
      name.style.border = "2px solid red";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      emailError.textContent = "Enter a valid email!";
      email.style.border = "2px solid red";
      isValid = false;
    }

    if (message.value.trim() === "") {
      messageError.textContent = "Message cannot be empty!";
      message.style.border = "2px solid red";
      isValid = false;
    }

    if (isValid) {
        document.getElementById("contact").submit()
    }
  });