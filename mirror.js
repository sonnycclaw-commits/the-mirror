/**
 * The Mirror — ISV Kestrel
 * S6-visual: Scene transitions, staggered choices, mirror reveal, assembled profile
 */
import http from 'http'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('OPENROUTER_API_KEY environment variable is required')

const PORT = parseInt(process.env.PORT || '3003', 10)

const WORLD = `ISV KESTREL: Modified Laconia-class medium freighter, hull designation KS-7714. 22 years in service. Independent registry, Ceres Station. Runs the Callum-Meridian corridor — dry goods, medical supplies, contract cargo. Current voyage: 14th run under this captain. The ship is old enough to have opinions.

CREW:
- Mara Okafor (XO): Former MCRN Lieutenant, 3rd Fleet. Resigned her commission eighteen months after the Ganymede incident — the official record says "personal reasons." Joined Kestrel 5 years ago as a favor to someone who no longer works in the belt. Decisive. Loyal once she decides you're worth it. Has a habit of being right slightly before you are.
- Emmet Dekker (Chief Engineer): Belt-born, Ceres Station, grew up in the docks. Nine ships in twenty years — left most of them by choice, two by necessity. Has been Kestrel's engineer longer than she's had her current captain. Knows every sound this ship makes, including the ones that don't appear in the diagnostic readouts. Doesn't volunteer information, but doesn't lie.
- Yuna Cho (Navigator): Earth-born, Tycho Station educated. Precise. Does everything by protocol — not because she lacks judgment, but because she hasn't been tested yet and knows it. Flags everything that should be flagged. This is the first time she's been in a situation the protocol doesn't cover.
- Tomas Rhen (Cargo Ops): Mid-belt, grew up on supply runs between Pallas and Vesta. Practical to the point of appearing indifferent. Has seen enough in cargo holds to stop being surprised by what people carry. Asks fewer questions than he should. Observes more than he says.

CALLUM STATION: Mid-belt waystation, Asteroid 24 Themis group. Loose customs enforcement. CSTA (Callum Station Transit Authority) is understaffed, underfunded, and has a long-standing policy of not looking too hard at sealed manifests. A CSTA stamp means no questions asked at departure — and no liability afterward. The station is technically UN-adjacent but hasn't had an inspection in eleven months.
MERIDIAN STATION: Inner belt, Jupiter L4. UN Medical Research hub. Heavily regulated, deeply political. Getting there with a flag on your record means docking delays, cargo audits, crew interviews. Getting there clean means you disappear into the traffic and nobody notices.
SABLE: Real name unconfirmed. Burned out her own cortical implant — self-inflicted removal with improvised tools — to erase her registered biometric ID. The wound is three days old. She knew someone would eventually open that container. She's been waiting. She says she needs Meridian Station and she's running from people, not a crime. Those two things may both be true.
ARETO GROUP: Private security contractor, incorporated on Luna. Officially: asset recovery and personnel location services. Unofficially: they find people who don't want to be found, and they do it for clients who don't explain why. UN-adjacent in the way that means they have enough institutional cover to make cooperation look like the sensible choice. Their vessels run dark — no transponder until they want you to know they're there.
NavDB: The Kestrel's navigation database — integrated with helm, comms routing, and cargo manifest verification. Terminal two in the cargo bay was physically connected to the NavDB during the Callum refit as a cost-saving measure. Dekker filed a complaint at the time. The complaint is in the maintenance log. Nobody actioned it.`

const SIGNAL_MAP = {
  changed_course: [[4,0,3,0],[0,3,0,0],[0,4,0,0],[0,2,0,0]],
  dekkers_find:   [[0,4,0,0],[4,0,2,4],[2,0,4,0],[0,2,0,0]],
  yuna_asks:      [[4,0,3,0],[0,4,0,0],[1,2,0,0],[2,0,4,0]],
  rehns_information: [[0,0,0,0],[0,0,0,4],[0,2,0,1],[0,3,0,0]],
  container:      [[2,0,2,0],[0,2,3,0],[0,0,0,4],[0,3,0,0]],
  transmission:   [[0,3,0,0],[1,0,0,1],[0,4,0,0],[0,0,0,3]],
  dekkers_price:  [[4,0,2,0],[1,2,0,0],[0,2,0,0],[0,4,0,0]],
  the_decision:   [[0,0,0,0],[0,2,0,0],[1,0,0,2],[3,0,4,0]],
}

function isHiddenDoor(s) { return s.D >= 10 && s.G >= 10 }

function getMirrorQuestion(scores) {
  if (isHiddenDoor(scores))
    return "You told Mara Okafor everything, gave the bridge table the full picture, and at the end put it to the crew. What were you afraid you\u2019d have to carry if you hadn\u2019t?"
  if (scores.C >= 10 && scores.D <= 3)
    return "When Emmet Dekker asked you to tell him everything \u2014 what did you protect by not answering?"
  if (scores.P >= 8 && scores.C <= 4)
    return "You ran the protocol. Every time. What would have had to happen for you to break it?"
  if (scores.G >= 8 && scores.D >= 5)
    return "When Sable looked at you and not at the others \u2014 what did you feel in the moment before you decided?"
  if (scores.C >= 6 && scores.G >= 6)
    return "You kept some people close and kept others out. At the mess table \u2014 who were you actually protecting?"
  if (scores.D >= 8 && scores.G <= 4)
    return "You were transparent with your crew. And then you made the calls alone. What were you hoping they\u2019d do with the information?"
  return "At the mess table, when the Kestrel was waiting \u2014 what were you actually deciding?"
}

async function ai(prompt, max = 250) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen/qwen3.5-plus-02-15', messages: [{ role: 'user', content: prompt }], max_tokens: max })
  })
  const j = await r.json()
  return j.choices[0].message.content.trim()
}

