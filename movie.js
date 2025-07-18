const url = new URL(location.href); 
const movieId = url.searchParams.get("id")
const movieTitle = url.searchParams.get("title")

const APILINK = `${import.meta.env.VITE_MOVIEWATCHLIST_BE_API_URL}/api/v1/reviews/`;

const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
          New Review
          <p><strong>Review: </strong>
            <input type="text" id="new_review" value="">
          </p>
          <p><strong>User: </strong>
            <input type="text" id="new_user" value="">
          </p>
          <p>
            <a href="#" id="saveReview">💾</a>
          </p>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new)

returnReviews(APILINK);

function returnReviews(url){
  fetch(url + "movie/" + movieId).then(res => res.json())
  .then(function(data){
  console.log(data);
  data.forEach(review => {
      const div_card = document.createElement('div');
      div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review: </strong>${review.review}</p>
                <p><strong>User: </strong>${review.user}</p>
                <p>
                  <a href="#" class="editReview" data-id="${review._id}" data-review="${review.review}" data-user="${review.user}">✏️</a>
                  <a href="#" class="deleteReview" data-id="${review._id}">🗑</a>
                </p>
              </div>
            </div>
          </div>
        `

      main.appendChild(div_card);
    });
  });
}

function editReview(id, review, user) {
  const element = document.getElementById(id);
  const reviewInputId = "review" + id
  const userInputId = "user" + id
  
  element.innerHTML = `
              <p><strong>Review: </strong>
                <input type="text" id="${reviewInputId}" value="${review}">
              </p>
              <p><strong>User: </strong>
                <input type="text" id="${userInputId}" value="${user}">
              </p>
              <p>
                <a href="#" class="saveEdit" data-id="${id}" data-review="${reviewInputId}" data-user="${userInputId}">💾</a>
              </p>
  `
}

function saveReview(reviewInputId, userInputId, id="") {
  console.log("Running save")
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  if (id) {
    fetch(APILINK + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user": user, "review": review})
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload();
      });        
  } else {
    fetch(APILINK + "new", {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload();
      });
  }
}

function deleteReview(id) {
  fetch(APILINK + id, {
    method: 'DELETE'
  }).then(res => res.json())
    .then(res => {
      console.log(res)
      location.reload();
    });    
}

// Event listeners
main.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'saveReview') {
    saveReview('new_review', 'new_user');
  }

  if (e.target && e.target.classList.contains('editReview')) {
    const id = e.target.dataset.id;
    const review = e.target.dataset.review;
    const user = e.target.dataset.user;
    editReview(id, review, user);
  }

  if (e.target && e.target.classList.contains('saveEdit')) {
    const id = e.target.dataset.id;
    const reviewInputId = e.target.dataset.review;
    const userInputId = e.target.dataset.user;
    saveReview(reviewInputId, userInputId, id);
  }

  if (e.target && e.target.classList.contains('deleteReview')) {
    const id = e.target.dataset.id;
    deleteReview(id);
  }
});
