const check = {
    isComposeModeOn: () => {
        return document.getElementById('fsComposeMode').checked ? true : false;
    },
    isPageLayoutButtonAvailable: () => {
        return document.getElementById('fsPageLayoutButton').disabled ? false : true;
    },
    isPageSettingsAvailable : () => {
        return document.getElementById('fsSettingsButton') ? true : false;
    },
    isPageSettingsDialogAvailable : () => {
        return document.getElementById('fsPageSettingsDialog') ? true : false;
    }
};

const delay = (num) => {
    return new Promise(resolve => setTimeout(resolve, num));
}

const watch = async (condition, arg) => {
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

const openLayoutSettings = async () => {
    if (!check.isComposeModeOn()) {
        document.getElementById('fsComposeMode').click();
    }
    if (await watch(check.isPageSettingsAvailable)) {
        document.getElementById('fsPageLayoutButton').click();
    }
}

const getLayoutInformation = async () => {

}

const runEverything = async () => {
    await openLayoutSettings();
    await getLayoutInformation();
}

runEverything();