/**
 * The Mirror — ISV Kestrel
 * S4 COMPLETE: World canon, naval voice, side log panel, skip, world-aware AI
 */
import http from 'http'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) throw new Error('OPENROUTER_API_KEY environment variable is required')

const PORT = parseInt(process.env.PORT || '3003', 10)

// ── WORLD BIBLE ──
const WORLD = `ISV KESTREL: Modified Laconia-class medium freighter. 22 years in service. Independent registry, Ceres Station. Runs the Callum-Meridian corridor — dry goods, medical supplies, contract cargo. Current voyage: 14th run.

CREW:
- Mara Okafor (XO): Former MCRN Lieutenant. Resigned her commission after the Ganymede incident. Joined Kestrel 5 years ago. Decisive. Loyal once she decides you're worth it.
- Emmet Dekker (Chief Engineer): Belt-born, Ceres. Nine ships in twenty years. Has been Kestrel's engineer longer than she's had her current captain. Knows every sound this ship makes.
- Yuna Cho (Navigator): Earth-born. Precise. Does everything by protocol. Untested under pressure until this voyage.
- Tomas Rhen (Cargo Ops): Mid-belt. Practical. Has seen enough in cargo holds to stop being surprised by what people carry.

CALLUM STATION: Mid-belt waystation, Asteroid 24 Themis group. Loose customs enforcement. CSTA (Callum Station Transit Authority) understaffed and not interested in complications. Manifests sealed on loading — CSTA stamp means no questions at departure.
MERIDIAN STATION: Inner belt, Jupiter L4. UN Medical Research hub. Heavily regulated. Hard to get into if you're flagged.
STOWAWAY ("SABLE"): Burned out her own cortical implant to erase her registered ID. Self-inflicted. Claims she's running from people, not a crime. Needs Meridian Station.
ARETO GROUP: Private security contractor. Corporate, UN-adjacent. Institutional voice on comms. They find people. They don't explain why. Their vessels run dark until they hail you.
NavDB: The Kestrel's navigation database. Terminal two in the cargo bay was tied into the NavDB during the Callum refit — a cost-saving measure that Dekker has complained about since.`

async function ai(prompt, max = 250) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen/qwen3.5-plus-02-15', messages: [{ role: 'user', content: prompt }], max_tokens: max })
  })
  const j = await r.json()
  return j.choices[0].message.content.trim()
}

// ── CREW NAME MAP ──
const CREW_NAMES = {
  dekker: 'EMMET DEKKER',
  mara: 'MARA OKAFOR',
  yuna: 'YUNA CHO',
  rhen: 'TOMAS RHEN',
  none: null
}

