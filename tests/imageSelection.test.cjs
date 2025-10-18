require('ts-node/register')

const test = require('node:test')
const assert = require('node:assert/strict')

const { selectUnseenImage } = require('../src/lib/imageSelection')
const {
  mapPersistedToGameImage,
  selectPersistedImageExcluding,
} = require('../src/lib/persistedImage')

const aiImage = {
  id: 'ai_1',
  url: 'https://example.com/ai-1',
  isAI: true,
  source: 'Test',
}

const realImage = {
  id: 'real_1',
  url: 'https://example.com/real-1',
  isAI: false,
  source: 'Test',
}

test('selectUnseenImage returns a new image when available', () => {
  const seen = [aiImage.id]
  const pool = [aiImage, realImage]

  const result = selectUnseenImage(seen, pool, () => 0)

  assert.ok(result, 'expected an unseen image to be returned')
  assert.equal(result?.id, realImage.id)
})

test('selectUnseenImage returns null when all images have been seen', () => {
  const seen = [aiImage.id, realImage.id]
  const pool = [aiImage, realImage]

  const result = selectUnseenImage(seen, pool, () => 0)

  assert.equal(result, null)
})

test('selectPersistedImageExcluding skips excluded persisted ids', async () => {
  const candidates = [
    { ...aiImage, id: 'first', url: 'https://example.com/first' },
    { ...realImage, id: 'second', url: 'https://example.com/second' },
  ]

  const persistedIds = {
    'https://example.com/first': 'seen-id',
    'https://example.com/second': 'fresh-id',
  }

  const result = await selectPersistedImageExcluding(
    candidates,
    ['seen-id'],
    async (candidate) => ({
      id: persistedIds[candidate.url],
      url: candidate.url,
      source: candidate.source,
      type: candidate.isAI ? 'ai' : 'real',
      metadata: {
        photographer: 'Test',
        model: candidate.isAI ? 'AI' : undefined,
        credits: 'Unit Test',
      },
    })
  )

  assert.ok(result, 'expected a persisted record to be returned')
  assert.equal(result?.id, 'fresh-id')
})

test('mapPersistedToGameImage converts metadata fields', () => {
  const record = {
    id: 'id-123',
    url: 'https://example.com/photo',
    source: 'Source',
    type: 'ai',
    metadata: {
      photographer: 'Photographer',
      model: 'Model',
      credits: 'Credits',
    },
  }

  const result = mapPersistedToGameImage(record)

  assert.equal(result.id, record.id)
  assert.equal(result.url, record.url)
  assert.equal(result.isAI, true)
  assert.equal(result.photographer, 'Photographer')
  assert.equal(result.model, 'Model')
  assert.equal(result.credits, 'Credits')
})
