// ВСТАВЬТЕ СЮДА СВОЙ КОНФИГ из Firebase (вместо этого блока)
const firebaseConfig = {
    apiKey: "AIzaSyBdk6weLeHPzrDxlaWc2Sqsd0DdIEmFbas",
    authDomain: "monetsl.firebaseapp.com",
    projectId: "monetsl",
    storageBucket: "monetsl.firebasestorage.app",
    messagingSenderId: "374015238946",
    appId: "1:374015238946:web:a228379e30eaf29480bb7b"
  };

// Подключаемся к базе, коллекция называется reviews
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const reviewsRef = db.collection("reviews");

const form = document.getElementById("review-form");
const list = document.getElementById("review-list");
const message = document.getElementById("review-message");

// Показываем все отзывы из базы
async function loadReviews() {
  list.innerHTML = "";
  const snapshot = await reviewsRef.orderBy("createdAt", "desc").get();   // новые сверху

  snapshot.forEach(function (doc) {
    const r = doc.data();
    const card = document.createElement("div");
    card.className = "review-card";

    // Заготовка карточки, а тексты вставляем ниже через textContent
    card.innerHTML = "<h4></h4><p></p><p class='review-stars'></p><p></p>";
    card.children[0].textContent = r.name;
    card.children[1].textContent = r.art;
    card.children[2].textContent = "★".repeat(r.rating);
    card.children[3].textContent = r.emotions;

    list.appendChild(card);
  });
}

// Нажали «Send review»: сохраняем отзыв в базу
form.addEventListener("submit", async function (event) {
  event.preventDefault();          // страница не перезагружается

  // Какая звезда выбрана
  const chosen = form.querySelector('input[name="rating"]:checked');
  if (!chosen) {
    message.textContent = "Please choose a rating.";
    return;
  }

  // Если выбран Other, берем текст из ручного ввода, иначе из выпадающего списка
  const selectElement = document.getElementById("rv-art-select");
  let artValue = selectElement.value;
  if (artValue === "other") {
    artValue = document.getElementById("rv-art-custom").value;
  }

  await reviewsRef.add({
    name: document.getElementById("rv-name").value,
    art: artValue,
    rating: Number(chosen.value),
    emotions: document.getElementById("rv-emotions").value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()   // время отправки
  });

  // После отправки скрываем поле other обратно
  document.getElementById("other-container").style.display = "none";

  form.reset();
  message.textContent = "Thank you for your review!";
  loadReviews();
});

// При открытии страницы сразу показываем отзывы
loadReviews();

// Poryadok pokaz/skrytiya polya "Other"
function checkOther(select) {
  const otherContainer = document.getElementById("other-container");
  const customInput = document.getElementById("rv-art-custom");
  
  if (select.value === "other") {
    otherContainer.style.display = "block";
    customInput.required = true;
  } else {
    otherContainer.style.display = "none";
    customInput.required = false;
    customInput.value = ""; // ochishaem, esli peredumali
  }
}