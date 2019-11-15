const fsAppModalOverlay=document.getElementById("fsAppModalOverlay"),delay=e=>new Promise(t=>setTimeout(t,e)),check={isDomainChildrenExpanded:e=>"UL"===e.children[0].nodeName,isBulkUpdateButtonAvailable:()=>document.getElementById("fsBulkUpdateButton"),isBulkPublishButtonAvailable:()=>document.getElementById("fsBulkPublishButton"),isBulkUpdateMenuOpen:()=>document.getElementById("fsBUHideFromSE"),isBulkPublishMenuOpen:()=>document.querySelector(".jstree-default"),isPublishSelectedButtonDisabled:e=>!e.disabled,isModalOverlayActive:()=>!fsAppModalOverlay.classList.contains("fsStyleDisplayBlock")},watch=async(e,t)=>{let a=0;for(;a<100;){await delay(200);const n=e(t);if(n)return n;console.log("waiting..."),a++}return!0},expandChildren=async e=>{const t=e.querySelector("div.fsExpandableTree");return e.classList.contains("fsStateExpanded")||(e.querySelector("div.fsItemContent.fsSubnavCollapseableTreeNode").click(),await watch(check.isDomainChildrenExpanded,t)),t},getProductionBranch=async e=>{const t=e.querySelector('li.fsBranchNodeType > div.fsItemContent > a[title="Production"]');return!!t&&t.parentElement},getProductionBranchMenu=async(e,t)=>{switch(e.querySelector("button.fsCommandsMenuButton").click(),t){case"update":return await watch(check.isBulkUpdateButtonAvailable);case"publish":return await watch(check.isBulkPublishButtonAvailable)}},getBulkOperationsMenu=async(e,t)=>{switch(e.click(),t){case"update":return await watch(check.isBulkUpdateMenuOpen);case"publish":return await watch(check.isBulkPublishMenuOpen)}},setBulkUpdateMenu=async()=>{const e=document.querySelector('#fsBUHideFromSE[data-property="indexable_for_internal_search"]'),t=document.querySelector('#fsBUHideFromSE[data-property="seo_hide"]');return e.value="0",t.value="1",document.querySelector(".fsAppModalCompleteButton").click(),await watch(check.isModalOverlayActive)},setBulkPublishMenu=async()=>{const e=document.querySelector(".jstree-checkbox-selectall");if(e){e.click();const t=document.querySelector(".fsAppModalCompleteButton");await watch(check.isPublishSelectedButtonDisabled,t),t.click()}else document.querySelector("button.fsAppModalCancelButton").click();return await watch(check.isModalOverlayActive)},hideProductionBranches=async e=>{for(const t of e){const e=await expandChildren(t),a=await getProductionBranch(e);if(a){const e=await getProductionBranchMenu(a,"update");await getBulkOperationsMenu(e,"update"),await setBulkUpdateMenu();const t=await getProductionBranchMenu(a,"publish");await getBulkOperationsMenu(t,"publish"),await setBulkPublishMenu()}}console.log("done!")};hideProductionBranches(document.querySelectorAll(".fsDomainList > li"));