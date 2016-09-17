const row = document.querySelector('.row');
const select = document.querySelector('.select');
const container = document.querySelector('.container');
let digit;

// Creates options for dropdown 0 - 255
for (let i = 0; i < 256; i++) {
  let option = document.createElement('option');
  option.setAttribute('value', i);
  option.text = `Rule ${i}`;
  select.appendChild(option);
}

// Renders automata to screen
function generateAutomata() {
  container.innerHTML = '';

  let row = document.createElement('div');
  row.setAttribute('class', 'row');
  container.appendChild(row);

  // Creates divs and appends to row based on width of window
  for(let i = 1; i < window.innerWidth / 4; i++) {
    let div = document.createElement('div');
    row.appendChild(div);
  }

  digit = select.options[select.selectedIndex].value;
  randomizeRow(row);
  for (let i = 1; i < window.innerHeight / 4; i++) {
    setTimeout(duplicateRow, i * 10);
  }

}

// Gets selcted value from dropdown
function getSelectValue() {
  return select.options[select.selectedIndex].value;
}

// Converts number to booleans based on binary
function numberToBinaryArray(num) {
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
    let leftSibling = parent.previousElementSibling || parentRow.childNodes[parentRow.childNodes.length - 1];
    let rightSibling = parent.nextElementSibling || parentRow.childNodes[0];
    let toggleClass = setActiveIfMatchesRule.bind(null, target, leftSibling, parent, rightSibling);

    toggleClass([1,1,1], numberToBinaryArray(digit)[0]);
    toggleClass([1,1,0], numberToBinaryArray(digit)[1]);
    toggleClass([1,0,1], numberToBinaryArray(digit)[2]);
    toggleClass([1,0,0], numberToBinaryArray(digit)[3]);
    toggleClass([0,1,1], numberToBinaryArray(digit)[4]);
    toggleClass([0,1,0], numberToBinaryArray(digit)[5]);
    toggleClass([0,0,1], numberToBinaryArray(digit)[6]);
    toggleClass([0,0,0], numberToBinaryArray(digit)[7]);
  }
}

function setActiveIfMatchesRule(target, leftSibling, parent, rightSibling, rule, ruleValue) {
  let matchesRule = state(leftSibling) === rule[0] && state(parent) === rule[1] && state(rightSibling) === rule[2];

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
