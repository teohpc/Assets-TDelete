
const BINNAME = 'DELETE';

// Global
let contextService;
let APIService;
let selected = [];

async function init() {
    try {
        contextService = await AssetsClientSdk.AssetsPluginContext.get();
        APIService = await AssetsClientSdk.AssetsApiClient.fromPluginContext(contextService);
        const context = contextService.context;

        document.getElementById("start").style.display = "none";
        document.getElementById("main").style.display = "block";

        // Get username and HOME folder
        let username = context.app.userProfile.username;
        let userHome = context.app.userProfile.userZone;

        //return;
        // And the plugin only look at
        // folderSelection[]
        // assetSelection[]

        // Check triggered from
        // if from "folderContextMenu", "assetSelection" is empty

        // folderContextMenu
        let triggerFrom = null;

        // "assetContextMenu"
        if ((context.activeTab.assetSelection.length) !== 0 && (triggerFrom === null)) {
            triggerFrom = 'Assets'
        };

        if ((context.activeTab.folderSelection.length) !== 0 && (triggerFrom === null)) {
            triggerFrom = 'Folder'
        };

        //console.log(triggerFrom)


        if (context.activeTab.folderSelection[0].assetPath === userHome) {
            alert("Deleting own userhome is not allowed");
            contextService.close();
        }

        // Check if in DELETE and warn user
        if ((context.activeTab.folderSelection[0].assetPath).includes(userHome + '/' + BINNAME)) {
            // need improve
            alert("You are trying to delete something from DELETE<br>Not implementation yet<br>Use 'Supp Empty' instead");
            contextService.close();

        } else {

            if (triggerFrom === null) {
                console.log('Internal Plugin Error');
                document.getElementById('info').innerHTML = 'Internal Plugin Error';
                document.getElementById('btnCancel').style.display = 'block';
                return;
            }

            if (triggerFrom === 'Assets') {
                //console.log('>>> Assets')
                // Asset context menu
                let selection = context.activeTab.assetSelection;

                selection.forEach((items) => {
                    let item = {};
                    item.assetPath = items.assetPath;
                    item.movePath = userHome + '/' + BINNAME + items.assetPath;
                    selected.push(item);
                });
            } else {
                // Folder context menu
                //console.log('>>> Folder')

                let folderObj = {};
                folderObj.assetPath = context.activeTab.folderSelection[0].assetPath;
                folderObj.movePath = userHome + '/' + BINNAME + context.activeTab.folderSelection[0].assetPath
                selected.push(folderObj);
            }

            let message = "<h4>Deleting " + triggerFrom + "</h4>"
            if (triggerFrom === "Assets") {
                message += selected.length + ' object(s) to be moved<br>';

                message += '<ul>';
                let assetList = selected.map((item) => { return item.assetPath });
                assetList = assetList.join('<br>');

                message += assetList;
                message += '</ul>';
            } else {
                let result = await APIService.search({
                    q: 'ancestorPaths:"' + context.activeTab.folderSelection[0].assetPath + '"',
                    metadataToReturn: '',
                    num: 10000,
                });
                //console.log(result);

                let totalObject = result.totalHits;
                //console.log('totalHits:', totalObject)

                // result = await APIService.browse({
                //     path: context.activeTab.folderSelection[0].assetPath,
                //     includeFolders: true,
                //     includeAsset: true,
                // })
                //console.log(result);

                message += '<ul>';
                message += "<b>" + context.activeTab.folderSelection[0].assetPath + "</b><br>";
                message += 'Total object(s): ' + totalObject + '<br>';
                message += '<br><small>Note: Virtual object(s), such as Collection(s) and Empty Folder(s) which are <strong>not included</strong> in object count, will be deleted as well</small><br>'
                message += '</ul>';
            }

            document.getElementById('info').innerHTML = message;
            //document.getElementById('btnOK').style.display = 'block';
            //document.getElementById('btnCancel').style.display = 'block';

        }


    } catch (error) {
        console.log('*** CATCH MAIN ***')
        console.log(error);
        document.getElementById('info').innerHTML = error;
        return;
    }
}



async function btnOK() {
    console.log('OK');
    console.log(selected);

    for (let idx = 0; idx < selected.length; idx++) {
        let param = {
            source: selected[idx].assetPath,
            target: selected[idx].movePath
        };
        console.log(param);

        // Plugin setting to ensure no not authorized deletion
        // Enable expression = elvisContext.hasFilteredSelection()
        // Required permission mask = ------X--
        //let assetMove = await APIService.copy(param);
        let assetMove = await APIService.move(param);
    };

    document.getElementById('info').innerHTML = selected.length + ' objects deleted';
    document.getElementById('btnOK').style.display = 'none';
    document.getElementById('btnCancel').innerHTML = 'Close';

};

function btnCancel() {
    contextService.close();
};
