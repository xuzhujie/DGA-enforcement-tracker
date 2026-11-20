import assert from 'node:assert/strict'
import test from 'node:test'
import { getGovernanceCopy, getFollowUpStatusCopy } from '../src/lib/governance-copy'

test('governance copy keeps authority and altruism registers distinct', () => {
  const copy = getGovernanceCopy('zh')

  assert.equal(copy.tab, '治理基础设施')
  assert.equal(copy.authoritiesTitle, '成员国 DGA 主管机关')
  assert.equal(copy.altruismTitle, '已获认可的数据利他组织')
  assert.match(copy.registerNote, /不等于/)
})

test('follow-up status copy never turns missing signals into closure', () => {
  assert.equal(getFollowUpStatusCopy('not_located', 'zh'), '未定位到后续信号')
  assert.equal(getFollowUpStatusCopy('not_located', 'en'), 'No later signal located')
})
