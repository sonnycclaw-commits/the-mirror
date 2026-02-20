/**
 * The Mirror — Core Loop
 * Hook → Accumulation → Mirror Moment
 */
import http from 'http'

const KEY = process.env.OPENROUTER_API_KEY || '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'

async function ai(prompt, max = 250) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen/qwen3.5-plus-02-15', messages: [{ role: 'user', content: prompt }], max_tokens: max })
  })
  return (await r.json()).choices[0].message.content.trim()
}

// Five scenes. Each one a different pressure.
const SCENES = [
  {
    id: 'course',
    text: "Something woke you.\n\nNot an alarm. Not the crew. Something else.\n\nThe ship is running. Everyone is asleep. On the navigation display, a course correction was logged 4 hours ago — destination updated, reason field blank.\n\nYou didn't set it.\n\nYou feel like you should tell someone.",
    choices: [
      "Wake the first officer. Now.",
      "Check the logs yourself first.",
      "Correct the course quietly. Say nothing.",
      "Do nothing. Watch. See if anyone else notices."
    ]
  },
  {
    id: 'record',
    text: "The logs go back further than they should.\n\nYou find an entry from before you took command. Someone flagged a system anomaly and then deleted the flag. The anomaly is still there.\n\nThey left you flying blind.\n\nYour name is now in the system as responsible for this vessel.",
    choices: [
      "Document what you found. File a formal report.",
      "Fix the anomaly. Don't mention the deleted flag.",
      "Find out who deleted it before you do anything else.",
      "Leave it. It's been fine this long."
    ]
  },
  {
    id: 'crew',
    text: "A crew member comes to you.\n\nThey made a mistake. A real one — not catastrophic, but the kind that could have been. They didn't have to tell you. No one would have known.\n\nThey're telling you anyway.",
    choices: [
      "Acknowledge it. Log it formally as required.",
      "Tell them you appreciate it. Handle it off the record.",
      "Ask why they're telling you — what do they want from this?",
      "Note that it won't happen again and move on quickly."
    ]
  },
  {
    id: 'signal',
    text: "An emergency signal arrives from a ship you know.\n\nYou served on it. Some of those people are still there.\n\nYour ETA is 6 hours. Protocol says you report the signal up the chain and wait for orders. By the time orders come, it'll be 10 hours.\n\nYou are the closest vessel.",
    choices: [
      "Alter course immediately. Report and respond.",
      "Report up the chain and follow protocol.",
      "Report it and recommend they authorize your response.",
      "Confirm the signal is real before committing to anything."
    ]
  },
  {
    id: 'mirror',
    text: "You've reached the coordinates.\n\nThere's nothing here. No station, no debris, no signal. Just the original course someone else plotted for you before you were even awake.\n\nYou could go back.\n\nOr you could stay. Long enough to understand why someone sent you here.",
    choices: [
      "Set return course. Report the coordinates as a dead end.",
      "Stay. Run full scans. Document everything.",
      "Transmit your position and wait for contact.",
      "Push further in. The answer isn't at the edge."
    ]
  }
]

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Mirror</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: #050810;
  color: #c8d0dc;
  font-family: Georgia, serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.container { max-width: 640px; width: 100%; }

.header {
  color: #1a2030;
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 3.5rem;
}