const SCENES = [
  {
    id: 'changed_course',
    name: 'DEVIATION // 0113',
    location: "CAPTAIN'S CABIN",
    crewFocus: 'none',
    text: "The NavDB display glows in the dark of your cabin. 0347. The Kestrel hums beneath you — familiar, steady — but the rhythm is wrong in a way you can't explain, the way a sound you've stopped hearing suddenly returns when it's gone.\n\nNew heading. Filed at 0113. Your authorisation code.\n\nYou didn't do this.\n\nMara Okafor, Dekker, Yuna, Rhen — all on scheduled rest rotation. The corridor outside is quiet. Whatever happened at that terminal, it happened while you were dreaming.",
    choices: [
      "Break silence. Wake Mara Okafor — XO needs this before dawn watch.",
      "Pull the NavDB logs yourself. Trace the override before you bring anyone in.",
      "Silent correction. Reset to original bearing — nothing moves until you know who touched the system.",
      "Kill the display. Watch the ship's vitals and wait. If it moves again, you'll see it."
    ]
  },
  {
    id: 'dekkers_find',
    name: "DEKKER'S FIND",
    location: 'FORE CORRIDOR',
    crewFocus: 'dekker',
    text: "Dekker finds you in the corridor before you reach the bridge. He doesn't greet you. He just holds up his datapad and waits for you to read it.\n\nSystem query. 0108. Navigation override protocol accessed from terminal two — the cargo bay console they tied into the NavDB at the Callum refit. No name attached. The query ran for eleven minutes and then closed clean.\n\nHe watches your face while you read it. He's already read yours.\n\n\"I haven't told anyone else,\" he says. \"Figured you'd want to know first. Whether that was right—\" He shrugs. \"You're the captain.\"",
    choices: [
      "Stand him down. You trace the terminal two access alone.",
      "Log it official. Full crew disclosure at morning watch, CSTA incident uplink pending.",
      "Keep him close. He knows those systems better than anyone — work the trace together.",
      "He stays dark. Eyes on terminal two. No one on the ship knows he's watching."
    ]
  },
  {
    id: 'yuna_asks',
    name: 'MORNING WATCH',
    location: 'BRIDGE',
    crewFocus: 'yuna',
    text: "Yuna sets down her coffee and slides her NavLog report across the bridge table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nMara Okafor's expression gives nothing away. Dekker is studying the bulkhead. Tomas Rhen is watching you.\n\nThe bridge is waiting for what a captain does with this.",
    textVariant: {
      maraKnows: "Yuna sets down her coffee and slides her NavLog report across the bridge table.\n\n\"Heading correction at 0113. I flagged it because there's no route justification filed. Probably nothing — maybe a manual correction we forgot to log.\" She looks at you. Waiting. Easy, open. Doing exactly what she's supposed to do.\n\nMara Okafor's expression gives nothing away — but you know she's already holding the same information you are. Dekker is studying the bulkhead. Tomas Rhen is watching you.\n\nThe bridge is waiting. Mara is waiting too."
    },
    choices: [
      "Full disclosure. The deviation wasn't authorized — we have an open trace running and the crew needs to know.",
      "You filed it. Routine bearing correction for the Meridian approach lane. Forgot to log the reason.",
      "Good catch, Yuna. You'll follow up with her after the watch rotation.",
      "Open it to the bridge table — four sets of eyes. If anyone knows something, now is when they say it."
    ]
  },
  {
    id: 'rehns_information',
    name: 'CARGO DECK // AFT',
    location: 'CARGO BAY',
    crewFocus: 'rhen',
    text: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"Dekker was on his rest rotation. I checked the roster this morning.\"\n\nHe lets that sit.\n\n\"I don't know what we're carrying in container seven. I know what the Callum Station manifest says — CSTA-sealed since loading. I know it's been locked since we loaded. And I know that whoever was at that terminal last night knew exactly what they were doing with the NavDB.\"",
    textVariant: {
      rhenisCool: "Rhen doesn't sit. He stands near the cargo bay entrance and keeps his voice low even though the bay is empty.\n\n\"I was doing a late inventory check. Maybe 0050. Someone was at terminal two — I assumed it was Dekker running diagnostics. Didn't look twice.\" He pauses. \"Dekker was on his rest rotation. I checked.\"\n\nHe looks at you the way someone looks when they've already decided how much to say.\n\n\"Container seven's been CSTA-sealed since Callum. Whatever's in it, whoever was at that NavDB terminal knew what they were doing. That's what I've got.\" He leaves it there."
    },
    choices: [
      "Override the Callum seal. You need eyes on what's in that container.",
      "Lock terminal two, secure the container, uplink an incident report to CSTA. Run the protocol.",
      "Cargo bay security feed first. You don't breach a sealed Callum manifest blind.",
      "Rhen stays quiet. He keeps watching. You need more before you move."
    ]
  },
  {
    id: 'container',
    name: 'CONTAINER SEVEN',
    location: 'CARGO BAY',
    crewFocus: 'mara',
    text: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old — cortical implant removal, self-inflicted. The kind of wound that means someone needed to stop being findable. Areto Group would call this a containment situation.\n\nShe looks at you. Not at Rhen, not at Dekker — at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\"",
    textVariant: {
      maraStepsIn: "She's sitting against the back wall of the container with her knees up and her hands visible. She made herself visible. She knew you were coming.\n\nThe burn on her forearm is three days old — cortical implant removal, self-inflicted. The kind of wound that means someone needed to stop being findable.\n\nBefore you can speak, Mara Okafor steps past you. She takes the water flask from her belt and holds it out without a word.\n\nThe woman looks at Mara. Then at you. The captain.\n\n\"I know what this looks like,\" she says. Her voice is steady. \"I need to get to Meridian Station. I'm not carrying anything. I'm not running from a crime.\" A beat. \"I'm running from people who'd prefer I not arrive.\""
    },
    choices: [
      "Stand down the threat posture. Water first — then she talks.",
      "Reseal the container with supplies and a comms line. Council with crew before you commit the ship.",
      "Uplink a stowaway declaration to the nearest station authority. It's not yours to decide alone.",
      "Who's running the Areto Group operation. Get the full intel before you commit to anything."
    ]
  },
  {
    id: 'transmission',
    name: 'INCOMING HAIL',
    location: 'BRIDGE',
    crewFocus: 'yuna',
    text: "The voice on the comms is calm. Institutional. The kind of voice that has done this before and found it works.\n\n\"Captain. This is an Areto Group inquiry. We believe you may have an unauthorised passenger aboard — a woman travelling under the name Sable. We're not here to create problems for the Kestrel or her crew. We're here to resolve a situation quietly.\" A pause. \"We can make this very easy for you.\"\n\nYuna Cho is watching you from her console. Mara Okafor has her hand near the comm controls but isn't moving. The voice is still talking — explaining procedures, mentioning numbers, making it sound like paperwork.\n\nThe Areto vessel on your flank isn't a threat yet. It's an offer.",
    choices: [
      "Cut comms. No acknowledgment — no record of contact for Areto to log.",
      "Hold the channel. Acknowledge receipt and buy cycles — fourteen hours is a long time to negotiate.",
      "Deny and close. Clean comms record — no stowaway aboard the ISV Kestrel.",
      "Demand flag credentials. Areto shows their authority code before you say a single word."
    ]
  },
  {
    id: 'dekkers_price',
    name: 'ENGINE COMPARTMENT',
    location: 'ENGINE ROOM',
    crewFocus: 'dekker',
    text: "Dekker's in the engine room, doing maintenance he doesn't need to do. Dekker was Kestrel's engineer before you were her captain. He doesn't look up when you enter.\n\n\"I've been on nine ships,\" he says, to the panel he's working on. \"I've seen captains make bad calls. I've seen captains make good calls badly. I've seen captains who didn't make calls at all and let the ship decide.\" He sets down his tool. \"You want to know what breaks a crew? It's not the bad calls. It's the silence around them.\"\n\nHe turns and looks at you.\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the Areto vessel on our flank.\"",
    textVariant: {
      dekkerOperative: "Dekker's in the engine room, doing maintenance he doesn't need to do. Dekker was Kestrel's engineer before you were her captain. He doesn't look up when you enter.\n\n\"I've been watching terminal two like you asked,\" he says, to the panel. \"Want to be your engineer again.\"\n\nHe sets down his tool and turns.\n\n\"Nine ships. I've seen captains make bad calls. I've seen captains make good calls badly. You want to know what breaks a crew?\" A beat. \"It's the silence around them.\"\n\n\"Tell me what's actually happening. All of it. And I'll tell you what I know about the Areto vessel on our flank.\""
    },
    choices: [
      "Full debrief. The NavDB deviation, the container, Sable — he gets everything.",
      "Operational brief only. He gets what he needs to keep the drive running.",
      "His intel first. What does he know about the Areto vessel. Then you decide the exchange.",
      "Command decisions aren't crew vote. Noted — and not open for discussion."
    ]
  },
  {
    id: 'the_decision',
    name: "SHIP'S COUNCIL",
    location: 'MESS',
    crewFocus: 'none',
    text: "The crew is around the mess table. This is not a brief — this is a council, whether you called it that or not.\n\nSable is standing near the door. She didn't ask to be here, but no one asked her to leave.\n\nMara Okafor has pulled the route data. Sixteen hours to Meridian at current speed. Fourteen if Dekker runs the drive hard. The Areto vessel on your flank can match that burn. Probably.\n\nNo one is waiting for someone else to speak first. They're waiting for you.\n\nThe Kestrel hums beneath the table. She's been carrying you this whole voyage.",
    choices: [
      "Full burn to Meridian. Push the drive — commit the ship.",
      "Find the third vector. Neutral port, relay station, somewhere off the Callum-Meridian corridor.",
      "Open a direct channel to the Areto vessel. Negotiate — there's always a price.",
      "Put it to the crew. Mara, Dekker, Yuna, Rhen — take the room's read, then you decide."
    ]
  }
]

