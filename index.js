const EventEmitter = require('events');
const API = require('./lib/restful')
const WS = require('./lib/ws')
const Decimal = require('decimal.js')

class Client extends EventEmitter {
  constructor(opts = {}) {
    super()
    this.key = opts.key
    this.api = new API(this)
    if (!opts.disableWS) {
      this.ws = new WS(this)
    }
    this.cache = {}
  }
  getTicker(pair) {
    return this.api.getTicker(pair)
  }
  getCandles(pair, start, end, timeframe) {
    return this.api.getCandles(pair, start, end, timeframe)
  }
  listOrders() {
    return this.api.listOrders()
  }
  listTradingPairs() {
    if (this.cache.tradingPairs) {
      return Promise.resolve(this.cache.tradingPairs)
    }
    return (
      this.api.listTradingPairs()
      .then((pairs) => this.cache.tradingPairs = pairs)
    )
  }
  listCurrencies() {
    if (this.cache.currencies) {
      return Promise.resolve(this.cache.currencies)
    }
    return (
      this.api.listCurrencies()
      .then((currencies) => this.cache.currencies = currencies)
    )
  }
  listOrderbookPrecisions(pair) {
    let cachedPair
    if (this.cache.tradingPairs) {
      cachedPair = this.cache.tradingPairs.find((t) => t.id === pair)
    }
    if (cachedPair && cachedPair.precisions) {
      return cachedPair.precisions
    }
    return (
      this.api.listOrderbookPrecisions(pair)
      .then((precisions) => {
        if (cachedPair) {
          cachedPair.precisions = precisions
        }
        return precisions
      })
    )
  }
  listFundingbookPrecisions(currency) {
    let cachedCurrency
    if (this.cache.currencies) {
      cachedCurrency = this.cache.currencies.find((c) => c.id === currency)
    }
    if (cachedCurrency && cachedCurrency.precisions) {
      return cachedCurrency.precisions
    }
    return (
      this.api.listFundingbookPrecisions(currency)
      .then((precisions) => {
        if (cachedCurrency) {
          cachedCurrency.precisions = precisions
        }
        return precisions
      })
    )
  }
  placeLimitOrder(pair, side, price, size, source) {
    return this.api.placeLimitOrder(pair, side, price, size, source)
  }
  placeMarketOrder(pair, side, size, source) {
    return this.api.placeMarketOrder(pair, side, size, source)
  }
  placeLimitStopOrder(pair, side, price, size, stopPrice) {
    return this.api.placeLimitStopOrder(pair, side, price, size, stopPrice)
  }
  placeMarketStopOrder(pair, side, size, stopPrice) {
    return this.api.placeMarketStopOrder(pair, side, size, stopPrice)
  }
  cancelOrder(id) {
    return this.api.cancelOrder(id)
  }
  getOrder(id) {
    return this.api.getOrder(id)
  }
  modifyOrder(id, pair, price, size) {
    return this.api.modifyOrder(id, pair, price, size)
  }
  listPositions() {
    return this.api.listPositions()
  }
  getPosition(pair) {
    return this.api.getPosition(pair)
  }
  closePosition(pair) {
    return this.api.closePosition(pair)
  }
  claimPosition(pair, size) {
    return this.api.claimPosition(pair, size)
  }
  getBalance() {
    return this.api.getBalance()
  }
  transferBalance(currency, from, to, amount) {
    return this.api.transferBalance(currency, from, to, amount)
  }
  getOrderbook(pair, precision, limit = 0) {
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.api.getOrderbook(pair, precision, limit)
  }
  getTradesHistory(pair, limit = 50, page = 0) {
    return this.api.getTradesHistory(pair, limit, page)
  }
  getTradesOfOrder(id) {
    return this.api.getTradesOfOrder(id)
  }
  listTrades(pair) {
    return this.api.listTrades(pair)
  }
  getFundingbook(currency, precision, limit = 0) {
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.api.getFundingbook(currency, precision, limit)
  }
  getLoanTicker(currency) {
    return this.api.getLoanTicker(currency)
  }
  listFundings() {
    return this.api.listFundings()
  }
  getFunding(id) {
    return this.api.getFunding(id)
  }
  placeLimitFunding(currency, side, interestRate, period, size) {
    return this.api.placeLimitFunding(currency, side, interestRate, period, size)
  }
  cancelFunding(id) {
    return this.api.cancelFunding(id)
  }
  listLoans() {
    return this.api.listLoans()
  }
  getLoan(id) {
    return this.api.getLoan(id)
  }
  closeLoan(id) {
    return this.api.closeLoan(id)
  }
  subscribeOrder(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeOrder({}, fn)
  }
  unsubscribeOrder(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeOrder({}, fn)
  }
  subscribeTicker(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribeTicker(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeTicker({
      trading_pair_id: pair
    }, fn)
  }
  subscribeCandle(pair, timeframe, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  unsubscribeCandle(pair, timeframe, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeCandle({
      trading_pair_id: pair,
      timeframe: timeframe,
    }, fn)
  }
  subscribePublicTrade(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribePublicTrade({
      trading_pair_id: pair
    }, fn)
  }
  unsubscribePublicTrade(pair, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribePublicTrade({
      trading_pair_id: pair
    }, fn)
  }
  subscribeOrderbook(pair, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.subscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  unsubscribeOrderbook(pair, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.unsubscribeOrderbook({
      trading_pair_id: pair,
      precision: precision
    }, fn)
  }
  subscribeFundingbook(currency, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.subscribeFundingbook({
      currency_id: currency,
      precision: precision
    }, fn)
  }
  unsubscribeFundingbook(currency, precision, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    if (precision instanceof Decimal) {
      precision = precision.toExponential().toUpperCase()
    }
    return this.ws.unsubscribeFundingbook({
      currency_id: currency,
      precision: precision
    }, fn)
  }
  subscribeLoanTicker(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeLoanTicker({
      currency_id: currency
    }, fn)
  }
  unsubscribeLoanTicker(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeTicker({
      currency_id: currency
    }, fn)
  }
  subscribePublicLoan(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribePublicLoan({
      currency_id: currency
    }, fn)
  }
  unsubscribePublicLoan(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribePublicLoan({
      currency_id: currency
    }, fn)
  }
  subscribeAuthLoan(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeAuthLoan({
      currency_id: currency
    }, fn)
  }
  unsubscribeAuthLoan(currency, fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeAuthLoan({
      currency_id: currency
    }, fn)
  }
  subscribeFunding(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.subscribeFunding({}, fn)
  }
  unsubscribeFunding(fn) {
    if (!this.ws) {
      return Promise.reject('no ws')
    }
    return this.ws.unsubscribeFunding({}, fn)
  }
  close() {
    if (!this.ws) {
      return
    }
    this.ws.close()
  }
}

module.exports = Client
