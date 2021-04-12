
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 


export function format(document: vscode.TextDocument, range: vscode.Range, options:vscode.FormattingOptions) {

	var editor = vscode.window.activeTextEditor;
	var selection = editor.selection;
	// 当前起始光标所在行
	let start_line = selection.start.line
	// 当前结束光标所在行
	let end_line = selection.end.line
	// 当前起始光标所在行的字符串位置
	let start_character = selection.start.character
	// 当前结束光标所在行的字符串位置
	let end_character = selection.end.character
	// 获取某行的字符串
	// let cur_line_length = document.lineAt(selection.end.line).text.length

	console.log({start_line,end_line,start_character,end_character})
	function find_txt({start_line,end_line,start_character,end_character}){
		let start = new vscode.Position(start_line, start_character);
		let end   = new vscode.Position(end_line, end_character);
		let range = new vscode.Range(start, end);
		var text = editor.document.getText(range);
		return text
	}
	function create_range(){
		let start = new vscode.Position(start_line, start_character);
		let end   = new vscode.Position(end_line, end_character);
		let range = new vscode.Range(start, end);
		return range
	}
	function find_left(){
		
		let txt = find_txt({start_line,end_line,start_character,end_character})
		if(txt.indexOf('{')==0){
			return true
		}
		start_character-=1
		if(start_character<0){
			// console.log('start_character<0',{start_line,end_line,start_character,end_character})
			start_line-=1
			if(start_line>=1){
				// 获取某行的字符串长度
				let cur_line_length = document.lineAt(start_line).text.length
				start_character = cur_line_length - 1
			}
		}
		if(start_line<0){
			return console.log('start_line<0',{start_line,end_line,start_character,end_character})
		}
		return find_left()
	}
	function find_rigth(){
		
		let txt = find_txt({start_line,end_line,start_character,end_character})
		// console.log(txt,{start_line,end_line,start_character,end_character})
		if(txt.indexOf('}')>-1){
			// console.log(txt)
			return true
		}
		end_character+=1
		// 获取某行的字符串长度
		let cur_line_length = document.lineAt(end_line).text.length

		if(end_character>cur_line_length-1){
			end_line+=1
			end_character = 0
			// if(end_line>=1){
			// 	// 获取某行的字符串长度
			// 	let cur_line_length = document.lineAt(start_line).text.length
			// 	start_character = cur_line_length - 1
			// }
		}
		// if(start_line<0){
		// 	return console.log('start_line<0',{start_line,end_line,start_character,end_character})
		// }
		return find_rigth()
	}
	find_left()
	find_rigth()
	console.log(find_txt({start_line,end_line,start_character,end_character}))
	let result: vscode.TextEdit[] = [];
	// let start = new vscode.Position(start_line, start_character);
	// let end   = new vscode.Position(end_line, end_character);
	// let range = new vscode.Range(start, end);
	let txt = find_txt({start_line,end_line,start_character,end_character})

	
	
	function createIndent(){
		let indent_char = options.insertSpaces ? ' ' : '\t';
		let	indent_size = options.insertSpaces ? options.tabSize : 1;
		let res = ''
		for(let i=0;i<indent_size;i++){
			res+=indent_char
		}
		return res
	}
	let indent_char_size = createIndent()

	txt = txt.replace(/[\s\n]/g,'')
	txt = txt.replace(/;/g,';\n' + indent_char_size)
	txt = txt.replace('{','{\n' + indent_char_size)
	txt = txt.replace(indent_char_size + '}','}')
	txt = txt + '\n'

	range = create_range()
	console.log(txt,range)
	
	result.push(new vscode.TextEdit(range, txt));
	return result
};

export function format_close() {
	const editor_config = vscode.workspace.getConfiguration('editor');
	let tabSize = editor_config.get('tabSize')
	tabSize = new Array(tabSize).fill(0).reduce((p)=>{return p+=' '},'')
	var editor = vscode.window.activeTextEditor;
	var selection = editor.selection;
	// 当前起始光标所在行
	let start_line = selection.start.line
	// 当前结束光标所在行
	let end_line = selection.end.line
	// 当前起始光标所在行的字符串位置
	let start_character = selection.start.character
	// 当前结束光标所在行的字符串位置
	let end_character = selection.end.character

	console.log({start_line,end_line,start_character,end_character})
	function find_txt({start_line,end_line,start_character,end_character}){
		let start = new vscode.Position(start_line, start_character);
		let end   = new vscode.Position(end_line, end_character);
		let range = new vscode.Range(start, end);
		var text = editor.document.getText(range);
		return text
	}
	function find_left(){
		
		let txt = find_txt({start_line,end_line,start_character,end_character})
		// console.log(txt)
		if(txt.indexOf('{')==0){
			return true
		}
		start_character-=1
		if(start_character<0){
			// console.log('start_character<0',{start_line,end_line,start_character,end_character})
			start_line-=1
			if(start_line<0){
				return console.log('start_line<0',{start_line,end_line,start_character,end_character})
			}else{
				// 获取某行的字符串长度
				let cur_line_length = editor.document.lineAt(start_line).text.length
				start_character = cur_line_length - 1
			}
		}

		return find_left()
	}
	function find_rigth(){
		
		let txt = find_txt({start_line,end_line,start_character,end_character})
		// console.log(txt,{start_line,end_line,start_character,end_character})
		if(txt.indexOf('}')>-1){
			// console.log(txt)
			return true
		}
		end_character+=1
		// 获取某行的字符串长度
		let cur_line_length = editor.document.lineAt(end_line).text.length

		if(end_character>cur_line_length-1){
			end_line+=1
			end_character = 0
			// if(end_line>=1){
			// 	// 获取某行的字符串长度
			// 	let cur_line_length = document.lineAt(start_line).text.length
			// 	start_character = cur_line_length - 1
			// }
		}
		// if(start_line<0){
		// 	return console.log('start_line<0',{start_line,end_line,start_character,end_character})
		// }
		return find_rigth()
	}
	find_left()
	find_rigth()
	console.log(find_txt({start_line,end_line,start_character,end_character}))
	let start = new vscode.Position(start_line, start_character);
	let end   = new vscode.Position(end_line, end_character);
	let range = new vscode.Range(start, end);
	let txt = find_txt({start_line,end_line,start_character,end_character})
	txt = txt.replace(/[\s\n]/g,'') + '\n'
	editor.edit(builder=> {
		builder.replace(range, txt);
	}).then(success=> {});
};

