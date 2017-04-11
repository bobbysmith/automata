const row = document.querySelector('.row');
const select = document.querySelector('.select');
const container = document.querySelector('.container');
const random = document.querySelector('.random');
const current = document.querySelector('.current span');
const rulesIcon = [[1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1], [0,0,0]];
let ruleNumber;

// Creates options for dropdown 0 - 255
for (let i = 0; i < 256; i++) {
  let option = document.createElement('option');
  option.setAttribute('value', i);
  option.text = `Rule ${i}`;
  select.appendChild(option);
}

// Renders automata to screen
function generateAutomata() {
  ruleNumber = select.options[select.selectedIndex].value;
  current.innerHTML = `${ruleNumber}`;
  container.innerHTML = '';

  // Create original row and append it to the container
  let row = document.createElement('div');
  row.setAttribute('class', 'row');
  container.appendChild(row);

  // Creates divs and appends to row based on width of window
  for(let i = 1; i < container.clientWidth / 4; i++) {
    let div = document.createElement('div');
    row.appendChild(div);
  }

  randomizeRow(row);
  for (let i = 1; i < container.clientHeight / 4; i++) {
    duplicateRow();
  }
}

// Generates random automata when button is clicked
function generateRandom() {
  ruleNumber = Math.floor(Math.random() * 255);
  current.innerText = `${ruleNumber}`;
  select.selectedIndex = 0;
  container.innerHTML = '';

  // Create oringial row and append it to the container
  let row = document.createElement('div');
  row.setAttribute('class', 'row');
  container.appendChild(row);

  // Creates divs and appends to row based on width of window
  for(let i = 1; i < container.clientWidth / 4; i++) {
    let div = document.createElement('div');
    row.appendChild(div);
  }

  randomizeRow(row);
  for (let i = 1; i < container.clientHeight / 4; i++) {
    duplicateRow();
  }
}

// Gets selcted value from dropdown
function getSelectValue() {
  return select.options[select.selectedIndex].value;
}

// Converts number to array of booleans based on on each bit in the number
function numbertoBooleanArray(num) {
  let binary = Number(num).toString(2);
  let arr = [];
  while(binary.length < 8) {
    binary = 0 + binary;
  }
  for(let i = 0; i < binary.length; i++) {
    arr.push(parseInt(binary[i]) ? true : false);
  }
  return arr;
}

// Returns 0  or 1
function binary() {
  return Math.floor(Math.random() * 2);
}

// Randomizes row divs with class of active or inactive
function randomizeRow(row) {
  for(let i = 0; i < row.childNodes.length; i++) {
    let div = row.childNodes[i];
    div.classList.add(binary() ? 'active' : 'inactive' );
  }
}

function duplicateRow() {
  let rows = document.querySelectorAll('.row');
  let lastRow = rows[rows.length - 1];
  let clone = lastRow.cloneNode(true);
  document.querySelector('.container').appendChild(clone);
  processRow(clone, lastRow);
}


function processRow(row, parentRow) {
  for (let i = 0; i < row.childNodes.length; i++) {
    let target = row.childNodes[i];
    let parent = parentRow.childNodes[i];
    let left = parent.previousElementSibling || parentRow.childNodes[parentRow.childNodes.length - 1];
    let right = parent.nextElementSibling || parentRow.childNodes[0];
    let toggleClass = setActiveIfMatchesRule.bind(null, target, left, parent, right);

    for (let j = 0; j < rulesIcon.length; j++) {
      toggleClass(rulesIcon[j], numbertoBooleanArray(ruleNumber)[j]);
    }
  }
}

function setActiveIfMatchesRule(target, left, parent, right, rule, ruleValue) {
  let matchesRule = state(left) === rule[0] && state(parent) === rule[1] && state(right) === rule[2];

  if(matchesRule) {
    toggleActive(target, ruleValue);
  }
}

function state(cell) {
  return cell.classList.contains('active') ? 1 : 0;
}

function toggleActive(cell, isActive) {
  if (isActive) {
    cell.classList.remove('inactive');
    cell.classList.add('active');
  } else {
    cell.classList.remove('active');
    cell.classList.add('inactive');
  }
}

select.addEventListener('change', generateAutomata);
random.addEventListener('click', generateRandom);
