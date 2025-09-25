async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const link = `http://127.0.0.1:5001/get/${email}/${password}`;

  try {
    const response = await fetch(link);

    if (!response.ok) {
      if (response.status === 404) {
        document.getElementById("error").innerHTML = "gebruiker bestaad niet";
      }
    } else {
      const data = await response.json();
      sessionStorage.setItem("id", data.id);
      sessionStorage.setItem("password", data.password);
      window.location =
        "http://127.0.0.1:5500/connect-scrabble/frontend/src/HTML/StartScreen.html";
    }
  } catch (err) {
    console.log(err);
  }
}
