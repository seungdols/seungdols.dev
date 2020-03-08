const fs = require('fs-extra')
const dateFns = require('date-fns')
const log = require('signale')
const cwd = process.cwd()

const CURRENT_YEAR = new Date().getFullYear()
const CONTENTS_DIR = `/content/blog/${CURRENT_YEAR}`
const TARGET_DIR = `${cwd}${CONTENTS_DIR}`
const DATE_WITH_TIMES_FORMAT = 'YYYY-MM-DD HH:MM:SS'
const DATE_FORMAT = 'YYYY-MM-DD'


const getNumberOfLastWeeklyNewsPost = () => {
    return fs.readdirSync(TARGET_DIR, (err, items) => {
            if (err) {
                return console.log(`Unable to scan directory:  ${err}`);
            }
            return items
        })
        .filter(el => el.includes('weekly-news')).map(el => el.split('.').slice(0, -1).join('.')).map(el => (el.split('-').pop())).reduce((previos, current) => previos > current ? previos : current)
}

const getTemplate = (newNumberWeeklyNews) => {
    return `
---
layout: post
title: "그냥 저냥 #위클리뉴스 #${newNumberWeeklyNews}"
description: "그냥 저냥 #위클리뉴스 #${newNumberWeeklyNews}"
date: ${dateFns.format(new Date(), DATE_WITH_TIMES_FORMAT)}
category: weekly-news
tags: [weekly-news, programming]
comments: true
---
  `
}

const createWeeklyNewsPost = (lastNumber) => {

    const newNumberWeeklyNews = Number(lastNumber) + 1
    const fileName = `${dateFns.format(new Date(), DATE_FORMAT)}-weekly-news-${newNumberWeeklyNews}`



    fs.writeFile(`${TARGET_DIR}/${fileName}.markdown`, getTemplate(newNumberWeeklyNews), err => {
        if (err) {
            log.error('Unknown Error: Cannot write file!')
            return
        }

        log.success('Success to create new post!')
    })
}

module.exports = (async function() {
    const lastNumberWeeklyNews = getNumberOfLastWeeklyNewsPost()
    createWeeklyNewsPost(lastNumberWeeklyNews)
})()