# RbxAssetLibrary
Allows you to input AssetIDs found in the F9 menu's Memory tab into a text file, later parsed as an HTML page you can view. As of now, only Texture IDs are supported, so SoundIDs and MeshIDs are especially incompatible.

## How to use
Download this repository as a ZIP, then extract the contents as a new folder. Afterwards, you can run `main.js` to start receiving page requests.

While `main.js` is running, you can view all the assets within the `assets.txt` file as images titled with their respective IDs via the URL: [localhost:9020](localhost:9020).

### Inserting new assets
If you want to get new AssetIDS into the generated page, you can append rbxassetid or AssetDelivery URLs to new lines. Reloading the page will handle these new assets, getting rid of duplicates if any. You don't need to restart `main.js` after editing `assets.txt`, it will recheck the text file every time the page is reloaded.

> [!WARNING]
> ALL assets are loaded in the same page, causing the page to load slowly. If you need to load the page faster, you should make a copy of `assets.txt` somewhere outside of RbxAssetLibrary's directory and wipe the original `assets.txt` of all its contents.

### Finding new assets
If you are looking for assets within other games, you can press `F9` and click the Memory tab from there. Afterwards, search for `GraphicsTexture`.

![image](https://github.com/user-attachments/assets/ee47f560-e70e-43b2-bbc6-2dc4e103fd1f)

Now, you can either write down IDs manually or make screenshots and feed them to a Image To Text service. The latter option is usually much easier and quicker, as there can be hundreds of assets to look through.

If you need a good Image To Text service, [this website](https://ifimageediting.com/image-to-text) should do the trick! It supports a large amount of screenshots at once and is free to use. There might be better options you are aware of, but this is the one I've found that has helped me the most.

**Just make sure you don't click on advertisements pretending to be buttons.** These specific parts of the website should be the only things you need to touch. Anything else is either irrelevant or an advertisement in disguise.

Also, make sure the environment behind the developer console in screenshots isn't too noisy or contains underlying text. The service often has trouble determining the contrast between the text and the rest of the image if the background is too complex, and can accidentally assume unrelated text as part of the conversion if you don't properly set up the screenshot to be simple enough for the service to understand.

![image](https://github.com/user-attachments/assets/d82c0a8a-96f9-4293-ad65-f3ad5c05bf80)
![image](https://github.com/user-attachments/assets/1aeef156-ee33-4fb8-98ea-c5c0107076c8)
