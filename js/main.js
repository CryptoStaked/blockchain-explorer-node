var recentBlocks, topBlockHeight, blockchainChart, blockchainChartData, blockchainChartOptions

$(window).resize(function () {
  if (typeof blockchainChart !== 'undefined') {
    drawBlockchainChart()
  }
})

$(document).ready(function () {
  google.charts.load('current', {
    packages: ['corechart']
  })

  blockchainChartOptions = {
    legend: {
      position: 'bottom'
    },
    vAxis: {
      scaleType: 'log',
      textPosition: 'none',
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      }
    },
    hAxis: {
      textPosition: 'none',
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      }
    },
    chartArea: {
      height: '75%',
      width: '100%',
    },
    colors: ['#40c18e', '#8e7cc3', '#00853d', '#f6b26b', '#212721', '#fac5c3', '#6d9eeb', '#45818e', '#de5f5f']
  }

  const transactionPool = $('#transactionPool').DataTable({
    columnDefs: [{
      targets: [0, 1, 2, 3],
      searchable: false
    }],
    order: [
      [1, 'desc'],
      [2, 'desc'],
      [0, 'asc']
    ],
    searching: false,
    info: false,
    paging: false,
    lengthMenu: -1,
    language: {
      emptyTable: "No Transactions Currently in the Mempool"
    }
  }).columns.adjust().responsive.recalc()

  recentBlocks = $('#recentBlocks').DataTable({
    columnDefs: [{
      targets: 2,
      render: function (data, type, row, meta) {
        if (type === 'display') {
          data = '<a href="/block.html?hash=' + data + '">' + data + '</a>'
        }
        return data
      }
    }],
    order: [
      [0, 'desc']
    ],
    searching: false,
    info: false,
    paging: false,
    lengthMenu: -1,
    language: {
      emptyTable: "No recent blocks found"
    }
  }).columns.adjust().responsive.recalc()

  getAndDisplayLastBlockHeader()

  function setLastBlockTimer() {
    setTimeout(function () {
      getAndDisplayLastBlockHeader()
      setLastBlockTimer()
    }, 5000)
  }
  setLastBlockTimer()

  updateTransactionPool(transactionPool)

  function setTransactionPoolTimer() {
    setTimeout(function () {
      updateTransactionPool(transactionPool)
      setTransactionPoolTimer()
    }, 5000)
  }
  setTransactionPoolTimer()
})

function getAndDisplayLastBlockHeader() {
  $.ajax({
    url: ExplorerConfig.apiBaseUrl + '/block/header/top?random=' + (new Date()).getTime(),
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function (data) {
      if (data.height !== topBlockHeight) {
        topBlockHeight = data.height
        updateRecentBlocks(recentBlocks, topBlockHeight)
      }
      $('#blockchainHeight').text(numeral(data.height).format('0,0'))
      $('#blockchainDifficulty').text(numeral(data.difficulty).format('0,0'))
      $('#blockchainHashRate').text(numeral(data.difficulty / ExplorerConfig.blockTargetTime).format('0,0') + ' H/s')
      $('#blockchainReward').text(numeral(data.reward / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)
      $('#blockchainTransactions').text(numeral(data.alreadyGeneratedTransactions).format('0,0'))
      $('#blockchainCirculatingSupply').text(numeral(data.alreadyGeneratedCoins / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)
      $('#blockchainTotalSupply').text(numeral(ExplorerConfig.maxSupply / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)

      const maxSupply = ExplorerConfig.maxSupply
      const curSupply = data.alreadyGeneratedCoins
      const emiss = (curSupply / maxSupply) * 100

      $('#blockchainSupplyEmission').text(numeral(emiss).format('0.000000') + ' %')
    }
  })
}

function updateTransactionPool(table) {
  $.ajax({
    url: ExplorerConfig.apiBaseUrl + '/transaction/pool?random=' + (new Date()).getTime(),
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function (data) {
      $("#transactionPoolCount").attr("data-badge", data.length)
      table.clear()
      for (var i = 0; i < data.length; i++) {
        var txn = data[i]
        table.row.add([
          numeral(txn.amount / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          numeral(txn.fee / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          numeral(txn.size).format('0,0'),
          txn.txnHash
        ])
      }
      table.draw(false)
    }
  })
}

function updateRecentBlocks(table, height) {
  $.ajax({
    url: ExplorerConfig.apiBaseUrl + '/block/headers/' + height + '?random=' + (new Date()).getTime(),
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function (data) {
      table.clear()

      var chartData = [
        ['Block Time', 'Difficulty', 'Block Size', 'Txn Count']
      ]

      for (var i = 0; i < data.length; i++) {
        var block = data[i]
        chartData.push(
          [block.timestamp, block.difficulty, block.size, block.tx_count]
        )
        table.row.add([
          numeral(block.height).format('0,0'),
          numeral(block.size).format('0,0'),
          block.hash,
          numeral(block.difficulty).format('0,0'),
          numeral(block.tx_count).format('0,0'),
          (new Date(block.timestamp * 1000)).toGMTString()
        ])
      }

      blockchainChartData = google.visualization.arrayToDataTable(chartData)
      table.draw(false)
      drawBlockchainChart()
    }
  })
}

function drawBlockchainChart() {
  blockchainChart = new google.visualization.AreaChart(document.getElementById('blockchainChart'))
  blockchainChart.draw(blockchainChartData, blockchainChartOptions)
}