let currencies = ["ETC", "LTC"];
let mainCurrency;

let euTable = [
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  }
];

let usTable = [
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  },
  {
    price: 0.1916,
    limit: 0.01,
    miners: 22,
    speed: 0.0095
  }
];

function generateTable(price, limit, miners, speed) {
  return `<div class="table-item"><div class="table-item-block"><p class="table-item-text price">${price}</p></div><div class="table-item-block"><p class="table-item-text limit">${limit}</p></div><div class="table-item-block"><p class="table-item-text miners">${miners}</p></div><div class="table-item-block"><p class="table-item-text speed">${speed}</p></div></div>`;
}

function updateTokenIds(newTokenId) {
  $(".token-id").each(function () {
    $(this).text(newTokenId);
  });
}

function updateCurrencies(currencies) {
  $(".token-link").remove();
  currencies.forEach(function (currency) {
    console.log(currency);
    $(".dropdown-list").append(`<a href="#" class="token-link w-dropdown-link" tabindex="0">${currency}</a>`);
  });
  mainCurrency = $(".token-link").first().text();
  $(".token-text").text(mainCurrency);
  updateTokenIds(mainCurrency);
}

function updateTHS(euTH, usTH) {
  $("#eu-amount-header").text(euTH);
  $("#us-amount-header").text(usTH);
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function euTableLoop(table) {
  $("#eu-table-wrapper").empty();
  table.forEach(function (item) {
    $("#eu-table-wrapper").append(generateTable(item.price, item.limit, item.miners, item.speed));
  });
}

function usTableLoop(table) {
  $("#us-table-wrapper").empty();
  table.forEach(function (item) {
    $("#us-table-wrapper").append(generateTable(item.price, item.limit, item.miners, item.speed));
  });
}

function updateStats(currentProfitability, unconfirmedBal, unpaidBal, personalLuck, avgPersonalLuck, lastBlockTimeUnix, totalOverallProfit) {
  $("#current-profitability").text(currentProfitability);
  $("#unconfirmed-bal").text(unconfirmedBal);
  $("#unpaid-bal").text(unpaidBal);
  $("#personal-luck").text(personalLuck);
  $("#avg-personal-luck").text(avgPersonalLuck);
  $("#last-block-time").text(formatTime(lastBlockTimeUnix));
  $("#overall-profit").text(totalOverallProfit);
}

function updateInfo() {
  updateTokenIds(mainCurrency);
  updateTHS(100, 100);
  updateStats(100, 100, 100, 100, 100, 1664854642, 100);
  euTableLoop(euTable);
  usTableLoop(usTable);
  tableAnimation();
}

function formatTime(unix) {
  var date = new Date(unix * 1000);

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var secends = date.getSeconds();

  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  secends = secends < 10 ? "0" + secends : secends;
  var strTime = hours + ":" + minutes + ":" + secends + " " + ampm;

  return strTime;
}

function tableAnimation() {
  gsap.from(".table-item", {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.1,
    ease: "power4.out"
  });
}

$(document).delegate(".token-link", "click", function () {
  if ($(".token-text").text() != $(this).text()) {
    $(".token-text").text($(this).text());
    /*

        Update usTable and euTable Here

        */
    mainCurrency = $(this).text();
    updateInfo();
    $(".token-dropdown").trigger("w-close");
  } else {
    $(".token-dropdown").trigger("w-close");
  }
});

// On page load
$(document).ready(function () {
  updateCurrencies(currencies);
  updateInfo();
});
