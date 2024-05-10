
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

        console.log(context);

        // User current folder/selection is in userZone BINNAME folder
        if ((context.activeTab.folderSelection[0].assetPath).includes(userHome + '/' + BINNAME)) {
            console.log('OK');

            // As restore can only be performed in userZone/BINNAME
            // No permission checking required
            if ((context.activeTab.assetSelection).length !== 0) {
                // Asset context menu
                let selection = context.activeTab.assetSelection;

                // Not ready for own User zone delete
                // Error checking and validation not in place yet
                selection.forEach((items) => {
                    let item = {};
                    item.assetPath = items.assetPath;
                    item.movePath = (items.assetPath).replace(userHome + '/' + BINNAME, '');
                    selected.push(item);
                });
            } else {
                // Folder context menu
                let selection = context.activeTab.folderSelection[0];

                console.log(selection);
                let item = {};
                item.assetPath = selection.assetPath;
                item.movePath = (selection.assetPath).replace(userHome + '/' + BINNAME, '');
                selected.push(item);
            }

            console.log(selected);

            for (let idx = 0; idx < selected.length; idx++) {
                let param = {
                    source: selected[idx].assetPath,
                    target: selected[idx].movePath
                };

                let assetMove = await APIService.move(param);
                console.log(assetMove);
            }

            console.log(selected.length + ' object(s) restored');
            document.getElementById('info').innerHTML = selected.length + ' object(s) restored<p><p>';

            document.getElementById('btnOK').style.display = 'none';
            document.getElementById('btnCancel').innerHTML = 'Close';
            document.getElementById('btnCancel').style.display = 'block';
        } else {
            document.getElementById('info').innerHTML = 'Operation Not Allow<p><p>';
            console.log('Operation Not Allow');

            document.getElementById('btnOK').style.display = 'none';
            document.getElementById('btnCancel').innerHTML = 'Close';
            document.getElementById('btnCancel').style.display = 'block';
        }

    } catch (error) {
        console.log('*** CATCH MAIN ***')
        console.log(error);
        document.getElementById('info').innerHTML = error;
        return;
    }
}


function btnCancel() {
    contextService.close();
}
