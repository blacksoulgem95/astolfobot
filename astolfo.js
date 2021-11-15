class Astolfo {
  bot
  readerChatId
  logChatId

  constructor(bot, readerChatId, logChatId) {
    this.bot = bot
    this.readerChatId = readerChatId
    this.logChatId = logChatId
    this.quotes = require('./quotes.json')
  }

  run() {
    console.log(new Date().toISOString(), 'INFO', 'Starting bot')
    this.bot.on('poll', this.onPoll.bind(this))
    this.bot.start(this.isCorrectChat.bind(this))
    this.bot.command('quote', this.quote.bind(this))
    this.bot.command('chat_id', this.chatId.bind(this))
    this.bot.launch()
    // Enable graceful stop
    process.once('SIGINT', () => this.stop('SIGINT'))
    process.once('SIGTERM', () => this.stop('SIGTERM'))
  }

  async isCorrectChat(ctx) {
    console.log('start', ctx.chat.id, this.readerChatId, this.logChatId)
    if (Number(ctx.chat.id) === Number(this.readerChatId) || Number(ctx.chat.id) === Number(this.logChatId)) {
      await ctx.reply('Astolfo Activated')
    } else {
      try {
        await ctx.reply('Not enabled for this chat')
        await ctx.reply('Non sono abilitato per questa chat')
      } finally {
        ctx.leaveChat()
      }
    }
  }

  async onPoll(ctx) {
    try {
      console.log('message from', ctx.chat, this.readerChatId, Number(ctx.chat.id) === Number(this.readerChatId))
      if (Number(ctx.chat.id) === Number(this.readerChatId)) {
        console.log('forwarding')
        await ctx.telegram.forwardMessage(this.logChatId, ctx.chat.id, ctx.message.message_id)
        console.log('forwarded')
        await ctx.telegram.sendMessage(this.logChatId, `https://t.me/c/${ctx.chat.id}/${ctx.message.message_id}`)
        console.log(new Date().toISOString(), 'INFO', 'Forwarded poll', ctx.message.message_id)
      }
    } catch (e) {
      console.error(new Date().toISOString(), 'ERROR', 'Cannot forward poll', ctx.message.message_id)
    }
  }

  async quote(ctx) {
    let id = Math.floor(Math.random() * this.quotes.length)
    ctx.reply(this.quotes[id])
  }

  async chatId(ctx) {
    ctx.reply(ctx.chat.id)
  }

  stop(SIG) {
    console.log(new Date().toISOString(), 'INFO', 'Stopping bot for SIG', SIG)
    this.bot.stop(SIG)
  }
}

module.exports = Astolfo
