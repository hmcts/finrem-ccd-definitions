const fs = require('fs');

const folder = process.argv[2] || 'contested';
const data = JSON.parse(fs.readFileSync(`${folder}/json/CaseEvent/CaseEvent.json`, 'utf8'));

// Build a map: state => [event objects that POST to this state]
const postStateMap = {};
data.forEach(event => {
  const post = event.PostConditionState;
  if (!postStateMap[post]) postStateMap[post] = [];
  postStateMap[post].push(event);
});

const result = data.map(event => {
  // PreConditionState(s) can be semicolon separated or "*"
  let preStates = [];
  if (event['PreConditionState(s)']) {
    preStates = event['PreConditionState(s)'].split(';').map(s => s.trim());
  }
  // Find previous events for each preState
  let previousEvents = [];
  preStates.forEach(state => {
    if (postStateMap[state]) {
      previousEvents.push(...postStateMap[state].map(e => ({
        previousEventId: e.ID,
        eventName: e.Name,
        postConditionState: e.PostConditionState
      })));
    }
  });
  // Remove duplicates
  previousEvents = previousEvents.filter(
    (v,i,a) => a.findIndex(t => (t.previousEventId === v.previousEventId)) === i
  );
  return {
    eventId: event.ID,
    eventName: event.Name,
    preConditionStates: preStates,
    postConditionState: event.PostConditionState,
    previousEvents
  };
});

console.log(JSON.stringify(result, null, 2));
