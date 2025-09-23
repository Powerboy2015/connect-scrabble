function showProfileButton() {
  window.location =
    "http://127.0.0.1:5500/connect-scrabble/frontend/src/HTML/profilepage.html";

  console.log("test");
}

async function getProfileData() {
  const email = sessionStorage.getItem("email");
  const password = sessionStorage.getItem("password");

  const url = `http://127.0.0.1:5001/get/${email}/${password}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.firstName);

    document.getElementById(
      "name"
    ).innerHTML = `${result.firstName} ${result.lastName}`;

    function getAge(dateString) {
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    document.getElementById("age").innerHTML = getAge(result.birthDate);
  } catch (error) {
    console.error(error.message);
  }
}