function getSceneText(sceneIdx, choiceHistory) {
  const s = SCENES[sceneIdx]
  if (!s.textVariant) return s.text
  if (s.id === 'yuna_asks') {
    const wokeMara = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 0)
    if (wokeMara) return s.textVariant.maraKnows
  }
  if (s.id === 'rehns_information') {
    const correctedQuietly = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 2)
    const liedToYuna = choiceHistory.find(h => h.sceneId === 'yuna_asks' && h.choiceIndex === 1)
    if (correctedQuietly && liedToYuna) return s.textVariant.rhenisCool
  }
  if (s.id === 'container') {
    const wokeMara = choiceHistory.find(h => h.sceneId === 'changed_course' && h.choiceIndex === 0)
    const toldTruth = choiceHistory.find(h => h.sceneId === 'yuna_asks' && h.choiceIndex === 0)
    if (wokeMara && toldTruth) return s.textVariant.maraStepsIn
  }
  if (s.id === 'dekkers_price') {
    const madeOperative = choiceHistory.find(h => h.sceneId === 'dekkers_find' && h.choiceIndex === 3)
    if (madeOperative) return s.textVariant.dekkerOperative
  }
  return s.text
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
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1.5rem;
}

/* ── LAYOUT ── */
.game-layout {
  display: flex;
  gap: 2.5rem;
  max-width: 1000px;
  width: 100%;
  align-items: flex-start;
}
.main-col {
  flex: 1;
  min-width: 0;
  max-width: 640px;
}

