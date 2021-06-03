const tableID = "calc_table";
const config = [["mod3", 3], ["mod6", 6], ["mod30", 30]];
const header_rows_num = 2;
var pci_counter = 1;
const wrong_range = "Wrong PCI. OK: 0...503"

function createinput() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "number");
    x.setAttribute("id", "row-" + pci_counter + "-PCI_input");
    x.setAttribute("min", "0");
    x.setAttribute("max", "503");
    return x
}

function addRow(e) {
    let tableRef = document.getElementById(tableID);

    let newRow = tableRef.insertRow();
    pci_counter++;

    let cellpar = newRow.insertCell();
    cellpar.id = "row-" + pci_counter + "-PAR";
    cellpar.textContent = "Планируемый PCI " + pci_counter;
    let cell_input = newRow.insertCell();
    cell_input.appendChild(createinput());
    cell_input.addEventListener('change', fillRow);

    config.forEach(element => {
        let cell = newRow.insertCell();
        cell.id = "row-" + pci_counter + '-' + element[0];
    });
};


function removeRow(e) {
    let table = document.getElementById(tableID);
    if (table.rows.length > header_rows_num) {
        table.deleteRow(-1);
        pci_counter--;
        checkConflicts();
    };
};

function fillRow(e) {
    let cur_row = e.target.id.slice(0, -9);
    let pci_val = parseInt(`${e.target.value}`);
    config.forEach(element => {
        let mod = document.getElementById(cur_row + element[0]);
        if (pci_val >= 0 && pci_val <= 503) {
            mod.textContent = pci_val % element[1];
        } else {
            mod.textContent = wrong_range;
        }

    });
    checkConflicts();
};
function checkIfDuplicateExists(w) {
    return new Set(w).size !== w.length
};
function conflictsSearcher(mod_data) {
    config.forEach(element => {
        let mod = document.getElementById(element[0]);
        let mod_array = mod_data[element[0]]
        if (checkIfDuplicateExists(mod_array) || mod_array.includes(NaN)) {
            mod.textContent = 'NOK';
            mod.className = "nok";
        }
        else {
            mod.textContent = 'OK';
            mod.className = "ok";
        }
    });
};

function checkConflicts() {
    let table = document.getElementById(tableID);
    let mod_data = {
        "mod3": new Array(),
        "mod6": new Array(),
        "mod30": new Array()
    };
    for (let row_index = header_rows_num; row_index < table.rows.length; row_index++) {
        let row = table.rows[row_index];
        for (let col_index = 2; col_index < row.cells.length; col_index++) {
            let cell = row.cells[col_index];
            let n = cell.id.lastIndexOf('-');
            let cur_mod = cell.id.substring(n + 1);
            mod_data[cur_mod].push(parseInt(cell.innerText));
        };

    }
    conflictsSearcher(mod_data);
};
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
};

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
};

function copy() {
    let table = document.getElementById(tableID);
    let res_array = new Array;

    for (let row_index = header_rows_num; row_index < table.rows.length; row_index++) {
        let row = table.rows[row_index];
        res_array.push(row.cells[1].firstChild.value)
    }
    let copyText = res_array.join('\t');
    copyTextToClipboard(copyText);
};

document.getElementById("copy").addEventListener("click", copy);
document.getElementById("row-1-PCI_input").addEventListener('change', fillRow);
document.getElementById("addRow").addEventListener('click', addRow);
document.getElementById("removeRow").addEventListener('click', removeRow);