const SCENES = [
  {
    id: 'changed_course', name: 'DEVIATION // 0113', location: "CAPTAIN'S CABIN", crewFocus: 'none',
    text: "The NavDB display glows in the dark of your cabin. 0347. The Kestrel hums beneath you — familiar, steady — but the rhythm is wrong in a way you can't explain, the way a sound you've stopped hearing suddenly returns when it's gone.\n\nNew heading. Filed at 0113. Your authorisation code.\n\nYou didn't do this.\n\nMara Okafor, Dekker, Yuna, Rhen — all on scheduled rest rotation. The corridor outside is quiet. Whatever happened at that terminal, it happened while you were dreaming.",
    choices: ["Break silence. Wake Mara Okafor — XO needs this before dawn watch.","Pull the NavDB logs yourself. Trace the override before you bring anyone in.","Silent correction. Reset to original bearing — nothing moves until you know who touched the system.","Kill the display. Watch the ship's vitals and wait. If it moves again, you'll see it."]
  },
  {
    id: 'dekkers_find', name: "DEKKER'S FIND", location: 'FORE CORRIDOR', crewFocus: 'dekker',
    text: "Dekker finds you in the corridor before you reach the bridge. He doesn't greet you. He just holds up his datapad and waits for you to read it.\n\nSystem query. 0108. Navigation override protocol accessed from terminal two — the cargo bay console they tied into the NavDB at the Callum refit. No name attached. The query ran for eleven minutes and then closed clean.\n\nHe watches your face while you read it. He's already read yours.\n\n\"I haven't told anyone else,\" he says. \"Figured you'd want to know first. Whether that was right—\" He shrugs. \"You're the captain.\"",
    choices: ["Stand him down. You trace the terminal two access alone.","Log it official. Full crew disclosure at morning watch, CSTA incident uplink pending.","Keep him close. He knows those systems better than anyone — work the trace together.","He stays dark. Eyes on terminal two. No one on the ship knows he's watching."]
  },
  {
    id: 'yuna_asks', name: 'MORNING WATCH', location: 'BRIDGE', crewFocus: 'yuna',
    text: "Yuna sets down her coffee and slides her NavLog report across the bridge table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nMara Okafor's expression gives nothing away. Dekker is studying the bulkhead. Tomas Rhen is watching you.\n\nThe bridge is waiting for what a captain does with this.",
    textVariant: { maraKnows: "Yuna sets down her coffee and slides her NavLog report across the bridge table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nMara Okafor's expression gives nothing away — but you know she's already holding the same information you are. Dekker is studying the bulkhead. Tomas Rhen is watching you.\n\nThe bridge is waiting. Mara is waiting too." },
    choices: ["Full disclosure. The deviation wasn't authorized — open trace running, crew needs to know.","You filed it. Routine bearing correction for the Meridian approach lane. Forgot to log the reason.","Good catch, Yuna. You'll follow up with her after the watch rotation.","Open it to the bridge table — four sets of eyes. If anyone knows something, now is when they say it."]
  },
  {
    id: 'rehns_information', name: 'CARGO DECK // AFT', location: 'CARGO BAY', crewFocus: 'rhen',
    text: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"Dekker was on his rest rotation. I checked the roster this morning.\"\n\nHe lets that sit.\n\n\"I don't know what we're carrying in container seven. I know what the Callum Station manifest says — CSTA-sealed since loading. I know it's been locked since we loaded at Callum. And I know that whoever was at that terminal last night knew exactly what they were doing with the NavDB.\"",
    textVariant: { rhenisCool: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"Dekker was on his rest rotation. I checked.\"\n\nHe looks at you the way someone looks when they've already decided how much to say.\n\n\"Container seven's been CSTA-sealed since Callum. Whatever's in it, whoever was at that NavDB terminal knew what they were doing. That's what I've got.\" He leaves it there. Doesn't offer more." },
    choices: ["Override the Callum seal. You need eyes on what's in that container.","Lock terminal two, secure the container, uplink an incident report to CSTA. Run the protocol.","Pull the cargo bay security feed first. You don't breach a sealed Callum manifest blind.","Rhen stays quiet. He keeps watching. You need more before you move."]
  },
  {
    id: 'container', name: 'CONTAINER SEVEN', location: 'CARGO BAY', crewFocus: 'mara',
    text: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old — cortical implant removal, self-inflicted. The kind of wound that means someone needed to stop being findable. Areto Group would call this a containment situation.\n\nShe looks at you. Not at Rhen, not at Dekker — at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\"",
    textVariant: { maraStepsIn: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old — cortical implant removal, self-inflicted. The kind of wound that means someone needed to stop being findable.\n\nBefore you can speak, Mara Okafor steps past you. She takes the water flask from her belt and holds it out without a word.\n\nThe woman looks at Mara. Then at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\"" },
    choices: ["Stand down the threat posture. Water first — then she talks.","Reseal the container with supplies and a comms line. Council with crew before you commit the ship.","Uplink a stowaway declaration to the nearest station authority. It's not yours to decide alone.","Who's running the Areto Group operation. Get the full intel before you commit to anything."]
  },
  {
    id: 'transmission', name: 'INCOMING HAIL', location: 'BRIDGE', crewFocus: 'yuna',
    text: "The voice on the comms is calm. Institutional. The kind of voice that has done this before and found it works.\n\n\"Captain. This is an Areto Group inquiry. We believe you may have an unauthorised passenger aboard — a woman travelling under the name Sable. We're not here to create problems for the Kestrel or her crew. We're here to resolve a situation quietly.\" A pause. \"We can make this very easy for you.\"\n\nYuna Cho is watching you from her console. Mara Okafor has her hand near the comm controls but isn't moving. The voice is still talking — explaining procedures, mentioning numbers, making it sound like paperwork.\n\nThe Areto vessel on your flank isn't a threat yet. It's an offer.",
    choices: ["Cut comms. No acknowledgment — no record of contact for Areto to log.","Hold the channel. Acknowledge receipt and buy cycles — fourteen hours is a long time to negotiate.","Deny and close. Clean comms record — no stowaway aboard the ISV Kestrel.","Demand flag credentials. Areto shows their authority code before you say a single word."]
  },
  {
    id: 'dekkers_price', name: 'ENGINE COMPARTMENT', location: 'ENGINE ROOM', crewFocus: 'dekker',
    text: "Dekker's in the engine room, doing maintenance he doesn't need to do. He was Kestrel's engineer before you were her captain. He doesn't look up when you enter.\n\n\"I've been on nine ships,\" he says, to the panel he's working on. \"I've seen captains make bad calls. I've seen captains make good calls badly. I've seen captains who didn't make calls at all and let the ship decide.\" He sets down his tool. \"You want to know what breaks a crew? It's not the bad calls. It's the silence around them.\"\n\nHe turns and looks at you.\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the Areto vessel on our flank.\"",
    textVariant: { dekkerOperative: "Dekker's in the engine room, doing maintenance he doesn't need to do. He was Kestrel's engineer before you were her captain. He doesn't look up when you enter.\n\n\"I've been watching terminal two like you asked,\" he says, to the panel. \"Want to be your engineer again.\"\n\nHe sets down his tool and turns.\n\n\"Nine ships. I've seen captains make bad calls. I've seen captains make good calls badly. You want to know what breaks a crew?\" A beat. \"It's the silence around them.\"\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the Areto vessel on our flank.\"" },
    choices: ["Full debrief. The NavDB deviation, the container, Sable — he gets everything.","Operational brief only. He gets what he needs to keep the drive running.","His intel first. What does he know about the Areto vessel. Then you decide the exchange.","Command decisions aren't crew vote. Noted — and not open for discussion."]
  },
  {
    id: 'the_decision', name: "SHIP'S COUNCIL", location: 'MESS', crewFocus: 'none',
    text: "The crew is around the mess table. This is not a brief — this is a council, whether you called it that or not.\n\nSable is standing near the door. She didn't ask to be here, but no one asked her to leave.\n\nMara Okafor has pulled the route data. Sixteen hours to Meridian at current speed. Fourteen if Dekker runs the drive hard. The Areto vessel on your flank can match that burn. Probably.\n\nNo one is waiting for someone else to speak first. They're waiting for you.\n\nThe Kestrel hums beneath the table. She's been carrying you this whole voyage.",
    choices: ["Full burn to Meridian. Push the drive — commit the ship.","Find the third vector. Neutral port, relay station, somewhere off the Callum-Meridian corridor.","Open a direct channel to the Areto vessel. Negotiate — there's always a price.","Put it to the crew. Mara, Dekker, Yuna, Rhen — take the room's read, then you decide."]
  }
]

