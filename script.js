function binary() {
  return Math.floor(Math.random() * (1 - 0 + 1));
}

for(let i = 1; i < window.innerWidth / 4; i++) {
  let div = document.createElement('div');
  document.querySelector('.row').appendChild(div);
}

function randomizeRow(row) {
  for(let i = 0; i < row.childNodes.length; i++) {
    let div = row.childNodes[i];
    div.classList.add(binary() ? 'active' : 'inactive' );
  }
}

randomizeRow(document.querySelector('.row'));

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
    let prevSelf = parentRow.childNodes[i];
    let leftSibling = prevSelf.previousElementSibling || parentRow.childNodes[parentRow.childNodes.length - 1];
    let rightSibling = prevSelf.nextElementSibling || parentRow.childNodes[0];
    let toggleClass = setActiveIfMatchesRule.bind(null, target, leftSibling, prevSelf, rightSibling);
    toggleClass([1,1,1], true);
    toggleClass([1,1,0], false);
    toggleClass([1,0,1], true);
    toggleClass([1,0,0], true);
    toggleClass([0,1,1], false);
    toggleClass([0,1,0], true);
    toggleClass([0,0,1], true);
    toggleClass([0,0,0], false);
  }
}

function setActiveIfMatchesRule(target, leftSibling, prevSelf, rightSibling, rule, ruleValue) {
  let matchesRule = state(leftSibling) === rule[0] && state(prevSelf) === rule[1] && state(rightSibling) === rule[2];

  if(matchesRule) {
    setIsActive(target, ruleValue);
  }
}

function state(cell) {
  return cell.classList.contains('active') ? 1 : 0;
}

function setIsActive(cell, isActive) {
  if (!!isActive) {
    cell.classList.remove('inactive');
    cell.classList.add('active');
  } else {
    cell.classList.remove('active');
    cell.classList.add('inactive');
  }
}

for (let i = 1; i < window.innerHeight / 4; i++) {
  setTimeout(duplicateRow, i * 10);
}
