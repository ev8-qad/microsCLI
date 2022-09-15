#! /usr/bin/env node
const inquirer = require('inquirer');
const CONFIG_SERVER 	= 'start "start CONFIG server" call java -jar -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dconfig.subdir=C:/PRECISION/WebUI/microservices/config/config-repo/develop -Dspring.profiles.active=native configserver-9.0.1-0-SNAPSHOT.jar precisionsoftware.cloud.config.ConfigApplication'
const EUREKA_SERVER 	= 'start "start EUREKA server" call java -jar -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dconfig.subdir=C:/PRECISION/WebUI/microservices/config/config-repo/develop -Dspring.profiles.active=native eureka-9.0.1-1-SNAPSHOT.jar precisionsoftware.cloud.eureka.EurekaApplication'
const GATEWAY_SERVER 	= 'start "start GATEWAY server" call java -jar -Dproperties.dir=C:\PRECISION\WebUI -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active=LOG_LOCAL,DEVELOP_LOCAL gateway-9.0.1-2-SNAPSHOT.jar com.precisionsoftware.gateway.GatewayApplication'
const SIDECAR_SERVER 	= 'start "start SIDECAR server" call java -jar -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active= -Dconfigserver.port=18888 -Xms256m -Xms512m -XX:+UseG1GC  sidecar-1.0.1-0-SNAPSHOT.jar com.precisionsoftware.sidecar.SidecarApplication'
const FOUNDATION_SERVER = 'start "start FOUNDATION server" call java -jar -Dproperties.dir=C:\PRECISION\WebUI -Dconfigserver.port=18888 -Dconfig.dir=C:/PRECISION/WebUI/microservices/config/config-repo/root -Dspring.profiles.active=LOG_LOCAL,DEVELOP_MDB_SB precision-webui-foundation-9.0.13-2-SNAPSHOT.jar com.precisionsoftware.FoundationApplication'

inquirer
  .prompt([
    {
      type: 'checkbox',
      name: 'microservices',
      message: 'Which one do you want to start?',
      choices: ['config-server', 'eureka', 'gateway', 'sidecar', 'foundation'],
    },
  ])
  .then(answers => {
    console.info('Answer:', answers.microservices);
	start(answers.microservices)
  });
  
async function start(microservices){
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