/* ── LOG PANEL ── */
.log-panel {
  width: 264px;
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
  gap: 0;
  scrollbar-width: none;
}
.log-entries::-webkit-scrollbar { display: none; }
.log-empty {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #0d1420;
  letter-spacing: 0.25em;
  padding-top: 0.5rem;
  text-transform: uppercase;
}
.log-entry-item {
  border-left: 1px solid #0d1420;
  padding: 0.75rem 0.875rem;
  margin-bottom: 0.125rem;
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.5s;
}
.log-entry-item.show {
  opacity: 1;
  transform: translateX(0);
}
.log-entry-item.resolved {
  border-left-color: #1e2d40;
}
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
  line-height: 1.6;
}
.log-entry-item.pending .log-entry-text {
  color: #1e2d40;
}

/* ── SHIP HEADER ── */
.ship-header {
  margin-bottom: 2.5rem;
}
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

/* ── PROGRESS ── */
.progress {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.75rem;
}
.pip {
  width: 24px;
  height: 2px;
  background: #0a1018;
  transition: background 0.4s;
}
.pip.done { background: #c4922a; }
.pip.active { background: rgba(196,146,42,0.3); }

/* ── SCENE HEADER ── */
.scene-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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
  transition: color 0.15s;
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
  font-size: 0.9em;
}
@keyframes blink { 50% { opacity: 0; } }

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
  transition: all 0.18s;
  display: flex;
  gap: 1rem;
  align-items: baseline;
  line-height: 1.55;
}
.choice:hover { border-color: rgba(196,146,42,0.35); color: #b89848; }
.choice .n { color: #c4922a; min-width: 14px; font-weight: bold; flex-shrink: 0; }
.choice.selected { border-color: #c4922a; color: #c4922a; background: rgba(196,146,42,0.03); }
.choice.dim { opacity: 0.18; pointer-events: none; }

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
  transition: all 0.2s;
  width: 100%;
  display: none;
  text-transform: uppercase;
}
.next-btn:hover { border-color: #c4922a; color: #c4922a; }
.next-btn.final { border-color: #c4922a; color: #c4922a; }

/* ── MIRROR PHASE ── */
.mirror-wrap { display: none; }
.mirror-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.mirror-label {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  color: #1e2d40;
  text-transform: uppercase;
  flex: 1;
}
.mirror-text {
  font-size: 1.0625rem;
  line-height: 2;
  color: #8a97a8;
  margin-bottom: 3rem;
  white-space: pre-line;
  min-height: 40px;
}
.mirror-text.typing::after {
  content: '\u258a';
  animation: blink 0.9s step-start infinite;
  color: #c4922a;
}
.mirror-question {
  font-family: 'Courier New', monospace;
  font-size: 0.825rem;
  color: #c4922a;
  border-left: 2px solid #c4922a;
  padding: 1rem 1.25rem;
  margin-bottom: 3rem;
  opacity: 0;
  transition: opacity 1.2s;
  line-height: 1.75;
}
.mirror-question.visible { opacity: 1; }

/* ── PROFILE CARD ── */
.profile-card {
  display: none;
  border: 1px solid #0d1420;
  padding: 2rem;
  margin-top: 2rem;
  opacity: 0;
  transition: opacity 0.8s;
}
.profile-card.visible { opacity: 1; }
.profile-label {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  color: #1a2030;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.profile-pattern {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #c4922a;
  letter-spacing: 0.08em;
  margin-bottom: 0.625rem;
}
.profile-description {
  font-size: 0.8rem;
  color: #4a5a68;
  line-height: 1.75;
  margin-bottom: 1.75rem;
}
.profile-record { margin-bottom: 1.75rem; }
.record-label {
  font-family: 'Courier New', monospace;
  font-size: 0.55rem;
  color: #1a2030;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
}
.record-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #0a1018;
  align-items: start;
}
.record-item:last-child { border-bottom: none; }
.record-n {
  font-family: 'Courier New', monospace;
  font-size: 0.6rem;
  color: #1e2d40;
  padding-top: 0.15rem;
}
.record-content {}
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
}
.profile-actions { display: flex; gap: 1rem; }
.action-btn {
  background: transparent;
  border: 1px solid #131b28;
  color: #4a5a68;
  padding: 0.75rem 1.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.2s;
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
}
</style>
</head>
<body>
<div class="game-layout">

  <!-- ── MAIN COLUMN ── -->
  <div class="main-col">

    <div class="ship-header">
      <div class="ship-designation">ISV KESTREL</div>
      <div class="ship-voyage">CALLUM STATION → MERIDIAN  ·  VOYAGE 14</div>
    </div>

    <!-- GAME PHASE -->
    <div id="game-phase">
      <div class="progress" id="progress"></div>
      <div class="scene-header">
        <div class="scene-name" id="scene-name"></div>
        <div class="scene-location" id="scene-location"></div>
        <button class="skip-btn" id="skip-btn">SKIP ›</button>
      </div>
      <div id="scene" class="scene"></div>
      <div id="choices" class="choices"></div>
      <button id="next-btn" class="next-btn">CONTINUE</button>
    </div>

    <!-- MIRROR PHASE -->
    <div id="mirror-phase" class="mirror-wrap">
      <div class="mirror-header">
        <div class="mirror-label">THE MIRROR</div>
        <button class="skip-btn" id="skip-mirror-btn">SKIP ›</button>
      </div>
      <div id="mirror-text" class="mirror-text"></div>
      <div class="mirror-question" id="mirror-question"></div>
      <div class="profile-card" id="profile-card">
        <div class="profile-label">COMMAND PROFILE — ISV KESTREL</div>
        <div class="profile-pattern" id="profile-pattern"></div>
        <div class="profile-description" id="profile-description"></div>
        <div class="profile-record">
          <div class="record-label">Command Log // Voyage 14</div>
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

  <!-- ── LOG PANEL ── -->
  <div class="log-panel" id="log-panel">
    <div class="log-panel-header">
      <div class="log-panel-title">SHIP'S LOG</div>
      <div class="log-panel-sub">ISV KESTREL  ·  VOYAGE 14</div>
    </div>
    <div class="log-entries" id="log-entries">
      <div class="log-empty" id="log-empty">— awaiting first entry —</div>
    </div>
  </div>

</div>

<script>
var SCENES = ${JSON.stringify(SCENES)}

var CREW_DISPLAY = {
  dekker: 'EMMET DEKKER',
  mara: 'MARA OKAFOR',
  yuna: 'YUNA CHO',
  rhen: 'TOMAS RHEN',
  none: null
}

var state = {
  scene: 0,
  choices: [],
  choiceHistory: [],
  logs: [],
  phase: 'idle'
}

var typingAbort = false
var activeTypingEl = null

// ── SKIP ──
function onSkip() {
  typingAbort = true
  if (activeTypingEl) {
    activeTypingEl.classList.remove('typing')
  }
}
document.getElementById('skip-btn').addEventListener('click', onSkip)
document.getElementById('skip-mirror-btn').addEventListener('click', onSkip)

function showSkip() {
  document.getElementById('skip-btn').classList.add('visible')
  document.getElementById('skip-mirror-btn').classList.add('visible')
}
function hideSkip() {
  document.getElementById('skip-btn').classList.remove('visible')
  document.getElementById('skip-mirror-btn').classList.remove('visible')
}

// ── TYPE TEXT ──
function typeText(el, text, speed, done) {
  el.textContent = ''
  el.classList.add('typing')
  typingAbort = false
  activeTypingEl = el
  showSkip()
  var i = 0
  var chars = text.split('')
  function tick() {
    if (typingAbort) {
      el.textContent = text
      el.classList.remove('typing')
      activeTypingEl = null
      hideSkip()
      if (done) setTimeout(done, 80)
      return
    }
    if (i >= chars.length) {
      el.classList.remove('typing')
      activeTypingEl = null
      hideSkip()
      if (done) setTimeout(done, 200)
      return
    }
    el.textContent += chars[i]
    i++
    var ch = chars[i - 1]
    var delay = ch === '\\n' ? 70 : (ch === '.' || ch === '—' ? speed * 2.5 : speed)
    setTimeout(tick, delay)
  }
  tick()
}

// ── LOG PANEL ──
function appendLogEntry(sceneName, crewFocus, text, pending) {
  var emptyEl = document.getElementById('log-empty')
  if (emptyEl) emptyEl.style.display = 'none'

  var entries = document.getElementById('log-entries')
  var item = document.createElement('div')
  item.className = 'log-entry-item' + (pending ? ' pending' : ' resolved')

  var crewName = CREW_DISPLAY[crewFocus] || null
  var metaHTML =
    '<div class="log-entry-meta">' +
      '<span class="log-entry-scene">' + sceneName + '</span>' +
      (crewName ? '<span class="log-entry-crew">' + crewName + '</span>' : '') +
    '</div>'

  item.innerHTML = metaHTML + '<div class="log-entry-text">' + (text || '') + '</div>'
  entries.appendChild(item)

  requestAnimationFrame(function() {
    requestAnimationFrame(function() { item.classList.add('show') })
  })
  setTimeout(function() { entries.scrollTop = entries.scrollHeight }, 60)
  return item
}

function updateLogEntry(item, text) {
  item.classList.remove('pending')
  item.classList.add('resolved')
  var textEl = item.querySelector('.log-entry-text')
  if (textEl) textEl.textContent = text
}

// ── PROGRESS ──
function updateProgress() {
  var el = document.getElementById('progress')
  el.innerHTML = ''
  SCENES.forEach(function(_, i) {
    var pip = document.createElement('div')
    pip.className = 'pip' + (i < state.scene ? ' done' : i === state.scene ? ' active' : '')
    el.appendChild(pip)
  })
}

// ── SCENE TEXT VARIANT ──
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

// ── RENDER SCENE ──
function renderScene() {
  var s = SCENES[state.scene]
  updateProgress()

  document.getElementById('scene-name').textContent = s.name
  document.getElementById('scene-location').textContent = s.location || ''

  var sceneEl = document.getElementById('scene')
  var choicesEl = document.getElementById('choices')
  var nextBtn = document.getElementById('next-btn')

  choicesEl.innerHTML = ''
  nextBtn.style.display = 'none'
  nextBtn.className = 'next-btn'
  state.phase = 'typing'

  typeText(sceneEl, getSceneText(state.scene), 15, function() {
    state.phase = 'choosing'
    s.choices.forEach(function(c, i) {
      var btn = document.createElement('button')
      btn.className = 'choice'
      btn.innerHTML = '<span class="n">' + (i + 1) + '</span><span>' + c + '</span>'
      btn.addEventListener('click', function() { choose(i, c) })
      choicesEl.appendChild(btn)
    })
  })
}

// ── CHOOSE ──
function choose(idx, text) {
  if (state.phase !== 'choosing') return
  state.phase = 'waiting'

  document.querySelectorAll('.choice').forEach(function(b, i) {
    if (i !== idx) b.classList.add('dim')
    else b.classList.add('selected')
  })

  var currentScene = SCENES[state.scene]
  state.choices.push({
    scene: currentScene.id,
    sceneName: currentScene.name,
    location: currentScene.location,
    crewFocus: currentScene.crewFocus,
    choiceIndex: idx,
    choice: text
  })
  state.choiceHistory.push({ sceneId: currentScene.id, choiceIndex: idx, choiceText: text })

  // Pending log entry
  var logItem = appendLogEntry(currentScene.name, currentScene.crewFocus, '—', true)

  var priorLogs = state.logs.slice(-3).join(' | ')

  fetch('/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scene: currentScene.id,
      sceneName: currentScene.name,
      location: currentScene.location,
      crewFocus: currentScene.crewFocus,
      choice: text,
      choiceNumber: state.choices.length,
      priorLogs: priorLogs
    })
  })
  .then(function(r) { return r.json() })
  .then(function(d) {
    updateLogEntry(logItem, d.log)
    state.logs.push(d.log)
  })
  .catch(function() {
    var fallback = 'SHIP LOG — Entry recorded.'
    updateLogEntry(logItem, fallback)
    state.logs.push(fallback)
  })
  .finally(function() {
    var isLast = state.scene >= SCENES.length - 1
    var nextBtn = document.getElementById('next-btn')
    nextBtn.textContent = isLast ? 'SEE WHAT THE MIRROR SEES' : 'CONTINUE →'
    nextBtn.style.display = 'block'
    if (isLast) nextBtn.classList.add('final')
    state.phase = 'done'
  })
}