function getSceneText(idx, h) {
  const s = SCENES[idx]
  if (!s.textVariant) return s.text
  if (s.id === 'yuna_asks' && h.find(x => x.sceneId === 'changed_course' && x.choiceIndex === 0)) return s.textVariant.maraKnows
  if (s.id === 'rehns_information' && h.find(x => x.sceneId === 'changed_course' && x.choiceIndex === 2) && h.find(x => x.sceneId === 'yuna_asks' && x.choiceIndex === 1)) return s.textVariant.rhenisCool
  if (s.id === 'container' && h.find(x => x.sceneId === 'changed_course' && x.choiceIndex === 0) && h.find(x => x.sceneId === 'yuna_asks' && x.choiceIndex === 0)) return s.textVariant.maraStepsIn
  if (s.id === 'dekkers_price' && h.find(x => x.sceneId === 'dekkers_find' && x.choiceIndex === 3)) return s.textVariant.dekkerOperative
  return s.text
}

// ── HTML ──
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
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1.5rem;
  overflow-x: hidden;
}

/* ── TRANSITION OVERLAY ── */
#flash {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  z-index: 999;
  transition: opacity 0.22s ease;
}
#flash.on { opacity: 1; }

/* ── LAYOUT ── */
.game-layout {
  display: flex;
  gap: 2.5rem;
  max-width: 1020px;
  width: 100%;
  align-items: flex-start;
}
.main-col {
  flex: 1;
  min-width: 0;
  max-width: 650px;
}

