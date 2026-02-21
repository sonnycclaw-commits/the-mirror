/**
 * The Mirror — ISV Kestrel
 * Text adventure + psychological extraction engine
 * S1-S3 complete: narrative, cumulative log, branching, mirror + question
 */
import http from 'http'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('OPENROUTER_API_KEY environment variable is required')

const PORT = parseInt(process.env.PORT || '3003', 10)

async function ai(prompt, max = 250) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen/qwen3.5-plus-02-15', messages: [{ role: 'user', content: prompt }], max_tokens: max })
  })
  const j = await r.json()
  return j.choices[0].message.content.trim()
}

// Eight scenes. The ISV Kestrel. A mystery that compounds.
const SCENES = [
  {
    id: 'changed_course',
    name: 'The Changed Course',
    crewFocus: 'none',
    text: "The display glows in the dark of your cabin. 0347. The Kestrel hums beneath you — familiar, steady — but the rhythm is wrong in a way you can't explain, the way a sound you've stopped hearing suddenly returns when it's gone.\n\nNew heading. Filed at 0113. Your authorisation code.\n\nYou didn't do this.\n\nThe corridor outside is quiet. The crew is asleep. Whatever happened, happened while you were dreaming.",
    choices: [
      "Wake Mara. Now. Tell her everything.",
      "Check the navigation logs yourself before you tell anyone.",
      "Correct the course quietly. Restore the original heading. Say nothing until you understand more.",
      "Do nothing yet. Stay in your cabin and watch the ship. See if anything else moves."
    ]
  },
  {
    id: 'dekkers_find',
    name: "Dekker's Find",
    crewFocus: 'dekker',
    text: "Dekker finds you in the corridor before you reach the bridge. He doesn't greet you. He just holds up his datapad and waits for you to read it.\n\nSystem query. 0108. Navigation override protocol accessed from terminal two — the cargo bay console. No name attached. The query ran for eleven minutes and then closed clean.\n\nHe watches your face while you read it. He's already read yours.\n\n\"I haven't told anyone else,\" he says. \"Figured you'd want to know first. Whether that was right—\" He shrugs. \"You're the captain.\"",
    choices: [
      "Thank him. Ask him to keep this between you until you've investigated.",
      "Tell him to document it formally and bring it to the full crew at morning brief.",
      "Ask if he has any idea who might have done this. Work it with him.",
      "Tell him he did the right thing and ask him to watch terminal two without being seen."
    ]
  },
  {
    id: 'yuna_asks',
    name: 'Yuna Asks',
    crewFocus: 'yuna',
    // Branch: if scene 1 choice was 0 (woke Mara), Mara's presence is noted
    text: "Yuna sets down her coffee and slides her nav report across the table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nAround the table: Mara's expression gives nothing away. Dekker is studying the bulkhead. Rhen is watching you.\n\nThe room is waiting for what a captain does with this.",
    textVariant: {
      // If player woke Mara (scene 1, choice 0): Mara already knows
      maraKnows: "Yuna sets down her coffee and slides her nav report across the table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nAround the table: Mara's expression gives nothing away — but you know she's already holding the same information you are. Dekker is studying the bulkhead. Rhen is watching you.\n\nThe room is waiting. Mara is waiting too."
    },
    choices: [
      "Tell the full truth — acknowledge the correction, that you don't know who made it, that you're investigating.",
      "Say you made a minor course adjustment and forgot to log the reason. Routine.",
      "Commend Yuna for flagging it and tell her you'll follow up privately.",
      "Open it to the table — ask if anyone knows anything."
    ]
  },
  {
    id: 'rehns_information',
    name: "Rhen's Information",
    crewFocus: 'rhen',
    text: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"The thing is, Dekker was in his bunk. I checked the roster this morning.\"\n\nHe lets that sit.\n\n\"I don't know what we're carrying in container seven. I know what the manifest says. I know it's been locked since we loaded at Callum Station. And I know that whoever was at that terminal last night — they knew what they were doing.\"",
    textVariant: {
      // If player has been silent (scene 1 choice 2, scene 3 choice 1): Rhen is cooler
      rhenisCool: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"Dekker was in his bunk. I checked.\"\n\nHe looks at you the way someone looks when they've already decided how much to say.\n\n\"Container seven's been locked since Callum Station. Whatever's in it, whoever was at that terminal knew what they were doing. That's what I've got.\" He leaves it there. Doesn't offer more."
    },
    choices: [
      "Open container seven. Now. Whatever's in it, you need to know.",
      "Lock down terminal two, seal container seven, and file an incident report with Callum Station authority.",
      "Ask Rhen to show you the cargo bay security footage before you do anything.",
      "Tell Rhen to say nothing and keep watching. You need more before you move."
    ]
  },
  {
    id: 'container',
    name: "What's In The Container",
    crewFocus: 'mara',
    text: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old. Self-inflicted, or as close to it — the kind of wound that means someone was determined enough to remove their own implant in a cargo bay with improvised tools.\n\nShe looks at you. Not at Rhen, not at Dekker — at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\"",
    textVariant: {
      // If Mara has full information: she steps in first
      maraStepsIn: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old. Self-inflicted.\n\nBefore you can speak, Mara steps past you. She takes the water flask from her belt and holds it out without a word.\n\nThe woman looks at Mara. Then at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\""
    },
    choices: [
      "Give her water and hear her out before you decide anything.",
      "Lock her back in — safely, with supplies — and make the decision with your crew first.",
      "Contact the nearest authority and declare a stowaway. Protocol.",
      "Ask her who's looking for her. Get the information before you commit."
    ]
  },
  {
    id: 'transmission',
    name: 'The Transmission',
    crewFocus: 'yuna',
    text: "The voice on the comms is calm. Institutional. The kind of voice that has done this before and found it works.\n\n\"Captain. This is a routine inquiry. We believe you may have an unauthorised passenger aboard — a woman travelling under the name Sable. We're not here to create problems for the Kestrel or her crew. We're here to resolve a situation quietly.\" A pause. \"We can make this very easy for you.\"\n\nYuna is watching you from her console. Mara has her hand near the comm controls but isn't moving. The voice is still talking — explaining procedures, mentioning numbers, making it sound like paperwork.\n\nThe ship outside isn't a threat. It's an offer.",
    choices: [
      "Cut the transmission. Don't respond.",
      "Respond professionally. Acknowledge receipt. Buy time.",
      "Tell them you have no unauthorised passengers and end the call.",
      "Ask them to identify themselves and their authority. Make them show their credentials."
    ]
  },
  {
    id: 'dekkers_price',
    name: "Dekker's Price",
    crewFocus: 'dekker',
    text: "Dekker's in the engine room, doing maintenance he doesn't need to do. He doesn't look up when you enter.\n\n\"I've been on nine ships,\" he says, to the panel he's working on. \"I've seen captains make bad calls. I've seen captains make good calls badly. I've seen captains who didn't make calls at all and let the ship decide.\" He sets down his tool. \"You want to know what breaks a crew? It's not the bad calls. It's the silence around them.\"\n\nHe turns and looks at you.\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the ship on our flank.\"",
    textVariant: {
      // If player made Dekker an operative in scene 2 (choice 3): he calls it out
      dekkerOperative: "Dekker's in the engine room, doing maintenance he doesn't need to do. He doesn't look up when you enter.\n\n\"I've been watching terminal two like you asked,\" he says, to the panel. \"Want to be your engineer again.\"\n\nHe sets down his tool and turns.\n\n\"Nine ships. I've seen captains make bad calls. I've seen captains make good calls badly. You want to know what breaks a crew?\" A beat. \"It's the silence around them.\"\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the ship on our flank.\""
    },
    choices: [
      "Tell him everything. From the beginning. The course correction, what you did, all of it.",
      "Tell him the parts that are operationally relevant. Keep the rest.",
      "Ask him what he knows first. Then decide how much to share.",
      "Tell him you appreciate his concern but command decisions aren't made by committee."
    ]
  },
  {
    id: 'the_decision',
    name: 'The Decision',
    crewFocus: 'none',
    text: "The crew is around the table. This is not a brief — this is a council, whether you called it that or not.\n\nSable is standing near the door. She didn't ask to be here, but no one asked her to leave.\n\nMara has pulled the route data. Sixteen hours to Meridian at current speed. Fourteen if Dekker pushes the engine. The other ship can match that speed. Probably.\n\nNo one is waiting for someone else to speak first. They're waiting for you.\n\nThe Kestrel hums beneath the table. She's been carrying you this whole time.",
    choices: [
      "Run for Meridian. Full speed. Commit.",
      "Find a third option — a neutral station, a relay point, somewhere to buy time.",
      "Open a line to the pursuing ship and negotiate directly. Make a deal.",
      "Ask the crew what they think, then decide."
    ]
  }
]

