const check = {
    isPageSettingsAvailable : () => {
        return document.getElementById('fsSettingsButton') ? true : false;
    },
    isPageSettingsDialogAvailable : () => {
        return document.getElementById('fsPageSettingsDialog') ? true : false;
    }
};

function delay(num) {
    return new Promise(resolve => setTimeout(resolve, num));
}

async function watch(condition, arg) {
    let i = 0;
    while (i < 100) {
        await delay(100);
        if (!condition(arg)) {
            console.log('waiting...');
            i++;
        } else {
            break;
        }
    }
    return true;
}

async function openPageSettings() {
    if (await watch(check.isPageSettingsAvailable)) {
        document.getElementById('fsSettingsButton').click();
    }
}

async function unCheckCustomSEO() {
    if (await watch(check.isPageSettingsDialogAvailable)) {
        document.getElementById('fsEditSEOCustomTitle').checked = false;
        document.getElementById('fsEditSEOCustomDescription').checked = false;
        document.getElementById('fsEditSEOCustomKeywords').checked = false;
        document.querySelector('.fsAppModalCompleteButton').click();
    }
}

async function defaultSEO() {
    await openPageSettings();
    await unCheckCustomSEO();
}

defaultSEO();