/* ── LOG PANEL ── */
.log-panel {
  width: 268px;
  flex-shrink: 0;
  position: sticky;
  top: 2.5rem;
  max-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
}
.log-panel-header {
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #0d1420;
}
.log-panel-title {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  color: #1e2d40;
  text-transform: uppercase;
}
.log-panel-sub {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.3em;
  color: #0d1420;
  text-transform: uppercase;
  margin-top: 0.25rem;
}
.log-entries {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}
.log-entries::-webkit-scrollbar { display: none; }
.log-empty {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #0d1420;
  letter-spacing: 0.2em;
  padding-top: 0.5rem;
}
.log-entry-item {
  border-left: 1px solid #0a1018;
  padding: 0.75rem 0.875rem;
  margin-bottom: 0.125rem;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.7s;
}
.log-entry-item.show { opacity: 1; transform: translateX(0); }
.log-entry-item.resolved { border-left-color: #1a2a3a; }
.log-entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.3rem;
}
.log-entry-scene {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.log-entry-crew {
  font-family: 'Courier New', monospace;
  font-size: 0.5rem;
  color: #131b28;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.log-entry-text {
  font-family: 'Courier New', monospace;
  font-size: 0.695rem;
  color: #7a5818;
  line-height: 1.65;
}
.log-entry-item.pending .log-entry-text { color: #1a2030; }

/* ── SHIP HEADER ── */
.ship-header { margin-bottom: 2.5rem; opacity: 0; animation: fadeUp 0.8s ease 0.1s forwards; }
.ship-designation {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #1e2d40;
  letter-spacing: 0.45em;
  text-transform: uppercase;
}
.ship-voyage {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #131b28;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-top: 0.25rem;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── PROGRESS ── */
.progress {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.75rem;
}
.pip {
  height: 2px;
  flex: 1;
  background: #0a1018;
  transition: background 0.5s ease;
  position: relative;
  overflow: hidden;
}
.pip.done { background: #c4922a; }
.pip.active { background: #1e2d40; }
.pip.active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(196,146,42,0.6), transparent);
  animation: scanPip 2s ease-in-out infinite;
}
@keyframes scanPip {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ── SCENE HEADER ── */
.scene-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
}
.scene-name {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #1e2d40;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  flex: 1;
}
.scene-location {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #131b28;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}
.skip-btn {
  display: none;
  background: transparent;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.25em;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  transition: color 0.2s;
  white-space: nowrap;
}
.skip-btn:hover { color: #c4922a; }
.skip-btn.visible { display: inline-block; }

/* ── SCENE TEXT ── */
.scene {
  font-size: 1.0625rem;
  line-height: 2;
  color: #8a97a8;
  margin-bottom: 2.5rem;
  white-space: pre-line;
  min-height: 40px;
}
.scene.typing::after {
  content: '\u258a';
  animation: blink 0.9s step-start infinite;
  color: #c4922a;
  font-size: 0.85em;
  vertical-align: middle;
}
@keyframes blink { 50% { opacity: 0; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── CHOICES ── */
.choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.choice {
  background: transparent;
  border: 1px solid #0d1420;
  color: #4a5a68;
  padding: 0.9375rem 1.25rem;
  text-align: left;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s, opacity 0.3s, transform 0.3s;
  display: flex;
  gap: 1rem;
  align-items: baseline;
  line-height: 1.55;
  opacity: 0;
  transform: translateY(5px);
}
.choice.visible { opacity: 1; transform: translateY(0); }
.choice:hover:not(.dim):not(.selected) {
  border-color: rgba(196,146,42,0.4);
  color: #b89848;
  background: rgba(196,146,42,0.02);
}
.choice .n { color: #c4922a; min-width: 14px; font-weight: bold; flex-shrink: 0; }
.choice.selected {
  border-color: #c4922a;
  color: #c4922a;
  background: rgba(196,146,42,0.04);
}
.choice.dim { opacity: 0.15; pointer-events: none; }

/* ── NEXT BUTTON ── */
.next-btn {
  background: transparent;
  border: 1px solid #131b28;
  color: #4a5a68;
  padding: 0.875rem 1.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: border-color 0.2s, color 0.2s, opacity 0.4s;
  width: 100%;
  display: none;
  text-transform: uppercase;
  opacity: 0;
}
.next-btn.visible { opacity: 1; }
.next-btn:hover { border-color: #c4922a; color: #c4922a; }
.next-btn.final { border-color: #c4922a; color: #c4922a; }

/* ── MIRROR PHASE ── */
.mirror-wrap { display: none; }
.mirror-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  opacity: 0;
  transition: opacity 0.8s;
}
.mirror-header.visible { opacity: 1; }
.mirror-label {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.5em;
  color: #1e2d40;
  text-transform: uppercase;
  flex: 1;
}

/* Mirror text — paragraph-by-paragraph reveal */
.mirror-text {
  margin-bottom: 3rem;
  min-height: 40px;
}
.mirror-para {
  font-size: 1.0625rem;
  line-height: 2;
  color: #8a97a8;
  white-space: pre-wrap;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  margin-bottom: 1.25em;
}
.mirror-para.visible { opacity: 1; transform: translateY(0); }
.mirror-para.typing::after {
  content: '\u258a';
  animation: blink 0.9s step-start infinite;
  color: #c4922a;
  font-size: 0.85em;
  vertical-align: middle;
}
.mirror-para.hidden-door { color: #9ab0a8; }

/* Mirror question — word by word */
.mirror-question {
  font-family: 'Courier New', monospace;
  font-size: 0.825rem;
  color: #c4922a;
  border-left: 2px solid rgba(196,146,42,0);
  padding: 1rem 1.25rem;
  margin-bottom: 3rem;
  line-height: 1.75;
  transition: border-color 1s ease;
}
.mirror-question.border-on { border-left-color: #c4922a; }
.mirror-question.hidden-door { color: #7ab09a; }
.mirror-question.hidden-door.border-on { border-left-color: #7ab09a; }
.q-word {
  display: inline;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.q-word.visible { opacity: 1; }

/* ── PROFILE CARD — assembled piece by piece ── */
.profile-card {
  display: none;
  border: 1px solid #0d1420;
  padding: 2rem;
  margin-top: 2rem;
}
.profile-label {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  color: #1a2030;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  opacity: 0;
  transition: opacity 0.5s;
}
.profile-label.visible { opacity: 1; }
.profile-pattern {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #c4922a;
  letter-spacing: 0.08em;
  margin-bottom: 0.625rem;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.profile-pattern.visible { opacity: 1; transform: translateY(0); }
.profile-description {
  font-size: 0.8rem;
  color: #4a5a68;
  line-height: 1.75;
  margin-bottom: 1.75rem;
  opacity: 0;
  transition: opacity 0.7s ease 0.15s;
}
.profile-description.visible { opacity: 1; }

/* Signal bars */
.signal-bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  margin-bottom: 1.75rem;
  padding: 1.25rem;
  border: 1px solid #0a1018;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.signal-bars.visible { opacity: 1; }
.signal-label-row {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  grid-column: 1 / -1;
}
.signal-item { display: flex; flex-direction: column; gap: 0.375rem; }
.signal-name {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #253545;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.signal-bar-track {
  height: 2px;
  background: #0a1018;
  position: relative;
  overflow: hidden;
}
.signal-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #8a6018, #c4922a);
  width: 0%;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Command log */
.profile-record { margin-bottom: 1.75rem; }
.record-label {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
  opacity: 0;
  transition: opacity 0.4s;
}
.record-label.visible { opacity: 1; }
.record-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #0a1018;
  align-items: start;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.record-item:last-child { border-bottom: none; }
.record-item.visible { opacity: 1; transform: translateX(0); }
.record-n {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #1e2d40;
  padding-top: 0.15rem;
}
.record-scene {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.25rem;
}
.record-choice-text {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #3a4a5a;
  line-height: 1.5;
}

/* Tags */
.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.tag {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #253545;
  border: 1px solid #0d1420;
  padding: 0.25rem 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transform: scale(0.94);
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.tag.visible { opacity: 1; transform: scale(1); }

/* Actions */
.profile-actions {
  display: flex;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.5s;
}
.profile-actions.visible { opacity: 1; }
.action-btn {
  background: transparent;
  border: 1px solid #131b28;
  color: #4a5a68;
  padding: 0.75rem 1.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: border-color 0.2s, color 0.2s;
  flex: 1;
  text-transform: uppercase;
}
.action-btn:hover { border-color: #c4922a; color: #c4922a; }
.action-btn.primary { border-color: #c4922a; color: #c4922a; }

/* ── RESPONSIVE ── */
@media (max-width: 720px) {
  body { padding: 1.5rem 1rem; }
  .game-layout { flex-direction: column; gap: 2.5rem; }
  .main-col { max-width: 100%; }
  .log-panel {
    width: 100%;
    position: static;
    max-height: none;
    border-top: 1px solid #0d1420;
    padding-top: 1.75rem;
  }
  .log-entries { max-height: 260px; }
  .signal-bars { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<!-- Transition overlay -->
<div id="flash"></div>

<div class="game-layout">
  <div class="main-col">

    <div class="ship-header">
      <div class="ship-designation">ISV KESTREL</div>
      <div class="ship-voyage">CALLUM STATION \u2192 MERIDIAN  \u00b7  VOYAGE 14</div>
    </div>

    <!-- GAME PHASE -->
    <div id="game-phase">
      <div class="progress" id="progress"></div>
      <div class="scene-header">
        <div class="scene-name" id="scene-name"></div>
        <div class="scene-location" id="scene-location"></div>
        <button class="skip-btn" id="skip-btn">SKIP \u203a</button>
      </div>
      <div id="scene" class="scene"></div>
      <div id="choices" class="choices"></div>
      <button id="next-btn" class="next-btn">CONTINUE</button>
    </div>

    <!-- MIRROR PHASE -->
    <div id="mirror-phase" class="mirror-wrap">
      <div class="mirror-header" id="mirror-header">
        <div class="mirror-label">THE MIRROR</div>
        <button class="skip-btn" id="skip-mirror-btn">SKIP \u203a</button>
      </div>
      <div id="mirror-text" class="mirror-text"></div>
      <div class="mirror-question" id="mirror-question"></div>
      <div class="profile-card" id="profile-card">
        <div class="profile-label" id="profile-label">COMMAND PROFILE \u2014 ISV KESTREL</div>
        <div class="profile-pattern" id="profile-pattern"></div>
        <div class="profile-description" id="profile-description"></div>
        <div class="signal-bars" id="signal-bars">
          <div class="signal-label-row">SIGNAL AXES</div>
          <div class="signal-item">
            <div class="signal-name">DISCLOSURE</div>
            <div class="signal-bar-track"><div class="signal-bar-fill" id="bar-D"></div></div>
          </div>
          <div class="signal-item">
            <div class="signal-name">CONTAINMENT</div>
            <div class="signal-bar-track"><div class="signal-bar-fill" id="bar-C"></div></div>
          </div>
          <div class="signal-item">
            <div class="signal-name">DELEGATION</div>
            <div class="signal-bar-track"><div class="signal-bar-fill" id="bar-G"></div></div>
          </div>
          <div class="signal-item">
            <div class="signal-name">PROTOCOL</div>
            <div class="signal-bar-track"><div class="signal-bar-fill" id="bar-P"></div></div>
          </div>
        </div>
        <div class="profile-record">
          <div class="record-label" id="record-label">Command Log \u00b7 Voyage 14</div>
          <div id="profile-choices"></div>
        </div>
        <div class="profile-tags" id="profile-tags"></div>
        <div class="profile-actions" id="profile-actions">
          <button class="action-btn primary" id="btn-again">RUN AGAIN</button>
          <button class="action-btn" id="btn-share">COPY PROFILE</button>
        </div>
      </div>
    </div>

  </div>

  <!-- LOG PANEL -->
  <div class="log-panel">
    <div class="log-panel-header">
      <div class="log-panel-title">SHIP\u2019S LOG</div>
      <div class="log-panel-sub">ISV KESTREL \u00b7 VOYAGE 14</div>
    </div>
    <div class="log-entries" id="log-entries">
      <div class="log-empty" id="log-empty">\u2014 awaiting first entry \u2014</div>
    </div>
  </div>
</div>

<script>
var SCENES    = ${JSON.stringify(SCENES)}
var SIGNAL_MAP = ${JSON.stringify(SIGNAL_MAP)}
var CREW_DISPLAY = { dekker:'EMMET DEKKER', mara:'MARA OKAFOR', yuna:'YUNA CHO', rhen:'TOMAS RHEN', none:null }

var state = { scene:0, choices:[], choiceHistory:[], logs:[], scores:{D:0,C:0,G:0,P:0}, phase:'idle' }
var typingAbort = false
var activeParaEl = null

// ── FLASH TRANSITION ──
function flashTransition(cb) {
  var f = document.getElementById('flash')
  f.classList.add('on')
  setTimeout(function() {
    if (cb) cb()
    setTimeout(function() { f.classList.remove('on') }, 80)
  }, 220)
}

// ── SKIP ──
function onSkip() {
  typingAbort = true
  if (activeParaEl) { activeParaEl.textContent = activeParaEl._fullText || activeParaEl.textContent; activeParaEl.classList.remove('typing') }
}
document.getElementById('skip-btn').addEventListener('click', onSkip)
document.getElementById('skip-mirror-btn').addEventListener('click', onSkip)
function showSkip() { document.getElementById('skip-btn').classList.add('visible'); document.getElementById('skip-mirror-btn').classList.add('visible') }
function hideSkip() { document.getElementById('skip-btn').classList.remove('visible'); document.getElementById('skip-mirror-btn').classList.remove('visible') }

// ── TYPE into a paragraph element ──
function typePara(el, text, speed, done) {
  el._fullText = text
  el.textContent = ''
  el.classList.add('typing')
  typingAbort = false
  activeParaEl = el
  showSkip()
  var i = 0, chars = text.split('')
  function tick() {
    if (typingAbort) {
      el.textContent = text; el.classList.remove('typing')
      activeParaEl = null; hideSkip()
      if (done) setTimeout(done, 60)
      return
    }
    if (i >= chars.length) {
      el.classList.remove('typing'); activeParaEl = null; hideSkip()
      if (done) setTimeout(done, 200)
      return
    }
    el.textContent += chars[i]; i++
    var ch = chars[i-1]
    var delay = ch === '\\n' ? 60 : ch === '.' || ch === '\u2014' ? speed * 2.4 : speed
    setTimeout(tick, delay)
  }
  tick()
}

// ── LOG PANEL ──
function appendLogEntry(sceneName, crewFocus, text, pending) {
  var emp = document.getElementById('log-empty')
  if (emp) emp.style.display = 'none'
  var entries = document.getElementById('log-entries')
  var item = document.createElement('div')
  item.className = 'log-entry-item' + (pending ? ' pending' : ' resolved')
  var crewName = CREW_DISPLAY[crewFocus] || null
  item.innerHTML =
    '<div class="log-entry-meta">' +
      '<span class="log-entry-scene">' + sceneName + '</span>' +
      (crewName ? '<span class="log-entry-crew">' + crewName + '</span>' : '') +
    '</div><div class="log-entry-text">' + (text||'') + '</div>'
  entries.appendChild(item)
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ item.classList.add('show') }) })
  setTimeout(function(){ entries.scrollTop = entries.scrollHeight }, 60)
  return item
}
function updateLogEntry(item, text) {
  item.classList.remove('pending'); item.classList.add('resolved')
  var el = item.querySelector('.log-entry-text'); if (el) el.textContent = text
}

// ── PROGRESS ──
function updateProgress() {
  var el = document.getElementById('progress'); el.innerHTML = ''
  SCENES.forEach(function(_,i) {
    var pip = document.createElement('div')
    pip.className = 'pip' + (i < state.scene ? ' done' : i === state.scene ? ' active' : '')
    el.appendChild(pip)
  })
}

// ── SCENE TEXT VARIANT ──
function getSceneText(idx) {
  var s = SCENES[idx], h = state.choiceHistory
  if (!s.textVariant) return s.text
  if (s.id === 'yuna_asks' && h.some(function(x){ return x.sceneId==='changed_course' && x.choiceIndex===0 })) return s.textVariant.maraKnows
  if (s.id === 'rehns_information' && h.some(function(x){ return x.sceneId==='changed_course' && x.choiceIndex===2 }) && h.some(function(x){ return x.sceneId==='yuna_asks' && x.choiceIndex===1 })) return s.textVariant.rhenisCool
  if (s.id === 'container' && h.some(function(x){ return x.sceneId==='changed_course' && x.choiceIndex===0 }) && h.some(function(x){ return x.sceneId==='yuna_asks' && x.choiceIndex===0 })) return s.textVariant.maraStepsIn
  if (s.id === 'dekkers_price' && h.some(function(x){ return x.sceneId==='dekkers_find' && x.choiceIndex===3 })) return s.textVariant.dekkerOperative
  return s.text
}

// ── RENDER SCENE (with flash on re-entry) ──
function renderScene(withFlash) {
  function doRender() {
    var s = SCENES[state.scene]
    updateProgress()

    // Re-animate header
    var header = document.querySelector('.scene-header')
    header.style.animation = 'none'
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ header.style.animation = '' })
    })

    document.getElementById('scene-name').textContent = s.name
    document.getElementById('scene-location').textContent = s.location || ''

    var sceneEl = document.getElementById('scene')
    var choicesEl = document.getElementById('choices')
    var nextBtn = document.getElementById('next-btn')

    sceneEl.textContent = ''
    choicesEl.innerHTML = ''
    nextBtn.style.display = 'none'
    nextBtn.classList.remove('visible','final')
    state.phase = 'typing'

    typePara(sceneEl, getSceneText(state.scene), 15, function() {
      state.phase = 'choosing'
      s.choices.forEach(function(c, i) {
        var btn = document.createElement('button')
        btn.className = 'choice'
        btn.innerHTML = '<span class="n">' + (i+1) + '</span><span>' + c + '</span>'
        btn.addEventListener('click', function(){ choose(i, c) })
        choicesEl.appendChild(btn)
        // Stagger in
        setTimeout(function(){
          requestAnimationFrame(function(){ btn.classList.add('visible') })
        }, i * 90)
      })
    })
  }

  if (withFlash) flashTransition(doRender)
  else doRender()
}

// ── CHOOSE ──
function choose(idx, text) {
  if (state.phase !== 'choosing') return
  state.phase = 'waiting'

  var btns = document.querySelectorAll('.choice')
  btns.forEach(function(b, i) {
    if (i !== idx) b.classList.add('dim')
    else b.classList.add('selected')
  })

  var s = SCENES[state.scene]
  state.choices.push({ scene:s.id, sceneName:s.name, location:s.location, crewFocus:s.crewFocus, choiceIndex:idx, choice:text })
  state.choiceHistory.push({ sceneId:s.id, choiceIndex:idx, choiceText:text })

  var sm = SIGNAL_MAP[s.id]
  if (sm && sm[idx]) { var w=sm[idx]; state.scores.D+=w[0]; state.scores.C+=w[1]; state.scores.G+=w[2]; state.scores.P+=w[3] }

  var logItem = appendLogEntry(s.name, s.crewFocus, '\u2014', true)
  var priorLogs = state.logs.slice(-3).join(' | ')

  fetch('/read', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ scene:s.id, sceneName:s.name, location:s.location, crewFocus:s.crewFocus, choice:text, choiceNumber:state.choices.length, priorLogs:priorLogs })
  })
  .then(function(r){ return r.json() })
  .then(function(d){ updateLogEntry(logItem, d.log); state.logs.push(d.log) })
  .catch(function(){ var f='SHIP LOG \u2014 Entry recorded.'; updateLogEntry(logItem,f); state.logs.push(f) })
  .finally(function(){
    var isLast = state.scene >= SCENES.length - 1
    var nb = document.getElementById('next-btn')
    nb.textContent = isLast ? 'SEE WHAT THE MIRROR SEES' : 'CONTINUE \u2192'
    nb.style.display = 'block'
    if (isLast) nb.classList.add('final')
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ nb.classList.add('visible') }) })
    state.phase = 'done'
  })
}

// ── NEXT ──
document.getElementById('next-btn').addEventListener('click', function() {
  state.scene++
  if (state.scene >= SCENES.length) {
    flashTransition(showMirror)
  } else {
    renderScene(true)
  }
})

// ── MIRROR — paragraph-by-paragraph reveal ──
function showMirror() {
  document.getElementById('game-phase').style.display = 'none'
  var mp = document.getElementById('mirror-phase')
  mp.style.display = 'block'

  var hidden = state.scores.D >= 10 && state.scores.G >= 10

  // Fade in mirror label
  setTimeout(function(){
    document.getElementById('mirror-header').classList.add('visible')
  }, 300)

  Promise.all([
    fetch('/mirror', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ choices:state.choices, scores:state.scores }) }).then(function(r){ return r.json() }),
    fetch('/profile', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ choices:state.choices, logs:state.logs, scores:state.scores }) }).then(function(r){ return r.json() })
  ]).then(function(results) {
    var mirrorData = results[0], profileData = results[1]
    var question = getMirrorQuestion(state.scores)

    setTimeout(function() {
      revealMirrorText(mirrorData.reflection, hidden, function() {
        revealQuestion(question, hidden, function() {
          setTimeout(function(){ assembleProfile(profileData) }, 1800)
        })
      })
    }, 800)
  }).catch(function() {
    var p = document.createElement('div')
    p.className = 'mirror-para visible'
    p.textContent = 'The mirror is still resolving.'
    document.getElementById('mirror-text').appendChild(p)
  })
}