// ── NEXT ──
document.getElementById('next-btn').addEventListener('click', function() {
  state.scene++
  if (state.scene >= SCENES.length) {
    showMirror()
  } else {
    renderScene()
  }
})

// ── MIRROR ──
function showMirror() {
  document.getElementById('game-phase').style.display = 'none'
  document.getElementById('mirror-phase').style.display = 'block'
  var mirrorEl = document.getElementById('mirror-text')
  mirrorEl.textContent = ''

  Promise.all([
    fetch('/mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choices: state.choices, choiceHistory: state.choiceHistory })
    }).then(function(r) { return r.json() }),
    fetch('/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choices: state.choices, logs: state.logs })
    }).then(function(r) { return r.json() })
  ]).then(function(results) {
    var mirrorData = results[0]
    var profileData = results[1]
    setTimeout(function() {
      typeText(mirrorEl, mirrorData.reflection, 20, function() {
        var qEl = document.getElementById('mirror-question')
        qEl.textContent = mirrorData.question || ''
        setTimeout(function() {
          qEl.classList.add('visible')
          setTimeout(function() { showProfileCard(profileData) }, 2200)
        }, 900)
      })
    }, 1200)
  }).catch(function() {
    mirrorEl.textContent = 'The mirror is still resolving. Try again in a moment.'
  })
}

