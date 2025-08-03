const amount = document.getElementById("amount");
const fromCountry = document.getElementById("fromCountry");
const toCountry = document.getElementById("toCountry");
const selectedSymbol = document.getElementById("selectedSymbol");
const selectFromImg = document.getElementById("selectedFromImg");
const selectToImg = document.getElementById("selectedToImg");
const rotate = document.querySelector(".form-control i");
const fromOutput = document.querySelector(".from-output");

window.addEventListener("load", () => {
  fetch("https://restcountries.com/v3.1/all?fields=name,currencies,flags,cca2")
    .then((response) => response.json())
    .then((data) => {
      const usedCurrencies = new Set();

      data.forEach((country) => {
        // if (!country?.currencies) return;

        const currencyKeys = Object.keys(country.currencies);

        currencyKeys.forEach((currencyKey) => {
          const currency = country.currencies[currencyKey];

          if (
            usedCurrencies.has(currencyKey) ||
            !currency?.name ||
            !currency?.symbol
          )
            return;

          usedCurrencies.add(currencyKey);

          const option1 = document.createElement("option");
          const option2 = document.createElement("option");

          option1.value = currencyKey;
          option2.value = currencyKey;

          option1.text = `${currencyKey} - ${currency.name}`;
          option2.text = `${currencyKey} - ${currency.name}`;

          //   const flagUrl = country.cca2
          //     ? `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`
          //     : "";

          //   option1.setAttribute("data-image", flagUrl);
          //   option2.setAttribute("data-image", flagUrl);

          option1.setAttribute(
            "data-image",
            `https://flagcdn.com/w320/${currencyKey
              .substring(0, 2)
              .toLowerCase()}.png`
          );
          option2.setAttribute(
            "data-image",
            `https://flagcdn.com/w320/${currencyKey
              .substring(0, 2)
              .toLowerCase()}.png`
          );

          option1.setAttribute("data-symbol", currency.symbol);
          option2.setAttribute("data-symbol", currency.symbol);

          option1.setAttribute("data-currency", currency.name);
          option2.setAttribute("data-currency", currency.name);

          option1.setAttribute("name", country.name.common);
          option2.setAttribute("name", country.name.common);

          fromCountry.appendChild(option1);
          toCountry.appendChild(option2);
        });
      });

      sortOptions(fromCountry);
      sortOptions(toCountry);

      fromCountry.value = "INR";
      toCountry.value = "USD";

      setCurrencySymbol();
      setSelectedCountry(fromCountry, selectFromImg);
      setSelectedCountry(toCountry, selectToImg);
    });
});

function setCurrencySymbol() {
  let selectCrSymbol =
    fromCountry.options[fromCountry.selectedIndex].getAttribute("data-symbol");
  selectedSymbol.innerHTML = selectCrSymbol;
}

function setSelectedCountry(option, Id) {
  let selectCrImg =
    option.options[option.selectedIndex].getAttribute("data-image");
  Id.setAttribute("src", selectCrImg);
}
function sortOptions(Id) {
  let options = Array.from(Id.options);

  options.sort((a, b) =>
    a.text.toLowerCase().localeCompare(b.text.toLowerCase())
  );

  Id.innerHTML = "";

  options.forEach((option) => Id.appendChild(option));
}

function rotateCurrency() {
  rotate.classList.toggle("rotate");

  let fromCT = fromCountry.value;
  let toCT = toCountry.value;

  fromCountry.value = toCT;
  toCountry.value = fromCT;
  setCurrencySymbol();
  setSelectedCountry(fromCountry, selectFromImg);
  setSelectedCountry(toCountry, selectToImg);

}

function convertCurrency() {
  fetch(
    "https://v6.exchangerate-api.com/v6/f21eebd9a9238abcf36ae079/latest/" +
      fromCountry.value
  )
    .then((response) => response.json())
    .then((data1) => {
      fetch(
        "https://v6.exchangerate-api.com/v6/f21eebd9a9238abcf36ae079/latest/" +
          toCountry.value
      )
        .then((response) => response.json())
        .then((data2) => {
          let exchangeRateTo = data1.conversion_rates[toCountry.value];
          let totalExchangeRateTo = (
            amount.value * exchangeRateTo
          ).toFixed(4);

          let exchangeRateFrom = data2.conversion_rates[fromCountry.value];

          let SelectedFromCountry =
            fromCountry.options[fromCountry.selectedIndex].getAttribute(
              "data-currency"
            );

          let selectedToCountry =
            toCountry.options[toCountry.selectedIndex].getAttribute(
              "data-currency"
            );

         let lastUpdate = "Last updated: " + data1.time_last_update_utc.replace(" +0000", "");
         let nextUpdate = "Next update on: " + data1.time_next_update_utc.replace(" +0000", "");
         
          let stringBuilder = "";
          stringBuilder += `<p>${amount.value} ${SelectedFromCountry}</p>`;
          stringBuilder += `<p>${totalExchangeRateTo} ${selectedToCountry}</p>`;
          stringBuilder += `<p>1 ${toCountry.value} = ${exchangeRateFrom.toFixed(4)} ${fromCountry.value}
          <span> ${lastUpdate} <br>${nextUpdate}</p>`;

          document.getElementById("convertedValue").innerHTML = stringBuilder;
        });
    });
}