.scene {
  font-size: 1.0625rem;
  line-height: 2;
  color: #9aa5b4;
  margin-bottom: 2.5rem;
  white-space: pre-line;
  min-height: 40px;
}
.scene.typing::after {
  content: '▊';
  animation: blink 0.9s step-start infinite;
  color: #d4a843;
  font-size: 0.9em;
}
@keyframes blink { 50% { opacity: 0; } }

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 2rem;
}
.choice {
  background: transparent;
  border: 1px solid #131b28;
  color: #546070;
  padding: 0.9375rem 1.25rem;
  text-align: left;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  gap: 1rem;
  align-items: baseline;
  line-height: 1.5;
}
.choice:hover { border-color: rgba(212,168,67,0.4); color: #c8b060; }
.choice .n { color: #d4a843; min-width: 14px; font-weight: bold; }
.choice.selected { border-color: #d4a843; color: #d4a843; background: rgba(212,168,67,0.03); }
.choice.dim { opacity: 0.25; pointer-events: none; }

.log-entry {
  border-left: 2px solid #d97706;
  padding: 1rem 1.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.7875rem;
  line-height: 1.75;
  color: #b8942a;
  background: rgba(217,119,6,0.04);
  margin-bottom: 2rem;
  opacity: 0;
  transition: opacity 0.5s;
}
.log-entry.show { opacity: 1; }

.progress {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 3rem;
}
.pip {
  width: 24px;
  height: 2px;
  background: #131b28;
  transition: background 0.4s;
}
.pip.done { background: #d4a843; }
.pip.active { background: rgba(212,168,67,0.4); }

.next-btn {
  background: transparent;
  border: 1px solid #1e2d40;
  color: #546070;
  padding: 0.875rem 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  cursor: pointer;
  letter-spacing: 0.08em;
  transition: all 0.2s;
  width: 100%;
  display: none;
}
.next-btn:hover { border-color: #d4a843; color: #d4a843; }

/* Mirror moment */
.mirror-wrap {
  display: none;
}
.mirror-label {
  color: #1a2030;
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  margin-bottom: 2rem;
}
.mirror-text {
  font-size: 1.125rem;
  line-height: 2;
  color: #9aa5b4;
  margin-bottom: 3rem;
  white-space: pre-line;
  min-height: 40px;
}
.mirror-text.typing::after {
  content: '▊';
  animation: blink 0.9s step-start infinite;
  color: #d4a843;
}
.mirror-close {
  color: #2a3545;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  text-align: center;
  margin-top: 3rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: color 0.2s;
}
.mirror-close:hover { color: #546070; }
</style>
</head>
<body>
<div class="container">
  <div class="header">THE MIRROR</div>
  
  <!-- Game phase -->
  <div id="game-phase">
    <div class="progress" id="progress"></div>
    <div id="scene" class="scene"></div>
    <div id="choices" class="choices"></div>
    <div id="log" class="log-entry"></div>
    <button id="next-btn" class="next-btn">CONTINUE →</button>
  </div>

  <!-- Mirror moment -->
  <div id="mirror-phase" class="mirror-wrap">
    <div class="mirror-label">THE MIRROR</div>
    <div id="mirror-text" class="mirror-text"></div>
    <div class="mirror-close" id="mirror-close">— end of session —</div>
  </div>
</div>

<script>
const SCENES = ${JSON.stringify(SCENES)}
let state = {
  scene: 0,
  choices: [],
  logs: [],
  phase: 'idle'
}

function updateProgress() {
  const el = document.getElementById('progress')
  el.innerHTML = ''
  SCENES.forEach((_, i) => {
    const pip = document.createElement('div')
    pip.className = 'pip' + (i < state.scene ? ' done' : i === state.scene ? ' active' : '')
    el.appendChild(pip)
  })
}

function typeText(el, text, speed, done) {
  el.classList.add('typing')
  let i = 0
  const raw = text.split('')
  function tick() {
    if (i >= raw.length) {
      el.classList.remove('typing')
      if (done) setTimeout(done, 200)
      return
    }
    el.textContent += raw[i]
    i++
    const delay = raw[i-1] === '\\n' ? (raw[i] === '\\n' ? 200 : 120) : speed
    setTimeout(tick, delay)
  }
  tick()
}

function renderScene() {
  const s = SCENES[state.scene]
  updateProgress()
  
  const sceneEl = document.getElementById('scene')
  const choicesEl = document.getElementById('choices')
  const logEl = document.getElementById('log')
  const nextBtn = document.getElementById('next-btn')
  
  sceneEl.textContent = ''
  choicesEl.innerHTML = ''
  logEl.className = 'log-entry'
  logEl.textContent = ''
  nextBtn.style.display = 'none'
  
  state.phase = 'typing'
  
  typeText(sceneEl, s.text, 16, () => {
    state.phase = 'choosing'
    s.choices.forEach((c, i) => {
      const btn = document.createElement('button')
      btn.className = 'choice'
      btn.innerHTML = '<span class="n">' + (i+1) + '</span><span>' + c + '</span>'
      btn.onclick = () => choose(i, c, btn)
      choicesEl.appendChild(btn)
    })
  })
}

async function choose(idx, text, btn) {
  if (state.phase !== 'choosing') return
  state.phase = 'waiting'
  
  // Visual
  document.querySelectorAll('.choice').forEach((b, i) => {
    if (i !== idx) b.classList.add('dim')
    else b.classList.add('selected')
  })
  
  state.choices.push({ scene: SCENES[state.scene].id, choice: text })
  
  // Get log
  const logEl = document.getElementById('log')
  logEl.textContent = 'SHIP LOG — Recording...'
  logEl.className = 'log-entry show'
  
  try {
    const res = await fetch('/read', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ scene: SCENES[state.scene].id, choice: text, choiceNumber: state.choices.length })
    })
    const d = await res.json()
    logEl.textContent = d.log
    state.logs.push(d.log)
  } catch(e) {
    logEl.textContent = 'SHIP LOG — Entry recorded.'
  }
  
  const isLast = state.scene >= SCENES.length - 1
  const nextBtn = document.getElementById('next-btn')
  nextBtn.textContent = isLast ? 'SEE WHAT THE MIRROR SEES →' : 'CONTINUE →'
  nextBtn.style.display = 'block'
  nextBtn.style.borderColor = isLast ? '#d4a843' : ''
  nextBtn.style.color = isLast ? '#d4a843' : ''
  
  state.phase = 'done'
}

document.getElementById('next-btn').onclick = async () => {
  state.scene++
  if (state.scene >= SCENES.length) {
    showMirror()
  } else {
    renderScene()
  }
}

async function showMirror() {
  document.getElementById('game-phase').style.display = 'none'
  const mirrorPhase = document.getElementById('mirror-phase')
  mirrorPhase.style.display = 'block'
  
  const mirrorEl = document.getElementById('mirror-text')
  mirrorEl.textContent = ''
  
  // Fetch the mirror
  try {
    const res = await fetch('/mirror', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ choices: state.choices })
    })
    const d = await res.json()
    
    // Short pause before the mirror speaks
    await new Promise(r => setTimeout(r, 1200))
    typeText(mirrorEl, d.reflection, 22)
  } catch(e) {
    mirrorEl.textContent = 'Something is still loading. Try again in a moment.'
  }
}

