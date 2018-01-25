// var { remote } = require('electron');
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

// function showProgress(section, state) {
//     let progress = section.querySelector('#progress');
//     if (!progress) return;
//     progress.style.display = 'inline-block';
//     switch (state) {
//         case 'running':
//             progress.className = 'fa fa-cog fa-spin';
//             break;
//         case 'success':
//             progress.className = 'fa fa-check';
//             break;
//         case 'fail':
//             progress.className = 'fa fa-times';
//             break;
//         default:
//             process.className = '';
//             break;
//     }
// }

// function showMessage(section, msg) {
//     let info = section.querySelector('#info');
//     if (!info) return;
//     info.style.display = 'inline-block';
//     info.innerHTML = msg;
// }

// function fail(section, msg) {
//     showProgress(section, 'fail');
//     showMessage(section, msg);
// }

// function addLoggerListeners(section, logger) {
//     section.querySelector('button#clear').addEventListener('click', logger.clear);
//     section.querySelector('button#show').addEventListener('click', logger.show);
//     section.querySelector('button#hide').addEventListener('click', logger.hide);
// }

/**
 * 
 * 
 * @param {Element} chooser 
 * @returns {any} undefined if input not found
 * @throws "Input not found" if no path descriptor is detected
 * @throws "Invalid input value" if attribute 'value' is not found
 */
function getSingleValue(chooser) {
    let inputElement = chooser.querySelector('.chosen .descriptor .path');
    if (!inputElement) throw new Error('Input not found!');
    if (!inputElement.getAttribute('value')) throw new Error('Invalid input value!');
    return inputElement.getAttribute('value');
}

/**
 * 
 * 
 * @param {Element} chooser 
 * @returns {any[]} [] if input not found
 * @throws "Invalid input value(s)" if attribute 'value' is not found
 */
function getMultipleValues(chooser) {
    let values = [];
    chooser.querySelectorAll('.chosen .descriptor .path').forEach(fp => {
        values.push(fp.getAttribute('value'));
    });
    values = values.filter(e => e != null);
    if (values.length == 0) throw new Error('Invalid input value(s)!');
    return values;
}

/**
 * Make an Element a logger
 * 
 * @class Logger
 */
class Logger {
    /**
     * Creates an instance of Logger.
     * @param {Element} Element 
     * 
     * @memberOf Logger
     */
    constructor(Element) {
        if (!Element.appendChild) throw new Error('Invalid Element!');
        this._dom = Element;
    }

    /**
     * Log a message
     * 
     * @param {String} msg 
     * 
     * @memberOf Logger
     */
    log(msg) {
        let tag = msg.substr(1, 3);
        let p = document.createElement('p');
        p.innerHTML = msg;
        p.classList.add(tag);
        this._dom.appendChild(p);
        this._dom.scrollTop = this._dom.scrollHeight;
    }

    /**
     * Clear all history
     * 
     * @returns {Boolean} true = sucess
     * 
     * @memberOf Logger
     */
    clear() {
        while (this._dom.firstChild) {
            this._dom.removeChild(this._dom.firstChild);
        }
        return true;
    }

    /**
     * Show the logger
     * 
     * 
     * @memberOf Logger
     */
    show() {
        this._dom.style.display = 'block';
    }

    /**
     * Hide the logger
     * 
     * 
     * @memberOf Logger
     */
    hide() {
        this._dom.style.display = 'none';
    }
}

/**
 * Renderer of a section
 * 
 * @class Section
 */
class Section {
    /**
     * Creates an instance of Section.
     * @param {Element} domSection 
     * 
     * @memberOf Section
     */
    constructor(domSection) {
        this._dom = domSection;
        this._logger = new Logger(domSection.querySelector('.logger'));
        this._choosers = [];
        this._command = domSection.id;
        domSection.querySelectorAll('.chooser').forEach(chooser => this._choosers.push(chooser));
    }

    render() {
        this._addChooserHandler();
        this._addLoggerListeners();
        this._addButtonHandler();
    }

    _addButtonHandler(){
        let button = this._dom.querySelector('button[id^="btn-"]');
        if (!button) throw new Error('Main button not found!');
        button.addEventListener('click', ev => {
            // Get the input
            let args = {};
            try {
                this._choosers.forEach(chooser => {
                    if (chooser.querySelector('input[type=file]').hasAttribute('multiple')) {
                        args[chooser.id] = getMultipleValues(chooser);
                    } else {
                        args[chooser.id] = getSingleValue(chooser);
                    }
                });
            } catch (error) {
                this._fail(error);
            }
            // Launch api
            this._showProgress('running');
            this._showMessage('Running...');
            ev.target.disabled = true;
            this._logger.show();
            let subprocess = cp.fork('./gui/js/subprocess', [], {
                cwd: process.cwd(),
            });
            subprocess.send({
                command: this._command,
                args: args
            });
            // Waiting response
            subprocess.on('message', msg => {
                if (typeof msg === 'boolean') {
                    if (msg) this._done()
                    else this._fail('Un error occured! Check the log to get detail.');
                    ev.target.disabled = false;
                } else if (typeof msg === 'string') {
                    this._logger.log(msg);
                }
            });
        });
    }

    _addChooserHandler() {
        this._dom.querySelectorAll('.chooser').forEach(chooser => {
            let inputElement = chooser.querySelector('input[type=file]');
            if (inputElement.hasAttribute('multiple')) {
                inputElement.addEventListener('change', handleMultipleSelect, false);
            } else {
                inputElement.addEventListener('change', handleSingleSelect, false);
            }
        });
    }

    _addLoggerListeners() {
        this._dom.querySelector('button#clear').addEventListener('click', this._logger.clear);
        this._dom.querySelector('button#show').addEventListener('click', this._logger.show);
        this._dom.querySelector('button#hide').addEventListener('click', this._logger.hide);
    }

    _showProgress(state) {
        let progress = this._dom.querySelector('#progress');
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
                progress.className = '';
                progress.style.display = 'none';
                break;
        }
    }

    _showMessage(msg) {
        let info = this._dom.querySelector('#info');
        if (!info) return;
        info.style.display = 'inline-block';
        info.innerHTML = msg;
    }

    _fail(msg) {
        this._showProgress('fail');
        this._showMessage(msg);
    }

    _done() {
        this._showProgress('success');
        this._showMessage('Done!');
    }
}

// Render the sections above
let sectionIds = ['extract', 'xcpextract', 'dirextract', 'soundfix'],
    sections = sectionIds.map(id => new Section(document.querySelector('section#' + id)));
sections.forEach(section => section.render());