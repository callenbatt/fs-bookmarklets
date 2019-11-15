// the command menu, active from page action
const fsAppModalOverlay = document.getElementById('fsAppModalOverlay');

const delay = (num) => {
    return new Promise(resolve => setTimeout(resolve, num));
}

const check = {
    'isDomainChildrenExpanded' : (domainChildren) => {
        return domainChildren.children[0].nodeName === "UL";
    },
    'isBulkUpdateButtonAvailable' : () => {
        return document.getElementById('fsBulkUpdateButton');
    },
    'isBulkPublishButtonAvailable' : () => {
        return document.getElementById('fsBulkPublishButton');
    },
    'isBulkUpdateMenuOpen' : () => {
        return document.getElementById('fsBUHideFromSE');
    },
    'isBulkPublishMenuOpen' : () => {
        return document.querySelector('.jstree-default');
    },
    'isPublishSelectedButtonDisabled' : (publishButton) => {
        return publishButton.disabled ? false : true;
    },
    'isModalOverlayActive' : () => {
        return fsAppModalOverlay.classList.contains("fsStyleDisplayBlock") ? false : true;
    }
}

 const watch = async (condition, arg) => {
    let i = 0;
    while (i < 100) {
        await delay(200);
        const result = condition(arg);
        if (!result) {
            console.log('waiting...');
            i++;
        } else {
            return result;
        }
    }
    return true;
}

const expandChildren = async (domain) => {
    const domainChildren  = domain.querySelector("div.fsExpandableTree");
    if (!domain.classList.contains('fsStateExpanded')) {
        domain.querySelector("div.fsItemContent.fsSubnavCollapseableTreeNode").click();
        await watch(check.isDomainChildrenExpanded, domainChildren);
    }
    return domainChildren;
}

const getProductionBranch = async (domainChildren) => {
    const selector = domainChildren.querySelector('li.fsBranchNodeType > div.fsItemContent > a[title="Production"]');
    return selector ? selector.parentElement : false;
}

const getProductionBranchMenu = async (productionBranch, operation) => {
    productionBranch.querySelector('button.fsCommandsMenuButton').click();
    switch (operation) {
        case 'update': return await watch(check.isBulkUpdateButtonAvailable);
        case 'publish' : return await watch(check.isBulkPublishButtonAvailable);
    }
}

const getBulkOperationsMenu = async (button, operation) => {
    button.click();
    switch (operation) {
        case 'update': return await watch(check.isBulkUpdateMenuOpen);
        case 'publish' : return await watch(check.isBulkPublishMenuOpen);
    }
}

const setBulkUpdateMenu = async () => {
    const internal = document.querySelector('#fsBUHideFromSE[data-property="indexable_for_internal_search"]');
    const external = document.querySelector('#fsBUHideFromSE[data-property="seo_hide"]');
    const title = document.getElementById('fsBUSEOTitle');
    const desc = document.getElementById('fsBUSEODesc');
    const keywords = document.getElementById('fsBUSEOKeywords');
    const nav = document.getElementById('fsBUHideNavigation');
    const ssl = document.getElementById('fsBUUseTLS');
    internal.value = '0';
    external.value = '1';
    title.value = "";
    desc.value = "";
    keywords.value = "";
    nav.value = "0";
    ssl.value = "1";
    document.querySelector('.fsAppModalCompleteButton').click();
    return await watch(check.isModalOverlayActive);
}

const setBulkPublishMenu = async () => {
    const selectAllButton = document.querySelector('.jstree-checkbox-selectall');
    if (selectAllButton) {
        selectAllButton.click();
        const publishButton = document.querySelector('.fsAppModalCompleteButton');
        await watch(check.isPublishSelectedButtonDisabled, publishButton);
        publishButton.click();
    } else {
        document.querySelector('button.fsAppModalCancelButton').click();
    }
    return await watch(check.isModalOverlayActive);
}

const hideProductionBranches = async (array) => {
    for (const domain of array) {
        const domainChildren = await expandChildren(domain);
        const productionBranch = await getProductionBranch(domainChildren);
        if (productionBranch) {
            const bulkUpdateMenuButton = await getProductionBranchMenu(productionBranch, 'update');
            await getBulkOperationsMenu(bulkUpdateMenuButton, 'update');
            await setBulkUpdateMenu();
            const bulkPublishMenuButton = await getProductionBranchMenu(productionBranch, 'publish');
            await getBulkOperationsMenu(bulkPublishMenuButton, 'publish');
            await setBulkPublishMenu();
        }
    }
    console.log('done!');
}

hideProductionBranches(document.querySelectorAll('.fsDomainList > li'))