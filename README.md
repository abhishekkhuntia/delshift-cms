# DelShift Inline CMS

It is an open source, offline CMS for editing content for the html pages present locally in your system. 
Just install it using:

    npm i -g delshift-inline-cms
 ## Usage:
1.   Once it is installed go to the target folder, open the terminal and run **delcms**.
  Wait till it opens your default browser with the URL http://localhost:4040.
  It will load the default page with pages list to select. As per the current build, it will only look for html files in its *root* folder; not inside the sub folders.
  2. Upon selecting a page, it loads the page in edit mode. In this, you will get an action header on the top to represent anchors for 'page-list' and 'live' pages. **Live URLs** loads the page without the editing functionality.
  ## Features:
  3. **Change Image:** In order to change an image, simply click on any image, it shall open a dialog with an image gallery of images present in the target folder. 
  4. **Content Change**: Upon hovering on the editable contents, it will be having a dashed border around it, this will highlight and easy to identify. Upon clicking on the element, it will make it editable. 
  > Note: As of now there isn't use of any WYSWYG editor, this shall be included in later version.
  5. **Link Change**: Once you enable content edit as mentioned above, simply select some text. If it an existing anchor, it will show a popup option to change link. Upon clicking on the option, it will open a dialog with two options of giving external URLs like https://www.google.com or you can select any internal page, irrespective of the location of the page in the folder.
  6. **Saving Content **:  There exists an option at bottom right, this button upon click will ask you to confirm about saving the page.  Upon accepting it, it will change the content of the file for you.
  > Note: Creation of new links isn't supported as such. But it shall be available once there is WYSWYG editor.