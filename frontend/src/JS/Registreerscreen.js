async function postRegisterScreen() {
  const url = "http://127.0.0.1:5001/create";

  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const birthDate = document.getElementById("bdate").value;
  const password = document.getElementById("pass").value;

  if (!firstName || !lastName || !email || !birthDate || !password) {
    document.getElementById("errorMessage").innerHTML = "Vul alle velden in";
  } else {
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate,
        password: password,
      }),
    };

    try {
      response = await fetch(url, options);

      const data = await response.json();
    } catch (err) {
      console.log(err);
    }

    if (response.ok) {
      window.location =
        "http://127.0.0.1:5500/connect-scrabble/frontend/src/HTML/Loginscreen.html";
    }
  }
}
