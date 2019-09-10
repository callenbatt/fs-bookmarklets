const PUBLISH_MESSAGE = '';

const check_publish = { 
    isPublishOptionAvailable: () => { 
        return document.getElementById('fsPublishButton').classList.contains('fsStateHidden') ? false : true; 
    }, 
    isPublishCompleteAvailable: () => { 
        return document.querySelector('textarea.fsAppModalDialogComment') ? true : false; 
    } };

function delay(num) { 
    return new Promise(resolve => setTimeout(resolve, num)); 
}

async function watch(condition, arg) {
    let i = 0; while (i < 100) {
        await delay(100);
        if (!condition(arg)) {
            console.log('waiting...');
            i++;
        }
        else {
            break;
        }
    } return true;
}
async function clickPublishOption() {
    if (check_publish.isPublishOptionAvailable()) {
        document.getElementById('fsPublishButton').click();
        return true;
    }
    else {
        window.alert('page is already published');
        return false;
    }
}
async function clickPublishComplete() {
    if (await watch(check_publish.isPublishCompleteAvailable)) {
        if (PUBLISH_MESSAGE != "") {
            document.querySelector('textarea.fsAppModalDialogComment').value = PUBLISH_MESSAGE;
        }
        document.querySelector('button.fsAppModalCompleteButton').click();
    }
}
async function publish() {
    if (await clickPublishOption()) {
        await clickPublishComplete();
    }
}

publish();
