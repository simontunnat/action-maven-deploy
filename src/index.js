const fs = require('fs');
const os = require('os');
const path = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');

async function createSettingsFile(location, serverId, username, password) {
  const content = generateMavenSettings(serverId, username, password);

  await fs.writeFileSync(location, content, {
    encoding: 'utf-8',
    flag: 'w'
  });

  core.debug(`created settings file ${location}`)
}

function generateMavenSettings(serverId, usernameEnv, passwordEnv) {
  return `
  <settings>
      <servers>
        <server>
          <id>${serverId}</id>
          <username>\${env.${usernameEnv}}</username>
          <password>\${env.${passwordEnv}}</password>
        </server>
      </servers>
  </settings>
  `;
}

async function run() {
  try {
    const username = core.getInput('username', {required: true});
    const password = core.getInput('password', {required: true});
    const repository = core.getInput('repository', {required: true});
    const mavenGoals = core.getInput('maven-goals', {required: false}) || 'clean deploy';
    const mavenArgs = core.getInput('maven-args', {required: false}) || '';

    const serverId = 'action-maven-deploy';
    const usernameEnv = "ACTION_MAVEN_DEPLOY_USERNAME";
    const passwordEnv = "ACTION_MAVEN_DEPLOY_PASSWORD";

    // save the settings.xml to systems temporary directory
    const settingsFile = path.join(os.tmpdir(), 'action-maven-deploy-settings.xml');

    // the credentials will NOT be saved to the filesystem
    await createSettingsFile(settingsFile, serverId, usernameEnv, passwordEnv);

    // the credentials will only be available to this processes children (e.g. "mvn")
    process.env[usernameEnv] = username;
    process.env[passwordEnv] = password;

    await exec.exec(`mvn -B ${mavenGoals} --settings "${settingsFile}" -DaltDeploymentRepository="${serverId}::${repository}" ${mavenArgs}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();