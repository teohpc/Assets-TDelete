/*

*/
const BINNAME = 'DELETE';

// Global
let contextService;
let APIService;

/**
 * 
 */
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

        let selected = [];

        let param = {
            folderPath: userHome + '/' + BINNAME,
        };

        console.log('query:', userHome + '/' + BINNAME)
        let result = await APIService.search({
            q: 'ancestorPaths: "' + userHome + '/' + BINNAME + '"',
            metadataToReturn: '',
            num: 10000,
        });

        console.log(result);

        if (result.totalHits === 0) {
            alert("Nothing to empty");
            contextService.close();
        } else {

            let assetRemove = await APIService.remove(param);
            //console.log(assetRemove);
            alert("Object(s) " + assetRemove.processedCount + " emptied");
        }

        contextService.close();

    } catch (error) {
        console.log('*** CATCH MAIN ***')
        console.log(error);
        document.getElementById('info').innerHTML = error;
        return;
    }
}

/**
 * 
 */
function btnCancel() {
    contextService.close();
}