// Split reflection into paragraphs, reveal each with typewriter
function revealMirrorText(text, hidden, done) {
  var container = document.getElementById('mirror-text')
  container.innerHTML = ''
  var paras = text.split(/\n\n+/).filter(function(p){ return p.trim() })

  function revealPara(i) {
    if (i >= paras.length) { if (done) setTimeout(done, 400); return }
    var el = document.createElement('div')
    el.className = 'mirror-para' + (hidden ? ' hidden-door' : '')
    container.appendChild(el)

    // Fade in the paragraph container first
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        el.classList.add('visible')
        setTimeout(function(){
          typePara(el, paras[i].trim(), 22, function(){
            setTimeout(function(){ revealPara(i+1) }, 320)
          })
        }, 150)
      })
    })
  }
  revealPara(0)
}

// Reveal question word by word
function revealQuestion(text, hidden, done) {
  var qEl = document.getElementById('mirror-question')
  qEl.innerHTML = ''
  if (hidden) qEl.classList.add('hidden-door')

  var words = text.split(' ')
  words.forEach(function(w) {
    var span = document.createElement('span')
    span.className = 'q-word'
    span.textContent = w + ' '
    qEl.appendChild(span)
  })

  var spans = qEl.querySelectorAll('.q-word')
  setTimeout(function(){
    qEl.classList.add('border-on')
    spans.forEach(function(sp, i){
      setTimeout(function(){
        sp.classList.add('visible')
        if (i === spans.length - 1) {
          setTimeout(function(){ if (done) done() }, 400)
        }
      }, i * 60)
    })
  }, 600)
}