export function format_open() {
	const editor_config = vscode.workspace.getConfiguration('editor');
	let tabSize = editor_config.get('tabSize')
	// console.log(tabSize)
	tabSize = new Array(tabSize).fill(0).reduce((p)=>{return p+=' '},'')
	var editor = vscode.window.activeTextEditor;
	var selection = editor.selection;
	// 当前起始光标所在行
	let start_line = selection.start.line
	// 当前结束光标所在行
	let end_line = selection.end.line
	// 当前起始光标所在行的字符串位置
	let start_character = selection.start.character
	// 当前结束光标所在行的字符串位置
	let end_character = selection.end.character

	console.log({start_line,end_line,start_character,end_character})
	function find_txt({start_line,end_line,start_character,end_character}){
		let start = new vscode.Position(start_line, start_character);
		let end   = new vscode.Position(end_line, end_character);
		let range = new vscode.Range(start, end);
		var text = editor.document.getText(range);
		return text
	}

	// 寻找方向
	let find_start_direction = 'left'
	function find_left(){

		let txt = find_txt({start_line,end_line,start_character,end_character})
		// console.log(txt)
		// 往右找
		if(txt.indexOf('}')==0){
			find_start_direction = 'right'
		}

		if(find_start_direction == 'left'){
			// 往左移动
			start_character-=1
			// 已经到最左面
			if(start_character<0){
				// 往上找找一行
				start_line-=1
				// 行数不能为负数
				if(start_line<0){
					return console.log('start_line<0',{start_line,end_line,start_character,end_character})
				}else{
					// 获取上一行行的字符串长度
					let cur_line_length = editor.document.lineAt(start_line).text.length
					start_character = cur_line_length - 1
				}
			}
		}else{
			// 往右移动
			start_character+=1
			let cur_line_length = editor.document.lineAt(start_line).text.length
			if(start_character > cur_line_length-1){
				start_line+=1
				start_character = 0
			}
		}
		// 找到了
		let dex = txt.indexOf('{')
		if(dex>-1){
			start_character = dex
			end_character = start_character
			return true
		}
		
		return find_left()
	}
	function find_rigth(){
		
		let txt = find_txt({start_line,end_line,start_character,end_character})
		// console.log(txt,{start_line,end_line,start_character,end_character})
		if(txt.indexOf('}')>-1){
			// console.log(txt)
			return true
		}
		end_character+=1
		// 获取某行的字符串长度
		let cur_line_length = editor.document.lineAt(end_line).text.length

		if(end_character>cur_line_length-1){
			end_line+=1
			end_character = 0
			// if(end_line>=1){
			// 	// 获取某行的字符串长度
			// 	let cur_line_length = document.lineAt(start_line).text.length
			// 	start_character = cur_line_length - 1
			// }
		}
		// if(start_line<0){
		// 	return console.log('start_line<0',{start_line,end_line,start_character,end_character})
		// }
		return find_rigth()
	}
	find_left()
	find_rigth()
	console.log(find_txt({start_line,end_line,start_character,end_character}))
	let start = new vscode.Position(start_line, start_character);
	let end   = new vscode.Position(end_line, end_character);
	let range = new vscode.Range(start, end);
	let txt = find_txt({start_line,end_line,start_character,end_character})
	txt = txt.replace(/[\s\n]/g,'')
	txt = txt.replace(/;/g,';\n' + tabSize)
	txt = txt.replace('{','{\n' + tabSize)
	txt = txt.replace(tabSize + '}','}')
	txt = txt + '\n'
	// console.log(txt)
	// console.log(range)
	editor.edit(builder=> {
		builder.replace(range, txt);
	}).then(success=> {});
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('Coder.cssOpen', () => {
        format_open()
    }));
	context.subscriptions.push(vscode.commands.registerCommand('Coder.cssClose', () => {
        format_close()
    }));
}