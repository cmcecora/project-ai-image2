require('ts-node/register')

const test = require('node:test')
const assert = require('node:assert/strict')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

const { AdSlot } = require('../src/components/ads/AdSlot')

const renderAd = (props) => renderToStaticMarkup(React.createElement(AdSlot, props))

test('AdSlot renders PNG creative without crashing', () => {
  const markup = renderAd({ slot: 'top', src: '/mockimg/ad1horiz.png', alt: 'Mock horizontal ad' })

  assert.ok(markup.includes('mockimg/ad1horiz.png'))
  assert.ok(markup.includes('Advertisement'))
  assert.ok(markup.includes('alt="Mock horizontal ad"'))
})

test('AdSlot renders GIF creative without crashing', () => {
  const markup = renderAd({ slot: 'right', src: '/mockimg/ad2vert.gif', alt: 'Mock vertical ad' })

  assert.ok(markup.includes('mockimg/ad2vert.gif'))
  assert.ok(markup.includes('data-slot="right"'))
})

