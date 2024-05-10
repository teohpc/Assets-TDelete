# Supplementary Delete/Restore Plugins

## Pure Javascript and WoodWing Assets SDK (REST API) implementation of Delete and Restore feature for WoodWing Assets. No 3rd libraries.

### delete.html
If triggered from folderContextMenu, the plugin uses **move** API call to move the selected folder to userzone/DELETE folder

If triggered from assetContextMenu, the plugins uses **move** API call to move all the selected assets to userzone/DELETE folder

#### External Action Plugin Configuration
* Name
    * *own preference*
* Title
    * *own preference*
* URL
    * https://integration.wwapac.com/Assets/TDelete/delete.html
* User Interface
    * Dialog
* Width
    * 500
* Height
    * 400
* Action Location
    * Asset context menu
    * Folder content menu

### restore.html
If triggered from folderContextMenu, the plugin uses **move** API call to move the selected folder from userzone/DELETE back to original location

If triggered from assetContextMenu, the plugins uses **move** API call to move  all the selected assets to userzone/DELETE back to original location


#### External Action Plugin Configuration
* Name
    * *own preference*
* Title
    * *own preference*
* URL
    * https://integration.wwapac.com/Assets/TDelete/restore.html
* User Interface
    * Dialog
* Width
    * 500
* Height
    * 400
* Action Location
    * Asset context menu
    * Folder content menu

### empty.html
Empty everything in userzone/DELETE using **remove** API call

#### External Action Plugin Configuration
* Name
    * *own preference*
* Title
    * *own preference*
* URL
    * https://integration.wwapac.com/Assets/TDelete/empty.html
* User Interface
    * Dialog
* Width
    * 300
* Height
    * 100
* Action Location
    * Toolbar