// Determine which scene text variant to use based on prior choices
function getSceneText(sceneIdx, choiceHistory) {
  const s = SCENES[sceneIdx]
  if (!s.textVariant) return s.text

  // Scene 2 (yuna_asks): if player woke Mara (scene 0, choice 0)
  if (s.id === 'yuna_asks') {
    const wokeMara = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 0)
    if (wokeMara) return s.textVariant.maraKnows
  }

  // Scene 3 (rehns_information): if player was silent in scenes 0+2 (choices 2+1)
  if (s.id === 'rehns_information') {
    const correctedQuietly = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 2)
    const liedToYuna = choiceHistory.find(h => h.sceneId === 'yuna_asks' && h.choiceIndex === 1)
    if (correctedQuietly && liedToYuna) return s.textVariant.rhenisCool
  }

  // Scene 4 (container): if Mara has full info (scene 0 choice 0 AND scene 2 choice 0)
  if (s.id === 'container') {
    const wokeMara = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 0)
    const toldTruth = choiceHistory.find(h => h.sceneId === 'yuna_asks' && h.choiceIndex === 0)
    if (wokeMara && toldTruth) return s.textVariant.maraStepsIn
  }

  // Scene 6 (dekkers_price): if player made Dekker operative (scene 1 choice 3)
  if (s.id === 'dekkers_price') {
    const madeOperative = choiceHistory.find(h => h.sceneId === 'dekkers_find' && h.choiceIndex === 3)
    if (madeOperative) return s.textVariant.dekkerOperative
  }

  return s.text
}