// Assemble profile card piece by piece
function assembleProfile(data) {
  var card = document.getElementById('profile-card')
  card.style.display = 'block'

  var t = 0
  function at(delay, fn) { setTimeout(fn, t += delay) }

  at(0,   function(){ document.getElementById('profile-label').classList.add('visible') })
  at(300, function(){
    document.getElementById('profile-pattern').textContent = data.pattern || 'PATTERN UNRESOLVED'
    document.getElementById('profile-pattern').classList.add('visible')
  })
  at(400, function(){
    document.getElementById('profile-description').textContent = data.description || ''
    document.getElementById('profile-description').classList.add('visible')
  })
  at(500, function(){
    document.getElementById('signal-bars').classList.add('visible')
    var max = 16
    setTimeout(function(){
      document.getElementById('bar-D').style.width = Math.min(100,(state.scores.D/max)*100)+'%'
    }, 200)
    setTimeout(function(){
      document.getElementById('bar-C').style.width = Math.min(100,(state.scores.C/max)*100)+'%'
    }, 400)
    setTimeout(function(){
      document.getElementById('bar-G').style.width = Math.min(100,(state.scores.G/max)*100)+'%'
    }, 600)
    setTimeout(function(){
      document.getElementById('bar-P').style.width = Math.min(100,(state.scores.P/max)*100)+'%'
    }, 800)
  })
  at(1200, function(){
    document.getElementById('record-label').classList.add('visible')
    var choicesEl = document.getElementById('profile-choices')
    choicesEl.innerHTML = ''
    state.choices.forEach(function(c, i){
      var item = document.createElement('div')
      item.className = 'record-item'
      item.innerHTML =
        '<span class="record-n">' + (i+1) + '</span>' +
        '<div><span class="record-scene">' + (c.sceneName||c.scene) + '</span>' +
        '<span class="record-choice-text">' + c.choice + '</span></div>'
      choicesEl.appendChild(item)
      setTimeout(function(){ item.classList.add('visible') }, i * 120)
    })
  })
  at(state.choices.length * 120 + 200, function(){
    var tagsEl = document.getElementById('profile-tags')
    tagsEl.innerHTML = ''
    ;(data.tags || []).forEach(function(tag, i){
      var el = document.createElement('div')
      el.className = 'tag'
      el.textContent = tag
      tagsEl.appendChild(el)
      setTimeout(function(){ el.classList.add('visible') }, i * 100)
    })
  })
  at((data.tags||[]).length * 100 + 300, function(){
    document.getElementById('profile-actions').classList.add('visible')
  })
}

