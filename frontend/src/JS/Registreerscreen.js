async function postRegisterScreen() {
  const url = "http://127.0.0.1:5001/create";

  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("email").value;
  const birthDate = document.getElementById("bdate").value;
  const password = document.getElementById("pass").value;

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
      gender: "test",
    }),
  };

  response = await fetch(url, options);

  const data = await response.json();

  console.log(data);
}
