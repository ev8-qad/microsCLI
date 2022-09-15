#! /usr/bin/env node
const inquirer = require('inquirer');
const CONFIG_SERVER 	= 'start "start CONFIG server" call java -jar -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dconfig.subdir=C:/PRECISION/WebUI/microservices/config/config-repo/develop -Dspring.profiles.active=native configserver-9.0.1-0-SNAPSHOT.jar precisionsoftware.cloud.config.ConfigApplication'
const EUREKA_SERVER 	= 'start "start EUREKA server" call java -jar -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dconfig.subdir=C:/PRECISION/WebUI/microservices/config/config-repo/develop -Dspring.profiles.active=native eureka-9.0.1-1-SNAPSHOT.jar precisionsoftware.cloud.eureka.EurekaApplication'
const GATEWAY_SERVER 	= 'start "start GATEWAY server" call java -jar -Dproperties.dir=C:\PRECISION\WebUI -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active=LOG_LOCAL,DEVELOP_LOCAL gateway-9.0.1-2-SNAPSHOT.jar com.precisionsoftware.gateway.GatewayApplication'
var SIDECAR_SERVER 	= 'start "start SIDECAR server" call java -jar -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active=${PROFILE} -Dconfigserver.port=18888 -Xms256m -Xms512m -XX:+UseG1GC  sidecar-1.0.1-0-SNAPSHOT.jar com.precisionsoftware.sidecar.SidecarApplication'
const FOUNDATION_SERVER = 'start "start FOUNDATION server" call java -jar -Dproperties.dir=C:\PRECISION\WebUI -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active=LOG_LOCAL,DEVELOP_MDB_SB precision-webui-foundation-9.0.13-2-SNAPSHOT.jar com.precisionsoftware.FoundationApplication'
var inprogress = false;

inquirer
  .prompt([
    {
      type: 'checkbox',
      name: 'microservices',
      message: 'Which one do you want to start?',
      choices: ['config-server', 'eureka', 'gateway', 'sidecar', 'foundation'],
    },
	{
      name: "other_profile",
      type: "confirm",
      message: "do you want to start other profile?",
	  when: (answers) => answers.microservices.includes('sidecar'),
    },
	{
      name: "profiles",
      type: "list",
      message: "which one?",
	  choices: ["LOCAL", "develop", "740", "741", "538"],
      when: (answers) => answers.other_profile === true,
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.microservices);
	if(answers.other_profile == true){
		if(answers.profiles.includes('LOCAL')){
			start(answers.microservices, '')
		}
		if(answers.profiles.includes('develop')){
			start(answers.microservices, 'DEVELOP_734')
		}
		if(answers.profiles.includes('740')){
			start(answers.microservices, 'DEVELOP_740')
		}
		if(answers.profiles.includes('538')){
			start(answers.microservices, 'DEVELOP_741')
		}
		if(answers.profiles.includes('develop')){
			start(answers.microservices, 'DEVELOP_538')
		}
	}else{
		start(answers.microservices, '')
	}
  });
  
async function start(microservices, profile){
	if(inprogress == false) { 
		if(microservices.includes('config-server')){
			console.info('config-server')
			runCommand(CONFIG_SERVER);
			await sleep(20000);
		}
		if(microservices.includes('eureka')){
			console.info('EUREKA')
			runCommand(EUREKA_SERVER);
			await sleep(20000);
		}
		if(microservices.includes('gateway')){
			console.info('GATEWAY')
			runCommand(GATEWAY_SERVER);
		}
		if(microservices.includes('sidecar')){
			SIDECAR_SERVER = SIDECAR_SERVER.replace("${PROFILE}", profile);
			console.info('SIDECAR')
			runCommand(SIDECAR_SERVER);
		}
		if(microservices.includes('foundation')){
			console.info('foundation')
			if(microservices.includes('sidecar') || microservices.includes('gateway')){
				await sleep(20000);
			}
			runCommand(FOUNDATION_SERVER);
		}
	}
	inprogress = true;
}

async function runCommand(command) {
	
var child_process = require('child_process');

var task1 = child_process.exec(command, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}