/*
            AstolfoBot
             AGPL-3.0

AstolfoBot reads polls from one chat and
forwards them (with the link to the original
post) in a separated log chat

 */
require('dotenv').config()

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.ASTOLFO_TG_TOKEN)

const Astolfo = require('./astolfo')

const astolfo = new Astolfo(bot, process.env.ASTOLFO_READER_CHAT_ID, process.env.ASTOLFO_LOG_CHAT_ID)

astolfo.run()