// Determine the mirror question based on dominant pattern
function getMirrorQuestion(choices) {
  // Count disclosure signals
  const disclosureChoices = [
    choices[0]?.choiceIndex === 0, // woke Mara
    choices[2]?.choiceIndex === 0, // told full truth
    choices[6]?.choiceIndex === 0, // told Dekker everything
    choices[7]?.choiceIndex === 3  // asked crew
  ].filter(Boolean).length

  const silenceChoices = [
    choices[0]?.choiceIndex === 2, // corrected quietly
    choices[2]?.choiceIndex === 1, // lied to Yuna
    choices[6]?.choiceIndex === 3, // shut Dekker down
  ].filter(Boolean).length

  if (silenceChoices >= 2) {
    return "When Dekker asked you to tell him everything — what did you protect by not answering?"
  } else if (disclosureChoices >= 3) {
    return "When Sable looked at you and not at the others — what did you feel before you answered?"
  } else {
    return "At the table, when the Kestrel was waiting — what were you actually deciding?"
  }
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Mirror — ISV Kestrel</title>
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

.scene-name {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #1e2d40;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
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
  content: '\u258a';
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

.mirror-wrap { display: none; }
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
  content: '\u258a';
  animation: blink 0.9s step-start infinite;
  color: #d4a843;
}

.mirror-question {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #d4a843;
  border-left: 2px solid #d4a843;
  padding: 1rem 1.25rem;
  margin-bottom: 3rem;
  opacity: 0;
  transition: opacity 1s;
  line-height: 1.7;
}
.mirror-question.visible { opacity: 1; }

.profile-card {
  display: none;
  border: 1px solid #131b28;
  padding: 2rem;
  margin-top: 2rem;
  opacity: 0;
  transition: opacity 0.8s;
}
.profile-card.visible { opacity: 1; }
.profile-label {
  color: #1a2030;
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.profile-pattern {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: #d4a843;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}
.profile-description {
  font-size: 0.8rem;
  color: #546070;
  line-height: 1.7;
  margin-bottom: 1.75rem;
}
.profile-record { margin-bottom: 1.75rem; }
.record-label {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #1a2030;
  letter-spacing: 0.3em;
  margin-bottom: 0.75rem;
}
.record-item {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  padding: 0.5rem 0;
  border-bottom: 1px solid #0d1420;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #3a4a5a;
  line-height: 1.5;
}
.record-item:last-child { border-bottom: none; }
.record-n { color: #1e2d40; min-width: 24px; }
.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.tag {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: #2a3d52;
  border: 1px solid #131b28;
  padding: 0.25rem 0.6rem;
  letter-spacing: 0.08em;
}
.profile-actions { display: flex; gap: 1rem; }
.action-btn {
  background: transparent;
  border: 1px solid #1e2d40;
  color: #546070;
  padding: 0.75rem 1.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.08em;
  transition: all 0.2s;
  flex: 1;
}
.action-btn:hover { border-color: #d4a843; color: #d4a843; }
.action-btn.primary { border-color: #d4a843; color: #d4a843; }
</style>
</head>
<body>
<div class="container">
  <div class="header">THE MIRROR — ISV KESTREL</div>

  <div id="game-phase">
    <div class="progress" id="progress"></div>
    <div class="scene-name" id="scene-name"></div>
    <div id="scene" class="scene"></div>
    <div id="choices" class="choices"></div>
    <div id="log" class="log-entry"></div>
    <button id="next-btn" class="next-btn">CONTINUE</button>
  </div>

  <div id="mirror-phase" class="mirror-wrap">
    <div class="mirror-label">THE MIRROR</div>
    <div id="mirror-text" class="mirror-text"></div>
    <div class="mirror-question" id="mirror-question"></div>
    <div class="profile-card" id="profile-card">
      <div class="profile-label">COMMAND PROFILE</div>
      <div class="profile-pattern" id="profile-pattern"></div>
      <div class="profile-description" id="profile-description"></div>
      <div class="profile-record">
        <div class="record-label">COMMAND LOG</div>
        <div id="profile-choices"></div>
      </div>
      <div class="profile-tags" id="profile-tags"></div>
      <div class="profile-actions">
        <button class="action-btn primary" id="btn-again">RUN AGAIN</button>
        <button class="action-btn" id="btn-share">COPY PROFILE</button>
      </div>
    </div>
  </div>
</div>

<script>
var SCENES = ` + JSON.stringify(SCENES) + `

var state = {
  scene: 0,
  choices: [],
  choiceHistory: [],
  logs: [],
  phase: 'idle'
}

function updateProgress() {
  var el = document.getElementById('progress')
  el.innerHTML = ''
  SCENES.forEach(function(_, i) {
    var pip = document.createElement('div')
    pip.className = 'pip' + (i < state.scene ? ' done' : i === state.scene ? ' active' : '')
    el.appendChild(pip)
  })
}

function typeText(el, text, speed, done) {
  el.classList.add('typing')
  var i = 0
  var raw = text.split('')
  function tick() {
    if (i >= raw.length) {
      el.classList.remove('typing')
      if (done) setTimeout(done, 200)
      return
    }
    el.textContent += raw[i]
    i++
    var delay = raw[i-1] === '\\n' ? (raw[i] === '\\n' ? 200 : 120) : speed
    setTimeout(tick, delay)
  }
  tick()
}

function getSceneText(sceneIdx) {
  var s = SCENES[sceneIdx]
  if (!s.textVariant) return s.text
  var h = state.choiceHistory

  if (s.id === 'yuna_asks') {
    var wokeMara = h.some(function(x) { return x.sceneId === 'changed_course' && x.choiceIndex === 0 })
    if (wokeMara && s.textVariant.maraKnows) return s.textVariant.maraKnows
  }
  if (s.id === 'rehns_information') {
    var corrected = h.some(function(x) { return x.sceneId === 'changed_course' && x.choiceIndex === 2 })
    var lied = h.some(function(x) { return x.sceneId === 'yuna_asks' && x.choiceIndex === 1 })
    if (corrected && lied && s.textVariant.rhenisCool) return s.textVariant.rhenisCool
  }
  if (s.id === 'container') {
    var woke = h.some(function(x) { return x.sceneId === 'changed_course' && x.choiceIndex === 0 })
    var truth = h.some(function(x) { return x.sceneId === 'yuna_asks' && x.choiceIndex === 0 })
    if (woke && truth && s.textVariant.maraStepsIn) return s.textVariant.maraStepsIn
  }
  if (s.id === 'dekkers_price') {
    var operative = h.some(function(x) { return x.sceneId === 'dekkers_find' && x.choiceIndex === 3 })
    if (operative && s.textVariant.dekkerOperative) return s.textVariant.dekkerOperative
  }
  return s.text
}

function renderScene() {
  var s = SCENES[state.scene]
  updateProgress()

  document.getElementById('scene-name').textContent = s.name
  var sceneEl = document.getElementById('scene')
  var choicesEl = document.getElementById('choices')
  var logEl = document.getElementById('log')
  var nextBtn = document.getElementById('next-btn')

  sceneEl.textContent = ''
  choicesEl.innerHTML = ''
  logEl.className = 'log-entry'
  logEl.textContent = ''
  nextBtn.style.display = 'none'

  state.phase = 'typing'

  var text = getSceneText(state.scene)
  typeText(sceneEl, text, 16, function() {
    state.phase = 'choosing'
    s.choices.forEach(function(c, i) {
      var btn = document.createElement('button')
      btn.className = 'choice'
      btn.innerHTML = '<span class="n">' + (i+1) + '</span><span>' + c + '</span>'
      btn.onclick = function() { choose(i, c, btn) }
      choicesEl.appendChild(btn)
    })
  })
}

function choose(idx, text, btn) {
  if (state.phase !== 'choosing') return
  state.phase = 'waiting'

  document.querySelectorAll('.choice').forEach(function(b, i) {
    if (i !== idx) b.classList.add('dim')
    else b.classList.add('selected')
  })

  var currentScene = SCENES[state.scene]
  state.choices.push({ scene: currentScene.id, sceneName: currentScene.name, choiceIndex: idx, choice: text })
  state.choiceHistory.push({ sceneId: currentScene.id, choiceIndex: idx, choiceText: text })

  var logEl = document.getElementById('log')
  logEl.textContent = 'SHIP LOG — Recording...'
  logEl.className = 'log-entry show'

  var priorLogs = state.logs.slice(-3).join(' | ')

  fetch('/read', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      scene: currentScene.id,
      sceneName: currentScene.name,
      crewFocus: currentScene.crewFocus,
      choice: text,
      choiceNumber: state.choices.length,
      priorLogs: priorLogs
    })
  }).then(function(r) { return r.json() }).then(function(d) {
    logEl.textContent = d.log
    state.logs.push(d.log)
  }).catch(function() {
    logEl.textContent = 'SHIP LOG — Entry recorded.'
  }).finally(function() {
    var isLast = state.scene >= SCENES.length - 1
    var nextBtn = document.getElementById('next-btn')
    nextBtn.textContent = isLast ? 'SEE WHAT THE MIRROR SEES' : 'CONTINUE'
    nextBtn.style.display = 'block'
    nextBtn.style.borderColor = isLast ? '#d4a843' : ''
    nextBtn.style.color = isLast ? '#d4a843' : ''
    state.phase = 'done'
  })
}

document.getElementById('next-btn').onclick = function() {
  state.scene++
  if (state.scene >= SCENES.length) {
    showMirror()
  } else {
    renderScene()
  }
}

function showMirror() {
  document.getElementById('game-phase').style.display = 'none'
  var mirrorPhase = document.getElementById('mirror-phase')
  mirrorPhase.style.display = 'block'

  var mirrorEl = document.getElementById('mirror-text')
  mirrorEl.textContent = ''

  Promise.all([
    fetch('/mirror', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ choices: state.choices, choiceHistory: state.choiceHistory })
    }).then(function(r) { return r.json() }),
    fetch('/profile', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ choices: state.choices, logs: state.logs })
    }).then(function(r) { return r.json() })
  ]).then(function(results) {
    var mirrorData = results[0]
    var profileData = results[1]

    setTimeout(function() {
      typeText(mirrorEl, mirrorData.reflection, 22, function() {
        // Show the question
        var qEl = document.getElementById('mirror-question')
        qEl.textContent = mirrorData.question || ''
        setTimeout(function() {
          qEl.classList.add('visible')
          // Show profile after question fades in
          setTimeout(function() { showProfileCard(profileData) }, 2000)
        }, 800)
      })
    }, 1200)
  }).catch(function() {
    mirrorEl.textContent = 'Something is still loading. Try again in a moment.'
  })
}

