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
    newListItem.append(`${item.firstname} ${item.lastname} (${item.email})`);

    newButton.addEventListener("click", () => addFriend(item.id));

    newListItem.append(newButton);
    document.getElementById("searchResult").append(newListItem);
  });
}

async function addFriend(friendId) {
  const personId = sessionStorage.getItem("id");
  const friendIdString = String(friendId);

  if (friendIdString === String(personId)) {
    document.querySelector(".VerzoekBestaatAl").innerHTML =
      "Je kunt jezelf niet als vriend toevoegen.";
    return;
  }

  const url = `http://127.0.0.1:5001/addFriend/${personId}/${friendIdString}`;
  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    document.querySelector(".VerzoekBestaatAl").innerHTML =
      "Toevoegen mislukt, vriendschapsverzoek is al verstuurt";
  }

  const result = await response.json();
  console.log(result);

  const li = document.createElement("li");
  li.innerHTML = friendIdString;
  li.className = "friend";
}

async function myFriends() {
  const id = Number(sessionStorage.getItem("id"));
  const url = `http://127.0.0.1:5001/getUserFriends/${id}`;

  const request = await fetch(url);
  const response = await request.json();

  console.log(response);

  response.forEach((item) => {
    let friendId = "";
    const li = document.createElement("li");

    if (item.from_user === id) {
      friendId = item.to_user;
    } else {
      friendId = item.from_user;
    }

    console.log(friendId);

    async function getUserName(fid) {
      const url = `http://127.0.0.1:5001/get/${fid}`;
      try {
        const request = await fetch(url);
        const response = await request.json();
        li.append(
          `${response.firstName} ${response.lastName} (${response.email})`
        );
      } catch (err) {
        console.log(err);
      }
    }

    getUserName(friendId);
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

    async function getUserinfo(item) {
      const link = `http://127.0.0.1:5001/get/${item}`;

      const request = await fetch(link);

      const response = await request.json();
      console.log(response.firstName);
      li.append(
        `${response.firstName} ${response.lastName}(${response.email})`
      );
      li.append(btn);
    }

    getUserinfo(item.from_user);

    btn.addEventListener("click", () => {
      acceptFriend(item.request_id);
    });

    document.getElementById("friendRequest").append(li);
  });
}

async function acceptFriend(request_id) {
  const url = `http://127.0.0.1:5001/acceptFriend/${request_id}`;

  console.log(request_id);

  request = await fetch(url, { method: "POST" });

  response = await request.json();

  console.log(response);
}
