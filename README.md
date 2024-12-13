# JCQC LV8 Declutterer

## Installation

For this to work you need to have the [TamperMonkey](https://www.tampermonkey.net/index.php?browser=chrome) extension installed for your browser. It may tell you it needs you to enable developer mode, follow the instructions it provides. This extension works by allowing code to be added to a webpage once it has already loaded. The script that I provide here is simply interacting with the page that is already loaded and does not make changes to anything in the data base.

- Click on the links above to view the code for [`deuglify-lv8.js`](https://github.com/jeffreycharters/LabvantageUX/blob/main/deuglify-lv8.js) . Do not use the `*.ts` version! It will not work!

- Click the button above the code that allows you to "Copy raw file". The code is copied to your clipboard.

- Once you have installed TamperMonkey, click on the icon and select "Dashboard".

- Click on the `+` sign and a new editor will appear. Paste the contents of the file into it.

- Press `CTRL+S` or use `File` > `Save` to save the file.

- Reload Labvantage in another window. Should be better now!

## Help, it broke something!

In case of emergency, you can click on the TamperMonkey icon and click "Enabled" which will then disable the scripts and everything will go back to the way it was before. If you broke something, you can either start over with the code provided or ask JC for assistance getting things working again.

## Configuration

Near the top of the code you've pasted, you'll see `/* OPTIONS */`. There are some instructions here on what the different options do. Your options for things that are true or false are `true` or `false` without quotations around them. Something like this: `["Thing", "Thing again"]` is a list. The different items are in quotation marks and they are separated by a comma. You can add or remove things. Code is very exact, so if you try something and it doesn't work, make sure things are spelled exactly the same, case-sensitive and whatnot.

Lines that start with `//` are comments. This will comment out the rest of the line, but not anything below it. So for example, in the `manageQueriesToHide` list, you can add two slashes in front of things you don't want hidden, or remove the slashes from things you do want hidden.

## Etcetera

Ask JC if things aren't behaving like you expect. He likes it when his code makes life easier for people.
