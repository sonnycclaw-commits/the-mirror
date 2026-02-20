/**
 * The Mirror — Mission Control Updater
 * Runs periodically, pushes project status to Mission Control Convex
 */
import { execSync } from 'child_process'

const PROJECT_ID = 'jd77kc0vapx98qbb4rjt03xy3981hjq4'
const MC_DIR = '/home/ubuntu/projects/mission-control'

function convex(fn, args) {
  const cmd = `cd ${MC_DIR} && npx convex run ${fn} '${JSON.stringify(args)}' 2>/dev/null`
  try {
    return JSON.parse(execSync(cmd, { timeout: 15000 }).toString().trim())
  } catch (e) {
    return null
  }
}

async function run() {
  const now = new Date().toISOString()
  const day = Math.floor((Date.now() - new Date('2026-02-20').getTime()) / 86400000) + 1

  // Create daily status task
  convex('tasks:create', {
    title: `Day ${day}: Mirror session`,
    projectId: PROJECT_ID,
    priority: 'p1',
    description: `14-day contract. Day ${day}. Contract start: 2026-02-20. Status updated at ${now}.\n\nActive servers:\n- mirror.js (port 3003) — 5-scene loop + mirror moment\n- hook.js (port 3002) — single scene hook\n- game-server-v2.js (port 3001) — full v2\n\nEdge: longitudinal accumulation across sessions. Free tier = session 1. Paid = session 2-3 delta.`
  })

  console.log(`Mission Control updated — Day ${day}`)
}

run()
