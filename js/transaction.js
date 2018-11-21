$(document).ready(function () {
  const hash = getQueryStringParam('hash')

  if (!isHash(hash)) {
    return window.location = '/'
  }

  $.ajax({
    url: ExplorerConfig.apiBaseUrl + '/transaction/' + hash,
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function (txn) {
      $('#transactionHeaderHash').text(txn.tx.hash)
      $('#transactionTimestamp').text((new Date(txn.block.timestamp * 1000)).toGMTString())
      $('#transactionFee').text(numeral(txn.tx.fee / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'))
      $('#transactionConfirmations').text(numeral(txn.block.depth).format('0,0'))
      $('#transactionSize').text(numeral(txn.tx.size).format('0,0') + ' bytes')
      $('#transactionRingSize').text(numeral(txn.tx.mixin).format('0,0'))
      $('#transactionAmount').text(numeral(txn.tx.amount_out / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'))
      $('#transactionPaymentId').text(txn.tx.paymentId)
      $('#blockHash').text(txn.block.hash)
      $('#transactionNonce').text(txn.tx.nonce)
      $('#transactionUnlockTime').text(txn.tx.unlock_time)
      $('#transactionPublicKey').text(txn.tx.publicKey)
      $('#inputCount').attr("data-badge", txn.tx.inputs.length)
      $('#outputCount').attr("data-badge", txn.tx.outputs.length)

      const inputs = $('#inputs').DataTable({
        columnDefs: [{
          targets: [0, 1, 2],
          searchable: false
        }],
        order: [
          [0, 'asc'],
          [1, 'asc']
        ],
        searching: false,
        info: false,
        paging: false,
        lengthMenu: -1,
        language: {
          emptyTable: "No Transaction Inputs"
        }
      }).columns.adjust().responsive.recalc()

      for (var i = 0; i < txn.tx.inputs.length; i++) {
        var input = txn.tx.inputs[i]
        inputs.row.add([
          numeral(input.amount / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          (input.keyImage.length === 0) ? 'Coinbase' : input.keyImage,
          input.type.toUpperCase()
        ])
      }
      inputs.draw(false)

      const outputs = $('#outputs').DataTable({
        columnDefs: [{
          targets: [0, 1, 2],
          searchable: false
        }],
        order: [
          [0, 'asc'],
          [1, 'asc']
        ],
        searching: false,
        info: false,
        paging: false,
        lengthMenu: -1,
        language: {
          emptyTable: "No Transaction Outputs"
        }
      }).columns.adjust().responsive.recalc()

      for (var i = 0; i < txn.tx.outputs.length; i++) {
        var output = txn.tx.outputs[i]
        outputs.row.add([
          numeral(output.amount / Math.pow(10, ExplorerConfig.decimalPoints)).format('0,0.00'),
          output.key,
          output.type.toUpperCase()
        ])
      }
      outputs.draw(false)
    },
    error: function () {
      window.location = '/'
    }
  })
})