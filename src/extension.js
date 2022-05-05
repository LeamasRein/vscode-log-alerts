//------------------------------------------------------------------------------
/** GLOBAL */
//------------------------------------------------------------------------------
const
	vscode = require('vscode'),
	process = require('child_process');

let getLogsCommand, parsingLogPattern, parsingLogRegexp, logsPipeline;

//------------------------------------------------------------------------------
/** FUNCTIONS */
//------------------------------------------------------------------------------

/**
 * Reload vars from vs configuration
 */
const configReload = () => {

	getLogsCommand = vscode.workspace.getConfiguration().get('logAlerts.command');
	parsingLogPattern = vscode.workspace.getConfiguration().get('logAlerts.pattern');
	parsingLogRegexp = new RegExp(parsingLogPattern, 'ig');
};

/**
 * Parsing log and alert them
 * @param {string} message 
 */
const handlePipelineLog = (message) => {
	
	[...message.matchAll(parsingLogRegexp)].forEach(match => {

		vscode.window.showErrorMessage(match[1]);
	});
};

/**
 * Stop log parsing pipeline
 */
const stopPipeline = () => {

	if(logsPipeline != undefined)
	{
		logsPipeline.stdout.pause();
		logsPipeline.stdin.pause();
		logsPipeline.kill();

		logsPipeline = undefined;
	}
}

/**
 * Stop log parsing pipeline
 */
const startPipeline = () => {

	stopPipeline();
	configReload();

	if(!getLogsCommand || !parsingLogPattern)
		return;

	let getLogsCommandParts = getLogsCommand.split(' ');
	logsPipeline = process.spawn(getLogsCommandParts.shift(), getLogsCommandParts);
	logsPipeline.stdout.on('data', data => handlePipelineLog(data.toString()));
}

//------------------------------------------------------------------------------
/** MAIN */
//------------------------------------------------------------------------------
/**
 * @param {vscode.ExtensionContext} context
 */
function activate() {
	
	startPipeline();

	vscode.commands.registerCommand('logAlerts.reload', () => {
		startPipeline();
	});
}

function deactivate() {

	stopPipeline();
}

module.exports = {
	activate,
	deactivate
}