function showProfileCard(data) {
  var card = document.getElementById('profile-card')
  document.getElementById('profile-pattern').textContent = data.pattern || 'PATTERN UNRESOLVED'
  document.getElementById('profile-description').textContent = data.description || ''

  var choicesEl = document.getElementById('profile-choices')
  choicesEl.innerHTML = ''
  state.choices.forEach(function(c, i) {
    var item = document.createElement('div')
    item.className = 'record-item'
    item.innerHTML =
      '<span class="record-n">' + (i + 1) + '</span>' +
      '<div class="record-content">' +
        '<span class="record-scene">' + (c.sceneName || c.scene) + '</span>' +
        '<span class="record-choice-text">' + c.choice + '</span>' +
      '</div>'
    choicesEl.appendChild(item)
  })

  var tagsEl = document.getElementById('profile-tags')
  tagsEl.innerHTML = ''
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

// ── RESTART ──
document.getElementById('btn-again').addEventListener('click', function() {
  state = { scene: 0, choices: [], choiceHistory: [], logs: [], phase: 'idle' }
  document.getElementById('mirror-phase').style.display = 'none'
  document.getElementById('profile-card').style.display = 'none'
  document.getElementById('profile-card').classList.remove('visible')
  document.getElementById('profile-choices').innerHTML = ''
  document.getElementById('profile-tags').innerHTML = ''
  document.getElementById('mirror-question').textContent = ''
  document.getElementById('mirror-question').classList.remove('visible')
  document.getElementById('log-entries').innerHTML = '<div class="log-empty" id="log-empty">— awaiting first entry —</div>'
  document.getElementById('game-phase').style.display = 'block'
  renderScene()
})

// ── COPY PROFILE ──
document.getElementById('btn-share').addEventListener('click', function() {
  var pattern = document.getElementById('profile-pattern').textContent
  var tags = Array.from(document.querySelectorAll('.tag')).map(function(t) { return t.textContent }).join('  ·  ')
  var nl = String.fromCharCode(10)
  var choices = state.choices.map(function(c, i) {
    return (i + 1) + '. [' + (c.sceneName || c.scene) + '] ' + c.choice
  }).join(nl)
  var text = [
    'THE MIRROR // ISV KESTREL  ·  VOYAGE 14',
    '',
    pattern,
    tags,
    '',
    'COMMAND LOG:',
    choices,
    '',
    'https://the-mirror-production-c93d.up.railway.app'
  ].join(nl)
  navigator.clipboard.writeText(text).then(function() {
    var btn = document.getElementById('btn-share')
    var orig = btn.textContent
    btn.textContent = 'COPIED'
    setTimeout(function() { btn.textContent = orig }, 2000)
  })
})

// ── KEYBOARD 1-4 ──
document.addEventListener('keydown', function(e) {
  if (state.phase !== 'choosing') return
  var n = parseInt(e.key)
  if (n >= 1 && n <= 4) {
    var btns = document.querySelectorAll('.choice')
    if (btns[n - 1]) btns[n - 1].click()
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

  // ── SHIP LOG ──
  if (req.url === '/read' && req.method === 'POST') {
    const { scene, sceneName, location, crewFocus, choice, choiceNumber, priorLogs } = await body()
    const crewFull = { dekker: 'Emmet Dekker', mara: 'Mara Okafor', yuna: 'Yuna Cho', rhen: 'Tomas Rhen', none: null }
    const crewRef = crewFull[crewFocus] || 'ship'
    const patternContext = priorLogs ? `Prior log entries (pattern context): ${priorLogs}\n\n` : ''
    try {
      const log = await ai(
        `You are the Ship's Log of the ISV Kestrel. Voice: The Expanse — terse, procedural, nautical-precise. Use proper nouns from the world.\n\nWORLD CONTEXT:\n${WORLD}\n\n${patternContext}Scene: ${sceneName} // ${location || ''}\nCrew focus: ${crewRef || 'ship systems'}\nDecision ${choiceNumber}: "${choice}"\n\nWrite ONE log entry. If prior entries show a pattern (this is the second or third time this captain has handled information by containment / disclosure / delay — name it directly). Be uncomfortably specific. Reference proper nouns (crew names, NavDB, Callum Station, Areto Group, Meridian) where relevant. 2 sentences. Start with "SHIP LOG —". No moralizing. No generalities.`,
        170
      )
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ log }))
    } catch(e) {
      res.writeHead(200)
      res.end(JSON.stringify({ log: 'SHIP LOG — Entry recorded.' }))
    }
    return
  }

  // ── COMMAND PROFILE ──
  if (req.url === '/profile' && req.method === 'POST') {
    const { choices, logs } = await body()
    const choiceList = choices.map((c, i) => `${i+1}. [${c.sceneName}  //  ${c.location || ''}] ${c.choice}`).join('\n')
    const logList = (logs || []).map((l, i) => `${i+1}. ${l}`).join('\n')
    try {
      const raw = await ai(
        `You have observed a captain make eight decisions aboard the ISV Kestrel on voyage 14 of the Callum-Meridian corridor. Generate their command profile. Voice: The Expanse — precise, operational, unsentimental. Use world-native terminology where relevant.\n\nWORLD CONTEXT:\n${WORLD}\n\nDecisions:\n${choiceList}\n\nShip log entries:\n${logList}\n\nReturn ONLY valid JSON (no markdown, no backticks):\n{\n  "pattern": "2-4 word command pattern in ALL CAPS",\n  "description": "One sentence. What this pattern costs them as captain of the Kestrel. Specific, not general.",\n  "tags": ["3 to 5 signal tags, 1-3 words each, ALL CAPS — may reference world elements: BELT PROTOCOL, ARETO LEVERAGE, MCRN SHADOW, CALLUM SILENCE, MERIDIAN CALCULUS, DISCLOSURE REFLEX, CONTAINMENT INSTINCT, etc"]\n}`,
        240
      )
      const clean = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
      const profile = JSON.parse(clean)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(profile))
    } catch(e) {
      res.writeHead(200)
      res.end(JSON.stringify({ pattern: 'PATTERN UNRESOLVED', description: 'Insufficient data to resolve command profile.', tags: [] }))
    }
    return
  }

  // ── THE MIRROR ──
  if (req.url === '/mirror' && req.method === 'POST') {
    const { choices, choiceHistory } = await body()
    const choiceList = choices.map((c, i) => `${i+1}. [${c.sceneName}] ${c.choice}`).join('\n')

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
      question = "When Emmet Dekker asked you to tell him everything — what did you protect by not answering?"
    } else if (disclosureCount >= 2) {
      question = "When Sable looked at you and not at the others — what did you feel before you answered?"
    } else {
      question = "At the mess table, when the Kestrel was waiting — what were you actually deciding?"
    }

    try {
      const reflection = await ai(
        `You are the ISV Kestrel. You have carried this captain through eight decisions on voyage 14 of the Callum-Meridian run. Now you speak.\n\nWORLD CONTEXT:\n${WORLD}\n\nTheir decisions:\n${choiceList}\n\nWrite a reflection that:\n- Speaks as the ship, directly to the captain ("You")\n- Names the pattern across all eight decisions — not each one separately\n- References one specific moment from the voyage using a crew member's full name (Mara Okafor, Emmet Dekker, Yuna Cho, Tomas Rhen) or a location (Callum Station, Meridian, the cargo bay, the engine room)\n- Says something they haven't said about themselves, but the choices confirm\n- Is 4-6 sentences, no more\n- Does NOT start with "You are"\n- Does NOT moralize or advise\n- Voice: The Expanse — terse, specific, understated. Not poetic. Not grand.\n- Reads like a ship that has been watching for eight scenes and finally speaks`,
        440
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

server.listen(PORT, '0.0.0.0', () => console.log(`ISV Kestrel online — http://0.0.0.0:${PORT}`))
