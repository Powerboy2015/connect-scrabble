async function searchFriends() {
  document.getElementById("searchResult").innerHTML = "";
  const search = document.getElementById("friendSearchInput").value;
  console.log(search.toLowerCase());
  const url = `http://145.89.121.84:5001/searchFriend/${search.toLowerCase()}`;

  const response = await fetch(url);

  const result = await response.json();

  result.forEach((item) => {
    const newListItem = document.createElement("li");
    const newButton = document.createElement("button");
    newButton.innerHTML = "add friend";
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

  const url = `http://145.89.121.84:5001/addFriend/${personId}/${friendIdString}`;
  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    document.querySelector(".VerzoekBestaatAl").innerHTML =
      "Toevoegen mislukt, vriendschapsverzoek is al verstuurt";
  }

  const result = await response.json();

  const li = document.createElement("li");
  li.innerHTML = friendIdString;
}

async function myFriends() {
  const id = Number(sessionStorage.getItem("id"));
  const url = `http://145.89.121.84:5001/getUserFriends/${id}`;

  const request = await fetch(url);
  const response = await request.json();

  response.forEach((item) => {
    let friendId = "";
    const li = document.createElement("li");
    li.className = "friend";

    if (item.from_user === id) {
      friendId = item.to_user;
    } else {
      friendId = item.from_user;
    }

    async function getUserName(fid) {
      const url = `http://145.89.121.84:5001/get/${fid}`;
      try {
        const btn = document.createElement("button");
        const request = await fetch(url);
        const response = await request.json();
        li.append(
          `${response.firstName} ${response.lastName} (${response.email})`
        );
        li.append(btn);

        btn.innerHTML = "🗑";
        btn.className = "removeBtn";

        btn.addEventListener("click", async () => {
          const url = `http://145.89.121.84:5001/removeFriend/${id}/${fid}`;
          const request = await fetch(url, { method: "DELETE" });
          const response = await request.json();
        });
      } catch (err) {
        console.log(err);
      }
    }

    getUserName(friendId);
    document.getElementById("myFriends").append(li);
  });
}

async function getUserinfo(userId, li, btna, btnd) {
  const link = `http://145.89.121.84:5001/get/${userId}`;

  try {
    const request = await fetch(link);
    const response = await request.json();

    li.textContent = `${response.firstName} ${response.lastName} (${response.email})`;
    li.append(" ", btna, " ", btnd);
    li.className = "sentfriendrequests";
  } catch (error) {
    console.error("Fout bij ophalen van user info:", error);
    li.textContent = "Onbekende gebruiker";
  }
}

async function getUserinfoOut(item) {
  li = document.createElement("li");
  const link = `http://145.89.121.84:5001/get/${item}`;

  const request = await fetch(link);
  li.className = "sentfriendrequests";
  const response = await request.json();
  li.append(
    `${response.firstName} ${response.lastName}(${response.email})(outgoing)`
  );
  document.getElementById("friendRequest").append(li);
}

async function friendRequestOut() {
  const id = sessionStorage.getItem("id");

  const url = `http://145.89.121.84:5001/friendRequestsOutgoing/${id}`;
  const request = await fetch(url);
  const response = await request.json();

  for (const item of response) {
    await getUserinfoOut(item.to_user);
  }
}

async function friendRequests() {
  const id = sessionStorage.getItem("id");
  const url = `http://145.89.121.84:5001/friendRequests/${id}`;

  const request = await fetch(url);
  const response = await request.json();

  for (const item of response) {
    const li = document.createElement("li");
    const btna = document.createElement("button");
    const btnd = document.createElement("button");

    btna.innerHTML = "accept";
    btnd.innerHTML = "decline";

    btna.addEventListener("click", () => {
      acceptFriend(item.request_id);
    });
    btnd.addEventListener("click", () => {
      declineFriend(item);
    });

    // wacht op het ophalen en vullen van de <li>
    await getUserinfo(item.from_user, li, btna, btnd);

    document.getElementById("friendRequest").appendChild(li);
  }
}

async function acceptFriend(request_id) {
  const url = `http://145.89.121.84:5001/acceptFriend/${request_id}`;

  request = await fetch(url, { method: "POST" });

  response = await request.json();

  console.log(response);
}

async function declineFriend(item) {
  const url = `http://145.89.121.84:5001/declineFriend/${item.request_id}`;
  const url2 = `http://145.89.121.84:5001//removeFriend/${item.from_user}/${item.to_user}`;
  console.log(url2);

  request = await fetch(url, { method: "POST" });
  request2 = await fetch(url2, { method: "DELETE" });

  response = await request.json();

  response2 = await request.json();
}
