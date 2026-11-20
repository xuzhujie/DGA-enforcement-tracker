import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const monitorWorkflow = readFileSync(new URL('../.github/workflows/monitor.yml', import.meta.url), 'utf8')

test('monitor can commit feed changes and request a Pages deployment', () => {
  assert.match(monitorWorkflow, /contents: write/)
  assert.match(monitorWorkflow, /actions: write/)
  assert.match(monitorWorkflow, /gh workflow run deploy\.yml --ref main/)
  assert.match(monitorWorkflow, /if: steps\.monitor\.outputs\.changed == 'true'/)
})