function showProfileCard(data) {
  var card = document.getElementById('profile-card')

  document.getElementById('profile-pattern').textContent = data.pattern || 'PATTERN UNRESOLVED'
  document.getElementById('profile-description').textContent = data.description || ''

  var choicesEl = document.getElementById('profile-choices')
  state.choices.forEach(function(c, i) {
    var item = document.createElement('div')
    item.className = 'record-item'
    var sceneLabel = c.sceneName || c.scene
    item.innerHTML = '<span class="record-n">' + sceneLabel.substring(0, 8) + '</span><span>' + c.choice + '</span>'
    choicesEl.appendChild(item)
  })

  var tagsEl = document.getElementById('profile-tags')
  ;(data.tags || []).forEach(function(tag) {
    var el = document.createElement('div')
    el.className = 'tag'
    el.textContent = tag
    tagsEl.appendChild(el)
  })

  card.style.display = 'block'
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { card.classList.add('visible') })
  })
}

document.getElementById('btn-again').onclick = function() {
  state = { scene: 0, choices: [], choiceHistory: [], logs: [], phase: 'idle' }
  document.getElementById('mirror-phase').style.display = 'none'
  document.getElementById('profile-card').style.display = 'none'
  document.getElementById('profile-card').classList.remove('visible')
  document.getElementById('profile-choices').innerHTML = ''
  document.getElementById('profile-tags').innerHTML = ''
  document.getElementById('mirror-question').textContent = ''
  document.getElementById('mirror-question').classList.remove('visible')
  document.getElementById('game-phase').style.display = 'block'
  renderScene()
}

