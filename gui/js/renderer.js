var { remote } = require('electron');
let api = remote.require('./api');

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    return true;
}

function btnPlus(fileChooser) {
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-mini', 'btn-positive', 'fa', 'fa-plus');
    btn.addEventListener('click', _ => {
        fileChooser.click();
    });
    return btn;
}

function btnDelete(descriptor) {
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-mini', 'btn-negative', 'fa', 'fa-times');
    btn.addEventListener('click', _ => {
        descriptor.parentElement.removeChild(descriptor);
    });
    return btn;
}

function newDescriptor(file, addable, fileChooser) {
    let div = document.createElement('div');
    div.classList.add('descriptor');

    if (addable && fileChooser) {
        // Add button + / - to div
        div.appendChild(btnPlus(fileChooser));
        div.appendChild(btnDelete(div));
    }

    let fpath = document.createElement('span');
    fpath.classList.add('path');
    div.appendChild(fpath);
    fpath.innerHTML = file.path;
    fpath.setAttribute('value', file.path);

    return div;
}

function handleMultipleSelect(e) {
    let files = Array.from(e.target.files);
    // Render view
    let chosenFiles = e.target.parentElement.querySelector('.chosen');
    files.forEach(f => chosenFiles.appendChild(newDescriptor(f, true, e.target)));
}

function handleSingleSelect(e) {
    let file = e.target.files[0];
    // Render view
    let chosenFile = e.target.parentElement.querySelector('.chosen');
    clearNode(chosenFile);
    chosenFile.appendChild(newDescriptor(file));
}

// "Extract" section
let extractSection = document.querySelector('section#extract');
extractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
extractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
extractSection.querySelector('button#btn-extract').addEventListener('click', _ => {
    // Verify inputs
    // TODO
    let src = [];
    extractSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let outdir = extractSection.querySelector('.chooser#outdir .chosen .descriptor .path').getAttribute('value');
    // Launch api
    api.extract(src, outdir);
});

// "XcpExtract" section
let xcpextractSection = document.querySelector('section#xcpextract');
xcpextractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
xcpextractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
xcpextractSection.querySelector('button#btn-xcpextract').addEventListener('click', _ => {
    // Verify inputs
    // TODO
    let src = [];
    xcpextractSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let outdir = xcpextractSection.querySelector('.chooser#outdir .chosen .descriptor .path').getAttribute('value');
    // Launch api
    api.xcpextract(src, outdir, './resources/CPM-sample.js');
});

// "DirExtract" section
let dirextractSection = document.querySelector('section#dirextract');
dirextractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
dirextractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
dirextractSection.querySelector('button#btn-dirextract').addEventListener('click', _ => {
    // Verify inputs
    // TODO
    let src = [];
    dirextractSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let outdir = dirextractSection.querySelector('.chooser#outdir .chosen .descriptor .path').getAttribute('value');
    // Launch api
    api.dirextract(src, outdir);
});

// "Soundfix" section
let soundfixSection = document.querySelector('section#soundfix');
soundfixSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
soundfixSection.querySelector('.chooser#ulpath input[type=file]').addEventListener('change', handleSingleSelect, false);
soundfixSection.querySelector('button#btn-soundfix').addEventListener('click', _ => {
    // Verify inputs
    // TODO
    let src = [];
    soundfixSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let ulpath = soundfixSection.querySelector('.chooser#ulpath .chosen .descriptor .path').getAttribute('value');
    // Launch api
    api.soundfix(src, ulpath);
});