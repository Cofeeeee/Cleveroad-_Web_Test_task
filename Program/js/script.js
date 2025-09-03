let map;
let marker;

function initMap() {
  const myLatLng = { lat: 0, lng: 0 };

  // Ініціалізуємо карту
  map = new google.maps.Map(document.getElementById("map"), {
	zoom: 4,
	center: myLatLng,
  });

  // Створюємо маркер
  marker = new google.maps.Marker({
	position: myLatLng,
	map,
	title: "Current location ISS",
  });

  // Початковий виклик для завантаження даних
  updateAllData();
}

// Функція для оновлення всіх даних
async function updateAllData() {
   await fetchIssData();
   await fetchAstronauts();
   updateTime();
}

setInterval(updateAllData, 5000);

async function fetchIssData() {
	const url = 'http://api.open-notify.org/iss-now.json';

	try {
		const response = await fetch(url);
		const data = await response.json();

		const { latitude, longitude } = data.iss_position;
		const lat = parseFloat(latitude);
		const lng = parseFloat(longitude);

		// Створюємо новий об'єкт LatLng з отриманими координатами
		const newPosition = { lat: lat, lng: lng };
		
		// Оновлюємо позицію глобального маркера
		marker.setPosition(newPosition);

		// Переміщуємо центр карти за маркером
		map.panTo(newPosition);

		// Оновлюємо текст координат на сторінці
		document.getElementById('latitude').textContent = lat.toFixed(4);
		document.getElementById('longitude').textContent = lng.toFixed(4);

	} catch (error) {
		console.error('Error while receiving ISS data:', error);
		document.getElementById('latitude').textContent = 'Updating...';
		document.getElementById('longitude').textContent = 'Updating...';
	}
}

async function fetchAstronauts() {
	const url = 'http://api.open-notify.org/astros.json';
	try {
		const response = await fetch(url);
		const data = await response.json();

		// Фільтруємо людей, що знаходяться на "ISS"
		const issCrew = data.people.filter(person => person.craft === 'ISS');

		// Оновлюємо кількість людей
		document.getElementById('crew-count').textContent = issCrew.length;

		// Очищуємо попередній список і додаємо новий
		const crewList = document.getElementById('crew-list');
		crewList.innerHTML = '';
		
		issCrew.forEach(person => {
			const listItem = document.createElement('li');
			listItem.textContent = person.name;
			crewList.appendChild(listItem);
		});

	} catch (error) {
		console.error('Error while retrieving crew data:', error);
		document.getElementById('crew-count').textContent = 'No data';
		document.getElementById('crew-list').innerHTML = '<li>Updating...</li>';
	}
}

function updateTime() {
   const now = new Date();
   document.getElementById('utc-time').textContent = now.toUTCString();
}