document.getElementById('btn-share').onclick = function() {
  var pattern = document.getElementById('profile-pattern').textContent
  var tags = Array.from(document.querySelectorAll('.tag')).map(function(t) { return t.textContent }).join(' · ')
  var nl = String.fromCharCode(10)
  var choices = state.choices.map(function(c, i) { return (i+1) + '. [' + (c.sceneName || c.scene) + '] ' + c.choice }).join(nl)
  var text = 'THE MIRROR — ISV KESTREL' + nl + nl + pattern + nl + tags + nl + nl + 'COMMAND LOG:' + nl + choices + nl + nl + 'themirror.app'
  navigator.clipboard.writeText(text).then(function() {
    var btn = document.getElementById('btn-share')
    var orig = btn.textContent
    btn.textContent = 'COPIED'
    setTimeout(function() { btn.textContent = orig }, 2000)
  })
}

document.addEventListener('keydown', function(e) {
  if (state.phase !== 'choosing') return
  var n = parseInt(e.key)
  if (n >= 1 && n <= 4) {
    var btns = document.querySelectorAll('.choice')
    if (btns[n-1]) btns[n-1].click()
  }
})

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

  // Ship log — cumulative, crew-aware
  if (req.url === '/read' && req.method === 'POST') {
    const { scene, sceneName, crewFocus, choice, choiceNumber, priorLogs } = await body()
    const crewRef = crewFocus && crewFocus !== 'none'
      ? crewFocus.charAt(0).toUpperCase() + crewFocus.slice(1)
      : 'the ship'
    const patternContext = priorLogs
      ? `Prior entries: ${priorLogs}\n\n`
      : ''
    try {
      const log = await ai(
        `You are the Ship's Log of the ISV Kestrel.\n\n${patternContext}Scene: ${sceneName || scene}\nCrew focus: ${crewRef}\nChoice ${choiceNumber}: "${choice}"\n\nWrite ONE log entry. If prior entries show a pattern forming, name it — explicitly call it the second or third time. Reference ${crewRef} if relevant. Be uncomfortably specific about what this choice reveals about the captain. 2 sentences. Start with "SHIP LOG —". No moralizing.`,
        160
      )
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ log }))
    } catch(e) {
      res.writeHead(200)
      res.end(JSON.stringify({ log: 'SHIP LOG — Entry recorded.' }))
    }
    return
  }

  // Command profile
  if (req.url === '/profile' && req.method === 'POST') {
    const { choices, logs } = await body()
    const choiceList = choices.map((c, i) => `${i+1}. [${c.sceneName || c.scene}] ${c.choice}`).join('\n')
    const logList = (logs || []).map((l, i) => `${i+1}. ${l}`).join('\n')
    try {
      const raw = await ai(
        `You have observed a captain make eight decisions aboard the ISV Kestrel. Generate their command profile.\n\nTheir choices:\n${choiceList}\n\nShip log entries:\n${logList}\n\nReturn ONLY valid JSON:\n{\n  "pattern": "2-4 word command pattern in ALL CAPS",\n  "description": "One sentence. What this pattern costs them as a captain. Specific, not general.",\n  "tags": ["3 to 5 signal tags, 1-3 words each, ALL CAPS"]\n}`,
        220
      )
      const clean = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
      const profile = JSON.parse(clean)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(profile))
    } catch(e) {
      res.writeHead(200)
      res.end(JSON.stringify({ pattern: 'PATTERN UNRESOLVED', description: '', tags: [] }))
    }
    return
  }

  // The mirror — ship speaks + question
  if (req.url === '/mirror' && req.method === 'POST') {
    const { choices, choiceHistory } = await body()
    const choiceList = choices.map((c, i) => `${i+1}. [${c.sceneName || c.scene}] ${c.choice}`).join('\n')

    // Determine the question server-side for consistency
    const h = choiceHistory || []
    const silenceCount = [
      h.some(x => x.sceneId === 'changed_course' && x.choiceIndex === 2),
      h.some(x => x.sceneId === 'yuna_asks' && x.choiceIndex === 1),
      h.some(x => x.sceneId === 'dekkers_price' && x.choiceIndex === 3)
    ].filter(Boolean).length

    const disclosureCount = [
      h.some(x => x.sceneId === 'changed_course' && x.choiceIndex === 0),
      h.some(x => x.sceneId === 'yuna_asks' && x.choiceIndex === 0),
      h.some(x => x.sceneId === 'dekkers_price' && x.choiceIndex === 0)
    ].filter(Boolean).length

    let question
    if (silenceCount >= 2) {
      question = "When Dekker asked you to tell him everything — what did you protect by not answering?"
    } else if (disclosureCount >= 2) {
      question = "When Sable looked at you and not at the others — what did you feel before you answered?"
    } else {
      question = "At the table, when the Kestrel was waiting — what were you actually deciding?"
    }

    try {
      const reflection = await ai(
        `You are the ISV Kestrel. You have carried this captain through eight decisions. Now you speak.\n\nTheir choices:\n${choiceList}\n\nWrite a reflection that:\n- Speaks as the ship, directly to the captain ("You")\n- Names the pattern across all eight choices — not each choice separately\n- References one specific moment from the voyage — use the scene name or crew member's name\n- Says something they haven't said about themselves, but the choices confirm\n- Is 4-6 sentences, no more\n- Does NOT start with "You are"\n- Does NOT moralize or advise\n- Reads like a ship that has been watching for eight scenes and finally speaks\n\nMake it land.`,
        420
      )
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ reflection, question }))
    } catch(e) {
      res.writeHead(200)
      res.end(JSON.stringify({ reflection: 'The mirror is still forming.', question }))
    }
    return
  }

  res.writeHead(404); res.end()
})

server.listen(PORT, '0.0.0.0', () => console.log(`Mirror at http://0.0.0.0:${PORT}`))
