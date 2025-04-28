const weather = JSON.parse(localStorage.getItem("weatherData")) || [];

fetch("weather_data.csv")
  .then((res) => res.text())
  .then((csv) => {
    const rezultat = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const weatherData = rezultat.data.map((red) => ({
      date: red.Date,
      temperature: Number(red.Temperature),
      humidity: Number(red.Humidity),
      windSpeed: Number(red["Wind Speed"]),
      precipitation: Number(red.Precipitation),
      cloudCover: red["Cloud Cover"],
      atmosphericPressure: Number(red["Atmospheric Pressure"]),
      uvIndex: Number(red["UV Index"]),
      season: red.Season,
      visibility: Number(red.Visibility),
      location: red.Location,
      weatherType: red["Weather Type"],
    }));

    localStorage.setItem("weatherData", JSON.stringify(weatherData)); // Spremanje podataka u localStorage

    // Primjer: Ispis svih datuma i temperatura
  })
  .catch((error) => console.error("Greška pri dohvaćanju CSV-a:", error));

function prikaziTablicu(weatherData) {
  const tbody = document.querySelector("#weather-table tbody");
  tbody.innerHTML = ""; // Očisti postojeće retke

  for (const zapis of weatherData) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${zapis.date}</td>
        <td>${zapis.temperature}</td>
        <td>${zapis.humidity}</td>
        <td>${zapis.windSpeed}</td>
        <td>${zapis.precipitation}</td>
        <td>${zapis.cloudCover}</td>
        <td>${zapis.atmosphericPressure}</td>
        <td>${zapis.uvIndex}</td>
        <td>${zapis.season}</td>
        <td>${zapis.visibility}</td>
        <td>${zapis.location}</td>
        <td>${zapis.weatherType}</td>
        <td><button onclick="dodajUPlan('${zapis.date}')">Dodaj u plan</button></td>
      `;
    tbody.appendChild(row);
  }
}

prikaziTablicu(weather);

function filterData() {
  const datumOd = document.getElementById("datum-od").value;
  const datumDo = document.getElementById("datum-do").value;
  const tempOd = document.getElementById("temp-od").value;
  const tempDo = document.getElementById("temp-do").value;
  const lokacija = document.getElementById("lokacija-filter").value;
  const sezona = document.getElementById("sezona-filter").value;

  filtriraniPodaci = weather.filter((zapis) => {
    const datumCheck =
      (!datumOd || zapis.date >= datumOd) &&
      (!datumDo || zapis.date <= datumDo);
    const tempCheck =
      (!tempOd || zapis.temperature >= Number(tempOd)) &&
      (!tempDo || zapis.temperature <= Number(tempDo));
    const lokacijaCheck = !lokacija || zapis.location === lokacija;
    const sezonaCheck = !sezona || zapis.season === sezona;

    return datumCheck && tempCheck && lokacijaCheck && sezonaCheck;
  });

  prikaziTablicu(filtriraniPodaci);
}

let plan = [];

function dodajUPlan(dan) {
  if (!plan.includes(dan)) {
    plan.push(dan);
    osvjeziPlan();
  } else {
    alert("Taj dan je već u tvom planu!");
  }
}

function osvjeziPlan() {
  const lista = document.getElementById("lista-plana");
  lista.innerHTML = "";

  plan.forEach((dan, index) => {
    const li = document.createElement("li");
    li.textContent = `📅 ${dan}`;

    const ukloniBtn = document.createElement("button");
    ukloniBtn.textContent = "Ukloni";
    ukloniBtn.addEventListener("click", () => {
      ukloniIzPlana(dan);
    });

    li.appendChild(ukloniBtn);
    lista.appendChild(li);
  });
}

function ukloniIzPlana(index) {
  plan.splice(index, 1);
  osvjeziPlan();
}

// Potvrda plana aktivnosti
document.getElementById("potvrdi-plan").addEventListener("click", () => {
  if (plan.length === 0) {
    alert("Plan aktivnosti je prazan!");
  } else {
    alert(`Uspješno ste dodali ${plan.length} dana u svoj plan aktivnosti!`);
    plan = [];
    osvjeziPlan();
  }
});
