const api = 'http://127.0.0.1:8000/sleeps';

document.getElementById('save-new-sleep').addEventListener('click', (e) => {
  e.preventDefault();
  postSleep();
  const closeBtn = document.getElementById('add-close');
  closeBtn.click();
});

const formatTime = (time) => {
  const [hour, minute] = time.split(':');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const calculateSleepDuration = (timeToSleep, timeAwake) => {
  const [sleepHour, sleepMinute] = timeToSleep.split(':').map(Number);
  const [awakeHour, awakeMinute] = timeAwake.split(':').map(Number);

  let sleepDate = new Date();
  sleepDate.setHours(sleepHour, sleepMinute, 0);

  let awakeDate = new Date();
  awakeDate.setHours(awakeHour, awakeMinute, 0);

  if (awakeDate < sleepDate) {
    awakeDate.setDate(awakeDate.getDate() + 1);
  }

  const duration = awakeDate - sleepDate;
  const durationHours = Math.floor(duration / (1000 * 60 * 60));
  const durationMinutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  return { durationHours, durationMinutes };
};

const postSleep = () => {
  const dateInput = document.getElementById('date');
  const date = dateInput.value;
  const timeToSleepInput = document.getElementById('timeToSleep');
  const timeToSleep = timeToSleepInput.value;
  const timeAwakeInput = document.getElementById('timeAwake');
  const timeAwake = timeAwakeInput.value;

  if (date && timeToSleep && timeAwake) {
    const { durationHours, durationMinutes } = calculateSleepDuration(timeToSleep, timeAwake);
    const sleepDuration = `${durationHours} hours and ${durationMinutes} minutes`;

    let sleepRecommendation = '';
    if (durationHours < 7) {
      const remainingHours = 6 - durationHours;
      const remainingMinutes = 60 - durationMinutes;
      sleepRecommendation = `<p class="card-text text-danger">It is recommended you sleep ${remainingHours} hours and ${remainingMinutes} minutes more to reach 7 hours.</p>`;
    } else {
      sleepRecommendation = `<p class="card-text text-success">You have had sufficient sleep for today!</p>`;
    }

    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.id = `card-${date}`;
    card.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Date: ${date}</h5>
                <p class="card-text">Went to Bed At: ${timeToSleep}</p>
                <p class="card-text">Woke Up At: ${timeAwake}</p>
                <p class="card-text">Slept For: ${sleepDuration}</p>
                ${sleepRecommendation}
                <button onClick="deleteSleep('${date}')" type="button" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `;

    document.getElementById('card-rows').appendChild(card);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        getSleeps();
      }
    };

    const token = localStorage.getItem("token");

    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify({ date, timeToSleep, timeAwake }));
  }
};

const deleteSleep = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      getSleeps();
    }
  };

  xhr.open('DELETE', `${api}/${id}`, true);
  xhr.send();
};

const displaySleeps = (sleeps) => {
  const cardRows = document.getElementById('card-rows');
  cardRows.innerHTML = '';
  sleeps.forEach((x) => {
    const { durationHours, durationMinutes } = calculateSleepDuration(x.timeToSleep, x.timeAwake);
    const sleepDuration = `${durationHours} hours and ${durationMinutes} minutes`;

    let sleepRecommendation = '';
    if (durationHours < 7) {
      const remainingHours = 6 - durationHours;
      const remainingMinutes = 60 - durationMinutes;
      sleepRecommendation = `<p class="card-text text-danger">It is recommended you sleep ${remainingHours} hours and ${remainingMinutes} minutes more to reach 7 hours.</p>`;
    } else {
      sleepRecommendation = `<p class="card-text text-success">You have had sufficient sleep for today!</p>`;
    }

    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.id = `card-${x.date}`;
    card.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title"><strong>${x.date}</h5>
                <p class="card-text">Went to Bed At: ${formatTime(x.timeToSleep)}</p>
                <p class="card-text">Woke Up At: ${formatTime(x.timeAwake)}</p>
                <p class="card-text">Slept For: ${sleepDuration}</p>
                ${sleepRecommendation}
                <button onClick="deleteSleep(${x.id})" type="button" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `;
    cardRows.appendChild(card);
  });
};

const getSleeps = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      console.log(data);
      displaySleeps(data);
    }
  };

  const token = localStorage.getItem("token");

  xhr.open("GET", "http://127.0.0.1:8000/sleeps", true);  
  xhr.setRequestHeader("Authorization", `Bearer ${token}`); 
  xhr.send();
};


(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to continue.");
    window.location.href = "/auth.html";
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userEmail = payload.user_name;

  const userStatus = document.getElementById('user-status');
  userStatus.innerHTML = `
    <span class="me-3"><strong>${userEmail}</strong></span>
    <button id="logout-btn" class="btn btn-outline-danger btn-sm">Logout</button>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem("token");
    window.location.href = "/auth.html";
  });

  getSleeps();
})();