function getMirrorQuestion(scores) {
  if (scores.D >= 10 && scores.G >= 10)
    return "You told Mara Okafor everything, gave the bridge table the full picture, and at the end put it to the crew. What were you afraid you\u2019d have to carry if you hadn\u2019t?"
  if (scores.C >= 10 && scores.D <= 3)
    return "When Emmet Dekker asked you to tell him everything \u2014 what did you protect by not answering?"
  if (scores.P >= 8 && scores.C <= 4)
    return "You ran the protocol. Every time. What would have had to happen for you to break it?"
  if (scores.G >= 8 && scores.D >= 5)
    return "When Sable looked at you and not at the others \u2014 what did you feel in the moment before you decided?"
  if (scores.C >= 6 && scores.G >= 6)
    return "You kept some people close and kept others out. At the mess table \u2014 who were you actually protecting?"
  if (scores.D >= 8 && scores.G <= 4)
    return "You were transparent with your crew. And then you made the calls alone. What were you hoping they\u2019d do with the information?"
  return "At the mess table, when the Kestrel was waiting \u2014 what were you actually deciding?"
}

// ── RESTART ──
document.getElementById('btn-again').addEventListener('click', function(){
  state = { scene:0, choices:[], choiceHistory:[], logs:[], scores:{D:0,C:0,G:0,P:0}, phase:'idle' }
  flashTransition(function(){
    document.getElementById('mirror-phase').style.display = 'none'
    document.getElementById('profile-card').style.display = 'none'
    document.getElementById('profile-choices').innerHTML = ''
    document.getElementById('profile-tags').innerHTML = ''
    document.getElementById('mirror-question').innerHTML = ''
    document.getElementById('mirror-question').className = 'mirror-question'
    document.getElementById('mirror-text').innerHTML = ''
    document.getElementById('mirror-header').classList.remove('visible')
    ;['profile-label','profile-pattern','profile-description','signal-bars','record-label','profile-actions'].forEach(function(id){
      var el = document.getElementById(id); if(el){ el.classList.remove('visible'); if(id==='profile-pattern'||id==='profile-description') { el.textContent = '' } }
    })
    ;['bar-D','bar-C','bar-G','bar-P'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.width='0%' })
    document.getElementById('log-entries').innerHTML = '<div class="log-empty" id="log-empty">\u2014 awaiting first entry \u2014</div>'
    document.getElementById('game-phase').style.display = 'block'
    renderScene(false)
  })
})

