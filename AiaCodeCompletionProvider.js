const vscode = require('vscode');
const { postCompletion } = require('./RequestCompletion')

let timeout;

/**
 *
 * @param {context} context
 */
const provideInlineCompletionItems = async (context) => {
	// 获取当前激活的文本编辑器
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    const position = editor.selection.active;
    const autoTriggerEnabled = vscode.workspace.getConfiguration("aia").get("AutoTriggerCompletion");
    const beforeCursor = vscode.workspace.getConfiguration("aia").get("beforeCursor");
    const afterCursor = vscode.workspace.getConfiguration("aia").get("afterCursor");
    if(!autoTriggerEnabled){
        return;
    }
    const fimCurrentCode = getFimPrefixCode(document, position, 1);
    const fimPrefixCode = getFimPrefixCode(document, position, beforeCursor);
    const fimSuffixCode = getFimSuffixCode(document, position, afterCursor);
    if (isNil(fimPrefixCode) && isNil(fimSuffixCode)) {
        return;
    }
    console.log("getFimPrefixCode:\n" + fimPrefixCode);
    console.log("getFimSuffixCode:\n" + fimSuffixCode);
        //创建装饰器类型
    const decorationType = vscode.window.createTextEditorDecorationType({
        color: 'gray', // 灰色字体
    });


    if (editor) {
        // 获取光标位置
        const currentPosition = editor.selection.start;
        let lines;
        let res;

        //register the command for get the Code hint
        context.subscriptions.push(vscode.commands.registerCommand('aia.getInfo', async () => {
            // console.log(fimCurrentCode.length);
            // console.log('Text Before Cursor:', textBeforeCursor);
            // res = await postCompletion(getFimPrefixCode , getFimSuffixCode)
            res = `(document, position, beforeCursor, afterCursor) => {
                const firstLine = Math.max(position.line - beforeCursor, 0);
                const lastLine = Math.min(position.line + afterCursor, document.lineCount);
                const range = new vscode`
            console.log(res)

            // 将文本按行拆分
            lines = res.split('\n');
            console.log(res);
            console.log(lines);

            // 创建装饰器范围数组
            const decorations = lines.map((line, index) => {
                return {
                range: new vscode.Range(currentPosition.line + index , fimCurrentCode.length, currentPosition.line + index, line.length),
                renderOptions: {
                after: {
                    contentText: line,
                    color: 'gray', // 灰色字体
                },
                },
            }});

            await editor.edit(editBuilder => {
                for(let i = 0; i<lines.length - 1; i++){
                    editBuilder.insert(currentPosition, '\n');
                }
            });

            // 应用装饰器
            editor.setDecorations(decorationType, decorations)

            editor.selection = new vscode.Selection(currentPosition,currentPosition)
        }));

        //register the command for get the Code completion
        context.subscriptions.push(vscode.commands.registerCommand('aia.setInfo',  async() => {
            if(!lines && !res) return

            // 应用装饰器
            editor.setDecorations(decorationType, []);

            const replaceRange = new vscode.Range(new vscode.Position(currentPosition.line, fimCurrentCode.length) , new vscode.Position(currentPosition.line + lines.length - 1, 0))

            editor.edit(editBuilder => {
                editBuilder.replace(replaceRange, res);
            });

            // //插入操作
            // await editor.edit(editBuilder => {
            //     return editBuilder.insert(currentPosition, res);
            // });
        }));

    }
}



/**
 *  Get the previous text of the cursor
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @param {number} beforeCursor
 * @returns string
 */
const getFimPrefixCode = (document, position, beforeCursor) => {
    const firstLine = Math.max(position.line - beforeCursor, 0);
    const range = new vscode.Range(firstLine, 0, position.line, position.character);
    return document.getText(range).trim();
}

/**
 *  Obtain the following text for the cursor
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @param {number} afterCursor
 * @returns string
 */
const getFimSuffixCode = (document, position, afterCursor) => {
    const startLine = position.line + 1;
    const endLine = Math.min(startLine + afterCursor, document.lineCount);
    const range = new vscode.Range(position.line, position.character, endLine, 0);
    return document.getText(range).trim();
}

/**
 * isNUll Method
 * @param {*} value
 * @returns string
 */
const isNil = (value) => {
    return value === undefined || value === null || value.length === 0;
}

module.exports = {
    provideInlineCompletionItems
}