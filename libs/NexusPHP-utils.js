/**
 * Project @see https://github.com/ZJUT/NexusPHP
 */

const convert = require('./convert')
const dayjs = require('dayjs')

const defaultStatus = element => ({
  get id         () { return +element.querySelector('.torrentname a').href.match(/(?<=id=)\d+/)[0] },
  get name       () { return element.querySelector('.torrentname a').textContent },
  get isSticky   () { return element.classList.toString().includes('sticky') },
  get isHR       () { return !!element.querySelector('.hitandrun') },
  get isFree     () { return !!element.querySelector('.pro_free') },
  get is50       () { return !!element.querySelector('.pro_50pctdown') },
  get is30       () { return !!element.querySelector('.pro_30pctdown') },
  get is2xfree   () { return !!element.querySelector('.pro_free2up') },
  get is2x       () { return !!element.querySelector('.pro_2up') },
  get is2x50     () { return !!element.querySelector('.pro_50pctdown2up') },
  get isHot      () { return !!element.querySelector('.hot') },
  get date       () { return dayjs(element.children[3].querySelector('[title]').getAttribute('title')) },
  get size       () { return convert(element.children[4].textContent) }, // GB
  get uploader   () { return +element.children[5].textContent },
  get downloader () { return +element.children[6].textContent },
  get isCustom   () { return !!element.querySelector('.pro_custom') },
  customDetail: {
    get upload () {
      const text = element.querySelector('.arrowup ~ b')
      return text ? +text.textContent.slice(0, -1) : 1
    },
    get download () {
      const text = element.querySelector('.arrowdown ~ b')
      return text ? +text.textContent.slice(0, -1) : 1
    }
  }
})

const getTorrents = (filter = status => true, standardize = document => {}, status = defaultStatus) => document => {
  standardize(document)
  const origin = Array.from(document.querySelectorAll('.torrents > tbody > tr:not(:first-child)'))
  if (!origin.length) {
    throw new Error('Can not match torrents.')
  }
  return origin.map(status).filter(filter).map(s => ({
    'id': s.id,
    'name': s.name
  }))
}

module.exports = {
  defaultStatus,
  getTorrents
}