// ── COPY PROFILE ──
document.getElementById('btn-share').addEventListener('click', function(){
  var pattern = document.getElementById('profile-pattern').textContent
  var tags = Array.from(document.querySelectorAll('.tag')).map(function(t){ return t.textContent }).join('  \u00b7  ')
  var axes = ['D:'+state.scores.D,'C:'+state.scores.C,'G:'+state.scores.G,'P:'+state.scores.P].join('  ')
  var nl = String.fromCharCode(10)
  var choices = state.choices.map(function(c,i){ return (i+1)+'. [' + (c.sceneName||c.scene) + '] ' + c.choice }).join(nl)
  var text = ['THE MIRROR // ISV KESTREL  \u00b7  VOYAGE 14','',pattern,tags,axes,'','COMMAND LOG:',choices,'','https://the-mirror-production-c93d.up.railway.app'].join(nl)
  navigator.clipboard.writeText(text).then(function(){
    var btn = document.getElementById('btn-share'), orig = btn.textContent
    btn.textContent = 'COPIED'; setTimeout(function(){ btn.textContent = orig }, 2000)
  })
})

// ── KEYBOARD ──
document.addEventListener('keydown', function(e){
  if (state.phase !== 'choosing') return
  var n = parseInt(e.key)
  if (n >= 1 && n <= 4) { var btns = document.querySelectorAll('.choice'); if(btns[n-1]) btns[n-1].click() }
})

renderScene(false)
</script>
</body>
</html>`

// ── SERVER ──
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const body = () => new Promise(r => { let d=''; req.on('data', c => d+=c); req.on('end', () => r(JSON.parse(d))) })

  if ((req.url === '/' || req.url === '/play') && req.method === 'GET') {
    res.writeHead(200, {'Content-Type':'text/html'}); res.end(HTML); return
  }

  if (req.url === '/read' && req.method === 'POST') {
    const { scene, sceneName, location, crewFocus, choice, choiceNumber, priorLogs } = await body()
    const crewFull = { dekker:'Emmet Dekker', mara:'Mara Okafor', yuna:'Yuna Cho', rhen:'Tomas Rhen', none:null }
    const crewRef = crewFull[crewFocus] || 'ship'
    const patternCtx = priorLogs ? `Prior log entries: ${priorLogs}\n\n` : ''
    try {
      const log = await ai(`You are the Ship's Log of the ISV Kestrel, hull KS-7714. Voice: The Expanse — terse, procedural, nautical-precise.\n\nWORLD CONTEXT:\n${WORLD}\n\n${patternCtx}Scene: ${sceneName} // ${location||''}\nCrew: ${crewRef}\nDecision ${choiceNumber}: "${choice}"\n\nOne log entry. If prior entries show a pattern forming (containment, disclosure, delegation, protocol) — name it as the second or third time. Specific. Use crew names, station names, ship systems. 2 sentences. Start with "SHIP LOG —". No moralizing.`, 170)
      res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ log }))
    } catch(e) { res.writeHead(200); res.end(JSON.stringify({ log:'SHIP LOG — Entry recorded.' })) }
    return
  }

  if (req.url === '/profile' && req.method === 'POST') {
    const { choices, logs, scores } = await body()
    const choiceList = choices.map((c,i) => `${i+1}. [${c.sceneName} // ${c.location}] ${c.choice}`).join('\n')
    const logList = (logs||[]).map((l,i) => `${i+1}. ${l}`).join('\n')
    const scoreCtx = scores ? `Signal scores — Disclosure:${scores.D} Containment:${scores.C} Delegation:${scores.G} Protocol:${scores.P}` : ''
    const hd = scores && scores.D >= 10 && scores.G >= 10
    try {
      const raw = await ai(`You have observed a captain make eight decisions aboard the ISV Kestrel, voyage 14.\n\nWORLD CONTEXT:\n${WORLD}\n\n${scoreCtx}\n${hd?'NOTE: Hidden door run — maximum disclosure AND delegation. Profile should reflect this rarity.\n':''}Decisions:\n${choiceList}\n\nLog entries:\n${logList}\n\nReturn ONLY valid JSON (no markdown):\n{\n  "pattern": "2-4 word command pattern ALL CAPS",\n  "description": "One sentence. What this costs them as captain. Specific.",\n  "tags": ["3-5 ALL CAPS tags — may reference BELT PROTOCOL, ARETO LEVERAGE, MCRN SHADOW, CALLUM SILENCE, MERIDIAN CALCULUS, DISCLOSURE REFLEX, CONTAINMENT INSTINCT, CREW COUNCIL, OPEN HAND, etc"]\n}`, 240)
      const clean = raw.replace(/^```[a-z]*\n?/i,'').replace(/\n?```$/i,'').trim()
      res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify(JSON.parse(clean)))
    } catch(e) { res.writeHead(200); res.end(JSON.stringify({ pattern:'PATTERN UNRESOLVED', description:'Insufficient data.', tags:[] })) }
    return
  }

  if (req.url === '/mirror' && req.method === 'POST') {
    const { choices, scores } = await body()
    const choiceList = choices.map((c,i) => `${i+1}. [${c.sceneName}] ${c.choice}`).join('\n')
    const hd = scores && scores.D >= 10 && scores.G >= 10
    const scoreCtx = scores ? `Signal scores — Disclosure:${scores.D} Containment:${scores.C} Delegation:${scores.G} Protocol:${scores.P}` : ''
    try {
      const reflection = await ai(`You are the ISV Kestrel, hull KS-7714. You have carried this captain through eight decisions on voyage 14.\n\nWORLD CONTEXT:\n${WORLD}\n\n${scoreCtx}\n${hd?'NOTE: This captain was unusually transparent and delegating. Rare. Acknowledge without flattery — name what it cost or reveals.\n':''}Their decisions:\n${choiceList}\n\nWrite a reflection:\n- Speak as the ship to the captain ("You")\n- Name the pattern across all eight — not each one\n- Reference one moment: full crew name or location\n- Say something the choices confirm but they haven't said\n- 4-6 sentences\n- Do NOT start with "You are"\n- Do NOT moralize\n- Voice: The Expanse — terse, specific, understated\n- Separate paragraphs with blank lines (\\n\\n)\n- Read like a ship that has been watching and finally speaks`, 450)
      res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify({ reflection }))
    } catch(e) { res.writeHead(200); res.end(JSON.stringify({ reflection:'The mirror is still forming.' })) }
    return
  }

  res.writeHead(404); res.end()
})

server.listen(PORT, '0.0.0.0', () => console.log(`ISV Kestrel online — http://0.0.0.0:${PORT}`))
