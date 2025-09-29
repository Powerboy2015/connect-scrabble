async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const idLink = `http://127.0.0.1:5001/emailToId/${email}`;

  const idRequest = await fetch(idLink);

  const idResponse = await idRequest.json();

  console.log(idResponse.id);

  try {
    const id = idResponse.id;
    const link = `http://127.0.0.1:5001/get/${id}/${password}`;
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