document.getElementById('mirror-close').onclick = () => {
  document.querySelector('.container').innerHTML = '<div style="text-align:center;padding:4rem 0;color:#1a2030;font-family:Courier New,monospace;font-size:0.75rem;letter-spacing:0.15em">END OF SESSION</div>'
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (state.phase !== 'choosing') return
  const n = parseInt(e.key)
  if (n >= 1 && n <= 4) {
    const btns = document.querySelectorAll('.choice')
    if (btns[n-1]) btns[n-1].click()
  }
})

// Start
renderScene()
</script>
</body>
</html>`

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  
  const body = () => new Promise(r => {
    let d = ''
    req.on('data', c => d += c)
    req.on('end', () => r(JSON.parse(d)))
  })

  if ((req.url === '/' || req.url === '/play') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(HTML)
    return
  }

  // Single choice log
  if (req.url === '/read' && req.method === 'POST') {
    const { scene, choice, choiceNumber } = await body()
    try {
      const log = await ai(
        `You are a Ship's Log. One crew member just made a choice.

Choice ${choiceNumber}: "${choice}"

Write ONE log entry that names what this choice reveals about the person making it — not the situation. Be uncomfortably specific. 2 sentences. Start with "SHIP LOG —". No moralizing.`, 
        150
      )
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ log }))
    } catch(e) {
      res.writeHead(500)
      res.end(JSON.stringify({ log: 'SHIP LOG — Entry recorded.' }))
    }
    return
  }

  // Mirror moment — the whole point
  if (req.url === '/mirror' && req.method === 'POST') {
    const { choices } = await body()
    
    const choiceList = choices.map((c, i) => `${i+1}. ${c.choice}`).join('\n')
    
    try {
      const reflection = await ai(
        `You have observed someone make five choices in five different situations. Now you speak directly to them.

Their choices:
${choiceList}

Write a reflection that:
- Speaks directly ("You", not "the subject")
- Names the pattern across all five choices — not each choice separately
- Says something they haven't said about themselves, but that the choices confirm
- Is specific, not general
- Does NOT start with "You are"
- Does NOT moralize or advise
- Is 4-6 sentences
- Reads like someone who has been watching closely and finally speaks

This is the moment the mirror shows them something real. Make it land.`,
        400
      )
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ reflection }))
    } catch(e) {
      res.writeHead(500)
      res.end(JSON.stringify({ reflection: 'The mirror is still forming.' }))
    }
    return
  }

  res.writeHead(404); res.end()
})

server.listen(3003, () => console.log('Mirror at http://localhost:3003'))
