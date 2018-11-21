$(document).ready(function () {
  const hash = getQueryStringParam('hash')

  if (!isHash(hash)) {
    return window.location = '/'
  }

  $.ajax({
    url: ExplorerConfig.apiBaseUrl + '/block/' + hash,
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function (block) {
      $('#blockHeaderHash').text(block.hash)
      $('#blockHeight').text(numeral(block.height).format('0,0'))
      $('#blockDepth').text(numeral(block.depth).format('0,0'))
      $('#blockTimestamp').text((new Date(block.timestamp * 1000)).toGMTString())
      $('#blockVersion').text(block.majorVersion + '.' + block.minorVersion)
      $('#blockDifficulty').text(numeral(block.difficulty).format('0,0'))
      $('#blockSize').text(numeral(block.size).format('0,0') + ' bytes')
      $('#blockBaseReward').text(numeral(block.baseReward / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)
      $('#blockReward').text(numeral(block.reward / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)
      $('#blockTransactionSize').text(numeral(block.transactionsCumulativeSize).format('0,0') + ' bytes')
      $('#blockTransactionFees').text(numeral(block.totalFeeAmount / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00') + ' ' + ExplorerConfig.ticker)
      $('#transactionCount').attr("data-badge", block.transactions.length)

      const transactions = $('#transactions').DataTable({
        columnDefs: [{
          targets: [0, 1, 2, 3],
          searchable: false
        }, {
          targets: 0,
          render: function (data, type, row, meta) {
            if (type === 'display') {
              data = '<a href="/transaction?hash=' + data + '">' + data + '</a>'
            }
            return data
          }
        }],
        order: [
          [1, 'asc'],
          [2, 'asc']
        ],
        searching: false,
        info: false,
        paging: false,
        lengthMenu: -1,
        language: {
          emptyTable: "No Transactions In This Block"
        }
      }).columns.adjust().responsive.recalc()

      for (var i = 0; i < block.transactions.length; i++) {
        var txn = block.transactions[i]
        transactions.row.add([
          txn.hash,
          numeral(txn.fee / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          numeral(txn.amount_out / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          numeral(txn.size).format('0,0')
        ])
      }
      transactions.draw(false)
    },
    error: function () {
      window.location = '/'
    }
  })
})