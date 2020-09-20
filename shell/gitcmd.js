var fs = require('fs');
var path = require('path');
var shell = require('shelljs');

const REPO_PATH = path.join(__dirname, '../gitrepos');
const SOURCE_REPO = 'webhook-main-repo';
const DESTINATION_REPO = 'webhook-connect-one';
const PR_MERGE_TO_BRANCH = 'master'

function runCommonLine(commitDetails) {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
  processGitSync(commitDetails);
}

function processGitSync(commitDetails){
  const prBranchName =  'translation_'+commitDetails.id;
  cloneSourceRepo();
  cloneDestinationRepo();
  checkoutChangeset(SOURCE_REPO, commitDetails.id);
  createPrBranch(DESTINATION_REPO, prBranchName);
  copyDataFromSourceToDestination();
  commitChanges(`[${commitDetails.committer.username}] ${commitDetails.message}`);
  pushAndRaisePR(prBranchName);
  console.log(`PR raised for ${prBranchName}`);
}

function cloneSourceRepo() {
  const repoUrl = `https://github.com/pervezalam777/${SOURCE_REPO}.git`;
  doCloneRepo(repoUrl, SOURCE_REPO);
}

function cloneDestinationRepo(){
  const repoUrl = `https://github.com/pervezalam777/${DESTINATION_REPO}.git`;
  doCloneRepo(repoUrl, DESTINATION_REPO);
}

function doCloneRepo(repo, repoName) {
  try {
    fs.readdirSync(path.join(REPO_PATH, repoName));
  } catch(err) {
    shell.pushd(REPO_PATH);
    shell.exec(`git clone ${repo}`);
  }
}

function checkoutChangeset(repoName, changeset) {
  const cwdPath = path.join(REPO_PATH, repoName)
  shell.pushd(cwdPath);
  shell.exec('git pull');
  shell.exec(`git checkout ${changeset}`)
}

function createPrBranch(repoName, prBranchName) {
  const cwdPath = path.join(REPO_PATH, repoName);
  shell.pushd(cwdPath);
  shell.exec(`git pull`);
  shell.exec(`git checkout origin/${PR_MERGE_TO_BRANCH}`);
  shell.exec(`git branch ${prBranchName}`);
  shell.exec(`git checkout ${prBranchName}`);
}

function copyDataFromSourceToDestination(){
  const commonPath = path.join('public', 'locales');
  shell.pushd(REPO_PATH);
  const mainRepo = path.join(REPO_PATH, SOURCE_REPO, commonPath);
  const distRepo = path.join(REPO_PATH, DESTINATION_REPO, commonPath);
  shell.mkdir('-p', distRepo);
  shell.cp('-r', mainRepo, distRepo);
}

function commitChanges(message) {
  const connectOneRepoPath = path.join(REPO_PATH, DESTINATION_REPO);
  shell.pushd(connectOneRepoPath);
  shell.exec('git add .');
  shell.exec(`git commit -m "${message}"`);
}

function pushAndRaisePR(prBranchName){
  const connectOneRepoPath = path.join(REPO_PATH, DESTINATION_REPO);
  shell.pushd(connectOneRepoPath);
  shell.exec(`git push --set-upstream origin ${prBranchName}`);
  shell.exec(`hub pull-request -b ${PR_MERGE_TO_BRANCH} -m "${prBranchName}"`)
}

module.exports = runCommonLine;
