const core = require('@actions/core');
const github = require('@actions/github');
const yaml = require('js-yaml');
const { promises: fs } = require('fs');

try {
    const metadataFilePath = core.getInput('metadata-file-path');
    const localFile = core.getInput('local-file');

    if (localFile === 'true') {
        console.log(`Reading workspace file ${metadataFilePath}`);
        fs.readFile(metadataFilePath, 'utf8')
            .then(data => {
                console.debug(`File found ${metadataFilePath}`);
                let metadata = yaml.safeLoad(data);
                setOutputs(metadata);
            })
            .catch(err => {
                core.setFailed(`Could not read project metadata file: ${err}`);
            });
    } else {
        console.log(`Reading file from ${metadataFilePath}`);
        const octokit = github.getOctokit(core.getInput('github-token'));

        octokit.pulls.listFiles({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: github.context.payload.pull_request.number
        }).then(({data}) => {

            let metadataFile = data.find(function (file) {
                return file.filename === metadataFilePath;
            });

            if (metadataFile == null) {
                console.log(`Could not find file to read project metadata`);
                return;
            }

            octokit.request("GET " + metadataFile.raw_url)
                .then(({data}) => {
                    let metadata = yaml.safeLoad(data);
                    setOutputs(metadata);
                });
        }).catch((error) => {
            console.debug(error);
            core.setFailed('Unknown Error!')
        })
    }

} catch (error) {
    core.setFailed(error.message);
}

const setOutputs = (metadata) => {
    Object.keys(metadata).forEach(key => {
        if (typeof metadata[key] === 'object') {
            setOutputs(metadata[key]);
        } else {
            console.log(`Setting output ${key} with value ${metadata[key]}`);
            core.setOutput(key.toString(), metadata[key].toString());
        }
    })
};
