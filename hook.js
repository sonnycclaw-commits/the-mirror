/**
 * The Mirror — Hook Prototype
 * One scene. One exchange. Does it land?
 */
import http from 'http'

const KEY = process.env.OPENROUTER_API_KEY || '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'

async function ai(prompt, max = 200) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen/qwen3.5-plus-02-15', messages: [{ role: 'user', content: prompt }], max_tokens: max })
  })
  return (await r.json()).choices[0].message.content.trim()
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Mirror</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
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
.container {
  max-width: 620px;
  width: 100%;
}
.scene {
  font-size: 1.125rem;
  line-height: 1.9;
  color: #b8c4d0;
  margin-bottom: 2.5rem;
  min-height: 60px;
}
.scene.typing::after {
  content: '▊';
  animation: blink 1s step-start infinite;
  color: #d4a843;
}
@keyframes blink { 50% { opacity: 0; } }
.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.opt {
  background: transparent;
  border: 1px solid #1e2535;
  color: #7a8899;
  padding: 1rem 1.25rem;
  text-align: left;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.opt:hover {
  border-color: #d4a843;
  color: #d4a843;
  background: rgba(212,168,67,0.04);
}
.opt .num {
  color: #d4a843;
  font-weight: bold;
  min-width: 16px;
}
.log {
  border-left: 2px solid #d4a843;
  padding: 1rem 1.25rem;
  color: #d4a843;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  background: rgba(212,168,67,0.04);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.6s;
  display: none;
}
.log.show {
  display: block;
}
.log.visible {
  opacity: 1;
  transform: translateY(0);
}
.continue-btn {
  background: transparent;
  border: 1px solid #d4a843;
  color: #d4a843;
  padding: 0.875rem 2rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.2s;
  width: 100%;
  display: none;
}
.continue-btn:hover {
  background: #d4a843;
  color: #050810;
}
.title {
  color: #1e2535;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 3rem;
}
</style>
</head>
<body>
<div class="container">
  <div class="title">THE MIRROR</div>
  <div id="scene" class="scene"></div>
  <div id="options" class="options"></div>
  <div id="log" class="log"></div>
  <button id="continue" class="continue-btn">CONTINUE →</button>
</div>

<script>
const OPENING = "Something woke you.\\n\\nNot an alarm. Not the crew. Something else.\\n\\nThe ship is running. Everyone is asleep. On the navigation display you see a course correction logged 4 hours ago — destination updated, reason field blank.\\n\\nYou didn't set it.\\n\\nYou feel like you should tell someone."

const CHOICES = [
  "Wake the first officer. Now.",
  "Check the logs yourself first.",
  "Correct the course quietly. Say nothing.",
  "Do nothing. Watch. See if anyone else notices."
]

let state = { phase: 'opening', answer: null }

function typeText(el, text, done) {
  el.classList.add('typing')
  const lines = text.split('\\n')
  let li = 0, ci = 0
  let html = ''
  function tick() {
    if (li >= lines.length) {
      el.classList.remove('typing')
      if (done) done()
      return
    }
    const line = lines[li]
    if (ci < line.length) {
      html += line[ci]
      ci++
      el.innerHTML = html.replace(/\\n/g, '<br>')
      setTimeout(tick, 18)
    } else {
      html += '\\n'
      el.innerHTML = html.replace(/\\n/g, '<br>')
      li++; ci = 0
      setTimeout(tick, line.length === 0 ? 120 : 280)
    }
  }
  tick()
}

function showOptions() {
  const el = document.getElementById('options')
  el.innerHTML = ''
  CHOICES.forEach((c, i) => {
    const btn = document.createElement('button')
    btn.className = 'opt'
    btn.innerHTML = '<span class="num">' + (i+1) + '</span><span>' + c + '</span>'
    btn.onclick = () => choose(c, btn)
    el.appendChild(btn)
  })
}

async function choose(answer, btn) {
  if (state.phase !== 'choosing') return
  state.phase = 'waiting'
  state.answer = answer

  document.querySelectorAll('.opt').forEach(b => {
    b.style.opacity = b === btn ? '1' : '0.3'
    b.style.pointerEvents = 'none'
    if (b === btn) {
      b.style.borderColor = '#d4a843'
      b.style.color = '#d4a843'
    }
  })

  const logEl = document.getElementById('log')
  logEl.className = 'log show'
  logEl.textContent = 'SHIP LOG — Reading...'
  setTimeout(() => logEl.classList.add('visible'), 50)

  try {
    const res = await fetch('/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
    const d = await res.json()
    logEl.textContent = d.log
    
    setTimeout(() => {
      document.getElementById('continue').style.display = 'block'
    }, 1200)
  } catch(e) {
    logEl.textContent = 'SHIP LOG — Signal lost.'
  }
  
  state.phase = 'done'
}

document.getElementById('continue').onclick = () => {
  // Signal: they engaged. Go deeper.
  document.querySelector('.container').innerHTML = '<div class="scene" style="text-align:center;padding-top:4rem;color:#34404f;font-family:Courier New,monospace;font-size:0.875rem">This is where it begins.<br><br>The Mirror is watching.</div>'
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const n = parseInt(e.key)
  if (n >= 1 && n <= 4 && state.phase === 'choosing') {
    const btns = document.querySelectorAll('.opt')
    if (btns[n-1]) btns[n-1].click()
  }
})

// Init
typeText(document.getElementById('scene'), OPENING, () => {
  state.phase = 'choosing'
  showOptions()
})
</script>
</body>
</html>`

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.url === '/' || req.url === '/play') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(HTML)
    return
  }

  if (req.url === '/read' && req.method === 'POST') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', async () => {
      const { answer } = JSON.parse(body)
      
      // This is the moment. The Ship's Log needs to see the person, not the choice.
      try {
        const log = await ai(`You are the Ship's Log of a deep space vessel. A crew member just made a choice.

Choice: "${answer}"

Write ONE log entry that:
- Names what this choice reveals about the person — not the situation
- Is specific enough to feel uncomfortably accurate
- Does NOT moralize or judge
- Uses dry, precise naval language
- Is 2 sentences maximum
- Starts with "SHIP LOG —"

The reader should feel: "how did it know that?"`, 150)
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ log }))
      } catch(e) {
        res.writeHead(500)
        res.end(JSON.stringify({ log: 'SHIP LOG — Signal lost.' }))
      }
    })
    return
  }

  res.writeHead(404); res.end()
})

server.listen(3002, () => console.log('Hook at http://localhost:3002'))
