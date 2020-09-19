var fs = require('fs');
var path = require('path');
var shell = require('shelljs');

//const repoPath = 'gitrepos'
const repoPath = path.join(__dirname, '../gitrepos');

function runCommonLine() {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
  processGitSync();
}

function processGitSync(){
  console.log('clone started..');
  cloneMainRepo();
  cloneSecondRepo();
  console.log('clone ended....')
  
  console.log('checkout to a changeset start...')
  checkoutChangeset('webhook-main-repo', 'ec6e8184d609896f927a1382c105dc92e5c23361');
  console.log('checkout to a changeset end...')

  console.log('new branch create start....')
  createABranch('webhook-connect-one', 'translation_1');
  console.log('new branch create end....')

  console.log('copy json files.... start')
  copyLocales();
  console.log('copy json files.... end..')

  console.log('commit start')
  commitChanges();
  console.log('commit end...')

  pushAndRaisePR();
}

function pushAndRaisePR(){
  const connectOneRepoPath = path.join(repoPath, 'webhook-connect-one');
  shell.pushd(connectOneRepoPath);
  shell.exec(`git push --set-upstream origin translation_1`);
  shell.exec(`hub pull-request -b master -m "test"`)
}

function commitChanges() {
  const connectOneRepoPath = path.join(repoPath, 'webhook-connect-one');
  shell.pushd(connectOneRepoPath);
  shell.exec('git add .');
  shell.exec('git commit -m "translation updated"');
}

function copyLocales(){
  shell.pushd(repoPath);
  const mainRepo = path.join(repoPath , 'webhook-main-repo', 'public', 'locales');
  const distRepo = path.join(repoPath, 'webhook-connect-one', 'public', 'locales');
  shell.mkdir('-p',distRepo);
  shell.cp('-r', mainRepo, distRepo);
}

function createABranch(repoName, branchName) {
  const cwdPath = path.join(repoPath, repoName);
  shell.pushd(cwdPath);
  shell.exec(`git branch ${branchName}`);
  shell.exec(`git checkout ${branchName}`);
}

function checkoutChangeset(repoName, changeset) {
  const cwdPath = path.join(repoPath, repoName)
  shell.pushd(cwdPath);
  shell.exec('git pull');
  shell.exec(`git checkout ${changeset}`)
}

function cloneSecondRepo(){
  const repoUrl = 'https://github.com/pervezalam777/webhook-connect-one.git';
  doCloneRepo(repoUrl, 'webhook-connect-one');
}

function cloneMainRepo() {
  const repoUrl = 'https://github.com/pervezalam777/webhook-main-repo.git';
  doCloneRepo(repoUrl, 'webhook-main-repo');
}

function doCloneRepo(repo, repoName) {
  try {
    fs.readdirSync(path.join(repoPath, repoName));
  } catch(err) {
    shell.pushd(repoPath);
    const cmd = `git clone ${repo}`;
    //TODO: as per doc it is synchronous call.
    shell.exec(cmd, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });
  }
}

module.exports = runCommonLine;
