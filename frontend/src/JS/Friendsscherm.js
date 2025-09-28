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

async function addFriend(friendId) {
  const personId = sessionStorage.getItem("id");
  const friendIdString = String(friendId);

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

  const li = document.createElement("li");
  li.innerHTML = friendIdString;
  document.getElementById("myFriends").append(li);
}

async function myFriends() {
  const id = sessionStorage.getItem("id");
  const url = `http://127.0.0.1:5001/getUserFriends/${id}`;

  const request = await fetch(url);

  const response = await request.json();

  console.log(response);

  response.forEach((item) => {
    li = document.createElement("li");
    li.append(item.to_user);

    document.getElementById("myFriends").append(li);
  });
}

async function friendRequests() {
  const id = sessionStorage.getItem("id");
  const url = `http://127.0.0.1:5001/friendRequests/${id}`;

  const request = await fetch(url);

  const response = await request.json();
  console.log(response);
  response.forEach((item) => {
    li = document.createElement("li");
    btn = document.createElement("button");

    li.append(item.from_user);
    li.append(btn);

    btn.addEventListener("click", () => {
      acceptFriend(item.request_id);
    });

    document.getElementById("friendRequest").append(li);

    console.log(item.from_user);
  });
}

async function acceptFriend(request_id) {
  const url = `http://127.0.0.1:5001/acceptFriend/${request_id}`;

  console.log(request_id);

  request = await fetch(url, { method: "POST" });

  response = await request.json();

  console.log(response);
}
