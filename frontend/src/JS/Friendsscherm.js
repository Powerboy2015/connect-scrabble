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
  const options = {
    method: "POST",
  };
  const url = `http://127.0.0.1:5001/addFriend/${personId}/${friendId}`;

  const response = await fetch(url, options);

  const result = await response.json();
  console.log(result);
}

async function myFriends() {
  const id = sessionStorage.getItem("id");
  const url = `http://127.0.0.1:5001/getFriends/${id}`;

  const response = await fetch(url);

  const result = await response.json();

  result.forEach((item) => {
    newListItem = document.createElement("li");
    newListItem.append(item.friendId);
    document.getElementById("myFriends").append(newListItem);
  });
}
