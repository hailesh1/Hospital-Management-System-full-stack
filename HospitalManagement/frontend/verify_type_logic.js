
const VALID_TYPES = ['CHECKUP', 'FOLLOW_UP', 'EMERGENCY', 'CONSULTATION'];

function getType(input) {
    let typeInput = (input || 'CONSULTATION').toUpperCase();
    if (typeInput === 'CHECK-UP') typeInput = 'CHECKUP';
    if (typeInput === 'FOLLOW UP') typeInput = 'FOLLOW_UP';
    
    const type = VALID_TYPES.includes(typeInput) ? typeInput : 'CONSULTATION';
    return type;
}

console.log('Testing Type Logic:');
console.log('Input: "General Checkup" ->', getType("General Checkup"));
console.log('Input: "check-up" ->', getType("check-up"));
console.log('Input: "Follow Up" ->', getType("Follow Up"));
console.log('Input: "EMERGENCY" ->', getType("EMERGENCY"));
console.log('Input: undefined ->', getType(undefined));
console.log('Input: "Invalid" ->', getType("Invalid"));
