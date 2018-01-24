var { remote } = require('electron');
let api = remote.require('./api');
let cp = require('child_process');

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

function showProgress(section, state) {
    let progress = section.querySelector('#progress');
    if (!progress) return;
    progress.style.display = 'inline-block';
    switch (state) {
        case 'running':
            progress.className = 'fa fa-cog fa-spin';
            break;
        case 'success':
            progress.className = 'fa fa-check';
            break;
        case 'fail':
            progress.className = 'fa fa-times';
            break;
        default:
            process.className = '';
            break;
    }
}

function showMessage(section, msg) {
    let info = section.querySelector('#info');
    if (!info) return;
    info.style.display = 'inline-block';
    info.innerHTML = msg;
}

function fail(section, msg) {
    showProgress(section, 'fail');
    showMessage(section, msg);
}

// "Extract" section
let extractSection = document.querySelector('section#extract');
extractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
extractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
let btnExtract = extractSection.querySelector('button#btn-extract');
btnExtract.addEventListener('click', _ => {
    // Verify inputs
    let src = [];
    try {
        let srcDOM = extractSection.querySelectorAll('.chooser#src .chosen .descriptor .path');
        srcDOM.forEach(fp => {
            src.push(fp.getAttribute('value'));
        });
        src = src.filter(e => e != null);
        if (src.length == 0) throw new Error('Invalid source(s)!');
    } catch (error) {
        fail(extractSection, 'Source(s) not found!' + error);
        return;
    }
    let outdir = '';
    try {
        let outdirDOM = extractSection.querySelector('.chooser#outdir .chosen .descriptor .path');
        outdir = outdirDOM.getAttribute('value');
    } catch (error) {
        fail(extractSection, 'Output directory not found!');
        return;
    }
    // Launch api
    showProgress(extractSection, 'running');
    showMessage(extractSection, 'Executing...');
    btnExtract.disabled = true;
    let extractProcess = cp.fork('./gui/js/subprocess', [], {
        cwd: process.cwd(),
    });
    extractProcess.send({
        command: 'extract',
        args: {
            src: src,
            outdir: outdir
        }
    });
    extractProcess.on('message', (msg) => {
        // msg should be either true or false
        if (msg == 'done') {
            showProgress(extractSection, 'success');
            showMessage(extractSection, 'Done!');
            btnExtract.disabled = false;
        } else {
            fail(extractSection, error);
        }
    });
});

// "XcpExtract" section
let xcpextractSection = document.querySelector('section#xcpextract');
xcpextractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
xcpextractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
xcpextractSection.querySelector('button#btn-xcpextract').addEventListener('click', _ => {
    // Verify inputs
    let src = [];
    xcpextractSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let outdir = xcpextractSection.querySelector('.chooser#outdir .chosen .descriptor .path').getAttribute('value');
    if (!src) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Source(s) not found!');
        return;
    }
    if (!outdir) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Output directory not found!');
        return;
    }
    // Launch api
    Promise.resolve()
        .then(() => {
            showProgress(extractSection, 'running');
            showMessage(extractSection, 'Executing...');
            api.xcpextract(src, outdir, './resources/CPM-sample.js');
        })
        .then(() => {
            showProgress(extractSection, 'success');
            showMessage(extractSection, 'Success!');
        })
        .catch((error) => {
            showProgress(extractSection, 'fail');
            showMessage(extractSection, error);
        });
});

// "DirExtract" section
let dirextractSection = document.querySelector('section#dirextract');
dirextractSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
dirextractSection.querySelector('.chooser#outdir input[type=file]').addEventListener('change', handleSingleSelect, false);
dirextractSection.querySelector('button#btn-dirextract').addEventListener('click', _ => {
    // Verify inputs
    let src = [];
    dirextractSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let outdir = dirextractSection.querySelector('.chooser#outdir .chosen .descriptor .path').getAttribute('value');
    if (!src) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Source(s) not found!');
        return;
    }
    if (!outdir) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Output directory not found!!');
        return;
    }
    // Launch api
    Promise.resolve()
        .then(() => {
            showProgress(extractSection, 'running');
            showMessage(extractSection, 'Executing...');
            api.dirextract(src, outdir);
        })
        .then(() => {
            showProgress(extractSection, 'success');
            showMessage(extractSection, 'Success!');
        })
        .catch((error) => {
            showProgress(extractSection, 'fail');
            showMessage(extractSection, error);
        });
});

// "Soundfix" section
let soundfixSection = document.querySelector('section#soundfix');
soundfixSection.querySelector('.chooser#src input[type=file]').addEventListener('change', handleMultipleSelect, false);
soundfixSection.querySelector('.chooser#ulpath input[type=file]').addEventListener('change', handleSingleSelect, false);
soundfixSection.querySelector('button#btn-soundfix').addEventListener('click', _ => {
    // Verify inputs
    let src = [];
    soundfixSection.querySelectorAll('.chooser#src .chosen .descriptor .path').forEach(fp => {
        src.push(fp.getAttribute('value'));
    });
    let ulpath = soundfixSection.querySelector('.chooser#ulpath .chosen .descriptor .path').getAttribute('value');
    if (!src) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Source(s) not found!');
        return;
    }
    if (!outdir) {
        showProgress(extractSection, 'fail');
        showMessage(extractSection, 'Unit loader\'s path not found!');
        return;
    }
    // Launch api
    Promise.resolve()
        .then(() => {
            showProgress(extractSection, 'running');
            showMessage(extractSection, 'Executing...');
            api.soundfix(src, ulpath);
        })
        .then(() => {
            showProgress(extractSection, 'success');
            showMessage(extractSection, 'Success!');
        })
        .catch((error) => {
            showProgress(extractSection, 'fail');
            showMessage(extractSection, error);
        });
});