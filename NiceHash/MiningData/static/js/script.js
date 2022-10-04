let currencies = ["ETC", "LTC"];
let mainCurrency;

let euTable;

let usTable;


async function get_table_data() {
  const stake_data = await $.ajax({
    url: 'https://nicehash.txidpool.com/api/order_book/' + mainCurrency,
    dataType: "json",
    contentType: "application/json",
  });

  euTable = stake_data['order_book_data']['eu_orders'];
  usTable = stake_data['order_book_data']['us_orders'];

  const eu_speed = parseFloat(stake_data['order_book_data']['eu_speed']).toFixed(5);
  const us_speed = parseFloat(stake_data['order_book_data']['us_speed']).toFixed(5);

  return [eu_speed, us_speed]
}


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
    if(item.limit == 0) {
      item.limit = "∞|∞|∞|∞";
    }
    if(item.payingSpeed != 0) {
      $("#eu-table-wrapper").append(generateTable(item.price, item.limit, item.rigsCount, item.payingSpeed));
    }
  });
}

function usTableLoop(table) {
  $("#us-table-wrapper").empty();
  table.forEach(function (item) {
    if(item.limit == 0) {
      item.limit = "∞|∞|∞|∞";
    }
    if(item.payingSpeed != 0) {
      $("#us-table-wrapper").append(generateTable(item.price, item.limit, item.rigsCount, item.payingSpeed));
    }
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

async function updateInfo(eu_th, us_th) {

  const nf = Intl.NumberFormat();

  const price_data = await $.ajax({
    url: 'https://nicehash.txidpool.com/api/current_profit/' + mainCurrency,
    dataType: "json",
    contentType: "application/json",
  });

  const mining_data = await $.ajax({
    url: 'https://nicehash.txidpool.com/api/mining_data/' + mainCurrency,
    dataType: "json",
    contentType: "application/json",
  });

  const currentProfitability = price_data['strike_price'] + "  /  " + price_data['min_profit_price'];
  const unconfirmedBal = nf.format(mining_data['miner_data']['immature_balance'] / 1e9);
  const unpaidBal = nf.format(mining_data['miner_data']['current_balance_due'] / 1e9);
  const personalLuck = mining_data['miner_data']['current_block_luck'] + " %";
  const lastBlockTimeUnix = mining_data['miner_data']['last_block_found'];

  updateTokenIds(mainCurrency);
  updateTHS(eu_th, us_th);
  updateStats(currentProfitability, unconfirmedBal, unpaidBal, personalLuck, 100, lastBlockTimeUnix, 100);
  euTableLoop(euTable);
  usTableLoop(usTable);
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

$(document).delegate(".token-link", "click", async function () {
  if ($(".token-text").text() != $(this).text()) {
    $(".token-text").text($(this).text());
    /*

        Update usTable and euTable Here

        */
    mainCurrency = $(this).text();
    await updateInfo();
    $(".token-dropdown").trigger("w-close");
  } else {
    $(".token-dropdown").trigger("w-close");
  }
});

// On page load
$(document).ready(async function () {
  updateCurrencies(currencies);
  const speeds = await get_table_data();
  await updateInfo(speeds[0], speeds[1]);

    setInterval(async function () {
    const speeds = await get_table_data();
    await updateInfo(speeds[0], speeds[1]);
  } , 30000);
});
