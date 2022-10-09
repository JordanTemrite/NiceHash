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


function generateTable(price, limit, miners, speed, owned, at_limit) {
  if(owned == true) {
    return `<div style="background-color: #004385;" class="table-item"><div class="table-item-block"><p class="table-item-text price">${price}</p></div><div class="table-item-block big"><p class="table-item-text limit">${limit}</p></div><div class="table-item-block small"><p class="table-item-text miners">${miners}</p></div><div class="table-item-block"><p class="table-item-text speed">${speed}</p></div></div>`;
  } else {
    if(at_limit == true) {
      return `<div style="background-color: #710000;" class="table-item"><div class="table-item-block"><p class="table-item-text price">${price}</p></div><div class="table-item-block big"><p class="table-item-text limit">${limit}</p></div><div class="table-item-block small"><p class="table-item-text miners">${miners}</p></div><div class="table-item-block"><p class="table-item-text speed">${speed}</p></div></div>`;
    } else {
      return `<div class="table-item"><div class="table-item-block"><p class="table-item-text price">${price}</p></div><div class="table-item-block big"><p class="table-item-text limit">${limit}</p></div><div class="table-item-block small"><p class="table-item-text miners">${miners}</p></div><div class="table-item-block"><p class="table-item-text speed">${speed}</p></div></div>`;
    }
  }
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

function euTableLoop(table, owned_ids, eu_th) {
  $("#eu-table-wrapper").empty();
  var total_impact = 0.00;
  let at_limit = false;
  table.forEach(function (item) {
    let owned = false;
    let speed_impact;
    for(i = 0; i < owned_ids.length; i++) {
      if(item.id == owned_ids[i]) {
        owned = true
      }
    }
    let addition = 0;
    if(item.limit == 0) {
      addition = 100;
    } else {
      addition = (item.limit / eu_th * 100);
    }
    total_impact = total_impact + addition;
    if(total_impact > 100) {
      at_limit = true;
      if(item.limit == 0) {
        speed_impact = "∞|∞|∞" + "  100%";
      } else {
        speed_impact = parseFloat(item.limit).toFixed(3) + "  100%";
      }
    } else {
      if(item.limit == 0) {
        speed_impact = "∞|∞|∞" + "  " + parseFloat(total_impact).toFixed(2) + "%";
      } else {
        speed_impact = parseFloat(item.limit).toFixed(3) + "  " + parseFloat(total_impact).toFixed(2) + "%";
      }
    }
    if(item.payingSpeed != 0) {
      if(item.limit != 0.00100000) {
        $("#eu-table-wrapper").append(generateTable(item.price, speed_impact, item.rigsCount, item.payingSpeed, owned, at_limit));
      }
    }
  });
}

function usTableLoop(table, owned_ids, us_th) {
  $("#us-table-wrapper").empty();
  var total_impact = 0.00;
  let at_limit = false;
  table.forEach(function (item) {
    let owned = false;
    let speed_impact;
    for(i = 0; i < owned_ids.length; i++) {
      if(item.id == owned_ids[i]) {
        owned = true
      }
    }
    let addition = 0;
    if(item.limit == 0) {
      addition = 100;
    } else {
      addition = (item.limit / us_th * 100);
    }
    total_impact = total_impact + addition;
    if(total_impact > 100) {
      at_limit = true;
      if(item.limit == 0) {
        speed_impact = "∞|∞|∞" + "  100%";
      } else {
        speed_impact = parseFloat(item.limit).toFixed(3) + "  100%";
      }
    } else {
      if(item.limit == 0) {
        speed_impact = "∞|∞|∞" + "  " + parseFloat(total_impact).toFixed(2) + "%";
      } else {
        speed_impact = parseFloat(item.limit).toFixed(3) + "  " + parseFloat(total_impact).toFixed(2) + "%";
      }
    }
    if(item.payingSpeed != 0) {
      if (item.limit != 0.00100000) {
        $("#us-table-wrapper").append(generateTable(item.price, speed_impact, item.rigsCount, item.payingSpeed, owned, at_limit));
      }
    }
  });
}

function updateStats(currentProfitability, unconfirmedBal, unpaidBal, personalLuck, avgPersonalLuck, lastBlockTimeUnix, totalOverallProfit) {
  $("#current-profitability").text(currentProfitability);
  $("#unconfirmed-bal").text(unconfirmedBal);
  $("#unpaid-bal").text(unpaidBal);
  $("#personal-luck").text(personalLuck);
  $("#avg-personal-luck").text(avgPersonalLuck);
  $("#last-block-time").text(lastBlockTimeUnix);
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

  const order_data = await $.ajax({
    url: 'https://nicehash.txidpool.com/api/hash_orders/',
    dataType: "json",
    contentType: "application/json",
  });

  let alive_ids = [];

  for(i = 0; i < order_data.length; i++) {
    if(order_data[i]['hash_order_data']['alive_status'] == true) {
      alive_ids.push(order_data[i]['order_id']);
    }
  }

  const currentProfitability = price_data['strike_price'] + "  /  " + price_data['min_profit_price'];
  const unconfirmedBal = nf.format(mining_data['miner_data']['immature_balance'] / 1e9);
  const unpaidBal = nf.format(mining_data['miner_data']['current_balance_due'] / 1e9);
  const personalLuck = mining_data['miner_data']['current_block_luck'] + " %";
  const luck_last_16 = parseFloat(mining_data['miner_data']['average_last_16']).toFixed(2) + " %";
  const luck_last_32 = parseFloat(mining_data['miner_data']['average_last_32']).toFixed(2) + " %";
  const avgPersonalLuck = parseFloat(mining_data['miner_data']['average_block_luck']).toFixed(2) + " %";

  let blocks = ['#success-0', '#success-1', '#success-2', '#success-3', '#success-4', '#success-5'];
  let block_info = mining_data['miner_data']['block_data'].reverse();

  for(let zed = 0; zed < blocks.length; zed++) {

    let date = new Date(block_info[zed]['timestamp'] * 1000);
    let maturity = '';

    if(block_info[zed]['immature'] == 'True') {
      maturity = 'Immature';
    } else {
      maturity = 'Mature';
    }

    $(blocks[zed]).children('.time-info').text(date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + "  " + formatTime(block_info[zed]['timestamp']));
    $(blocks[zed]).children('.reward-info').text(block_info[zed]['reward'] / 1e9 + " " + maturity);
    $(blocks[zed]).children('.luck-info').text(parseFloat(block_info[zed]['currentLuck']).toFixed(2) + " %");
  }

  updateTokenIds(mainCurrency);
  updateTHS(eu_th, us_th);
  updateStats(currentProfitability, unconfirmedBal, unpaidBal, personalLuck, avgPersonalLuck, luck_last_16, luck_last_32);
  euTableLoop(euTable, alive_ids, eu_th);
  usTableLoop(usTable, alive_ids, us_th);
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
  } , 15000);
});



