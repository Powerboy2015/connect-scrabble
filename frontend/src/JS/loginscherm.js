async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const link = `http://127.0.0.1:5001/get/${email}/${password}`;

  const response = await fetch(link);

  const data = await response.json();

  console.log(data);

  if (data === "succes") {
    window.location =
      "http://127.0.0.1:5500/connect-scrabble/frontend/src/HTML/StartScreen.html";
  }
}
