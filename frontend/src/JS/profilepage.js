function showProfileButton() {
  window.location =
    "http://145.89.121.84/HTML/profilepage.html";
}

async function getProfileData() {
  const id = sessionStorage.getItem("id");
  const password = sessionStorage.getItem("password");

  const url = `http://145.89.121.84:5001/get/${id}/${password}`;

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

async function deleteCurrentUser() {
  const user = sessionStorage.getItem("id");

  const url = `http://145.89.121.84:5001/delete/${user}`;

  try {
    const request = fetch(url, { method: "DELETE" });

    const response = await request;

    const result = await response.json();

    console.log(result);

    sessionStorage.clear();

    window.location =
      "http://145.89.121.84/HTML/StartScreen.html";
  } catch (err) {
    console.log(err);
  }
}
