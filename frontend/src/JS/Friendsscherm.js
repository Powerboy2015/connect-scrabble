async function searchFriends() {
  document.getElementById("searchResult").innerHTML = "";
  const search = document.getElementById("friendSearchInput").value;
  const url = `http://127.0.0.1:5001/searchFriend/${search}`;

  const response = await fetch(url);

  const result = await response.json();

  result.forEach((item) => {
    const newListItem = document.createElement("li");
    const newButton = document.createElement("button");
    console.log(item);
    newListItem.append(`${item.firstname} ${item.lastname}`);

    newButton.addEventListener("click", () => addFriend(item.id));

    newListItem.append(newButton);
    document.getElementById("searchResult").append(newListItem);
  });
}

let currentFriends = [];

async function myFriends() {
  const id = sessionStorage.getItem("id");
  const url = `http://127.0.0.1:5001/getFriends/${id}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Kon vrienden niet ophalen:", response.statusText);
    return;
  }

  const result = await response.json();

  currentFriends = [];
  const ul = document.getElementById("myFriends");
  ul.innerHTML = "";

  result.forEach((item) => {
    const fid = String(item.friendId).trim();
    currentFriends.push(fid);

    const li = document.createElement("li");
    li.textContent = fid;
    ul.append(li);
  });

  return result;
}

async function addFriend(friendId) {
  const personId = sessionStorage.getItem("id");
  const friendIdString = String(friendId);

  if (currentFriends.includes(friendIdString)) {
    console.log(`Friend ${friendIdString} staat al in je lijst.`);
    return;
  }

  if (friendIdString === String(personId)) {
    console.log("Je kunt jezelf niet als vriend toevoegen.");
    return;
  }

  const url = `http://127.0.0.1:5001/addFriend/${personId}/${friendIdString}`;
  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    console.error("Toevoegen mislukt:", response.status, response.statusText);
    return;
  }

  const result = await response.json();
  console.log(result);

  currentFriends.push(friendIdString);
  const li = document.createElement("li");
  li.innerHTML = friendIdString;
  document.getElementById("myFriends").append(li);
}

async function friendRequests() {
  const url = "http://127.0.0.1:5001/getFriends";

  const request = await fetch(url);

  const response = await request.json();

  response.forEach((item) => {
    const currentPlayer = Number(sessionStorage.getItem("id"));

    if (item.friendId === currentPlayer) {
      li = document.createElement("li");
      btnA = document.createElement("button");
      btnD = document.createElement("button");
      btnA.innerHTML = "accept";
      btnD.innerHTML = "deny";

      btnA.addEventListener("click", () => approveRequest(item.personId));

      li.append(item.personId);
      li.append(btnA, btnD);

      document.getElementById("friendRequest").append(li);
    }
  });
}

async function approveRequest(approvedId) {
  const currentPlayer = sessionStorage.getItem("id");
  const url = `http://127.0.0.1:5001/addFriend/${currentPlayer}/${approvedId}`;

  const request = await fetch(url, { method: "POST" });

  const response = await request.json();

  console.log(response);
}
