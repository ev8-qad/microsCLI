#! /usr/bin/env node
import inquirer from 'inquirer'
import util from 'util'
const exec = util.promisify(require('child_process').exec)

inquirer
  .prompt([
    {
      type: 'list',
      name: 'microservices',
      message: 'Which one do you want to start?',
      choices: ['config-server', 'eureka', 'gateway', 'sidecar', 'foundation'],
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.microservices);
	start(answers.microservices)
  });
  
function start(microservices){
	if(microservices === 'config-server'){
		console.info('config-server')
		myFunction();
	}
	
}

async function runCommand(command) {
  const { stdout, stderr, error } = await exec(command);
  if(stderr){console.error('stderr:', stderr);}
  if(error){console.error('error:', error);}
  return stdout;
}


async function myFunction () {
    // your code here building the command you wish to execute ...
    const command = 'dir';
    const result = await runCommand(command);
    console.log("_result", result);
    // your code here processing the result ...
}	