const url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  let editingItemId = null;

  const imageElement = document.querySelector(".main-image");

  function changeImage() {
    imageElement.src =
      "https://picsum.photos/600/900?random=" + new Date().getTime();
  }

  setInterval(changeImage, 10000);

  async function fetchItems() {
    try {
      const response = await fetch(`${url}/api/items`);
      const items = await response.json();

      itemsArray = items;

      const listWrapper = document.querySelector(".list-wrapper");
      const emptyListMessage = document.querySelector(".empty-list");

      listWrapper.innerHTML = "";

      if (items.length === 0) {
        emptyListMessage.style.display = "block";
      }

      items.forEach((item) => {
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.setAttribute("data-id", item.id);

        const titleParagraph = document.createElement("p");
        titleParagraph.textContent = item.title;

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const editButton = document.createElement("div");
        editButton.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="FD5842" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.71 11.0425C25.1 10.6525 25.1 10.0025 24.71 9.6325L22.37 7.2925C22 6.9025 21.35 6.9025 20.96 7.2925L19.12 9.1225L22.87 12.8725L24.71 11.0425ZM7 21.2525V25.0025H10.75L21.81 13.9325L18.06 10.1825L7 21.2525Z" fill="white"/>
          </svg>
        `;

        editButton.addEventListener("click", () => {
          editingItemId = item.id;

          document.getElementById("title").value = item.title;
          document.getElementById("year").value = item.year;
          document.getElementById("rating").value = item.rating;
          document.getElementById("imdb").value = item.imdb;
          document.getElementById("description").value = item.description;

          const submitButton = form.querySelector("button[type='submit']");
          submitButton.setAttribute("data-type", "edit");
          submitButton.innerHTML = `
            <svg width="59" height="59" viewBox="0 0 24 24" fill="#FD5842" xmlns="http://www.w3.org/2000/svg" style='transform: translateY(4px);'><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m-2 14-3 1 1-3 7-7 2 2Z"/></svg>
          `;
        });

        const deleteButton = document.createElement("div");
        deleteButton.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 8H19.5L18.5 7H13.5L12.5 8H9V10H23V8ZM10 23C10 23.5304 10.2107 24.0391 10.5858 24.4142C10.9609 24.7893 11.4696 25 12 25H20C20.5304 25 21.0391 24.7893 21.4142 24.4142C21.7893 24.0391 22 23.5304 22 23V11H10V23Z" fill="#FD5842"/>
          </svg>
        `;

        deleteButton.addEventListener("click", async () => {
          console.log(item.id);
          try {
            const response = await fetch(`${url}/api/items/${item.id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              fetchItems();
            } else {
              alert("Failed to delete item: " + response.statusText);
            }
          } catch (error) {
            alert("Error deleting item: " + error);
          }
        });

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        listItem.appendChild(titleParagraph);
        listItem.appendChild(buttonsDiv);

        listWrapper.appendChild(listItem);
      });
    } catch (error) {
      alert("Error fetching items: " + error);
    }
  }

  fetchItems();

  const form = document.querySelector(".form-wrapper");

  const imdbInput = document.getElementById("imdb");

  function validateIMDb() {
    console.log("hey");

    const imdbError = document.getElementById("imdb-error");

    if (!imdbInput.value.includes("imdb")) {
      imdbError.style.display = "block";
    } else {
      imdbError.style.display = "none";
    }
  }
  imdbInput.addEventListener("blur", validateIMDb);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const rating = document.getElementById("rating").value;
    const imdb = document.getElementById("imdb").value;
    const description = document.getElementById("description").value;

    const dataType = form
      .querySelector("button[type='submit']")
      .getAttribute("data-type");

    const itemData = {
      title,
      year,
      rating,
      imdb,
      description,
    };

    try {
      let response;

      if (dataType === "add") {
        response = await fetch(`${url}/api/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
      } else if (dataType === "edit" && editingItemId) {
        response = await fetch(`${url}/api/edit/${editingItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
      }

      if (response.ok) {
        form.reset();

        editingItemId = null;
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.setAttribute("data-type", "add");
        submitButton.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
            xml:space="preserve"
            width="50px"
            heigth="50px"
          >
            <path
              fill="#FD5842"
              d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0m12.5 28H28v11a2 2 0 0 1-4 0V28H13.5a2 2 0 0 1 0-4H24V14a2 2 0 0 1 4 0v10h10.5a2 2 0 0 1 0 4"
            />
          </svg>
        `;

        fetchItems();
      } else {
        alert(
          dataType === "add"
            ? "Failed to create item: " + response.statusText
            : "Failed to update item: " + response.statusText
        );
      }
    } catch (error) {
      alert("Error submitting form: " + error);
    }
  });
});
