# Project Metadata action

The purpose of this action is to expose the properties defined in a YAML file as context variables to be used across 
your Github Action Workflow.

This action is only intended to run with Pull Request events for now.

## Inputs

### `github-token`

**Required** The GitHub Token used to create an authenticated client. The Github Token is already set by the Github 
Action itself. Use this if you want to pass in your own Personal Access Token. 

**Default** `${{github.token}}`.

### `metadata-file-path`

**Required** The path to the file that contains the Project metadata.

## Outputs

Dynamic properties parsed from the Project Metadata file.

## Example usage

Set up the Action:

```yaml
- uses: radcortez/project-metadata-action@master
  name: retrieve project metadata
  id: metadata
  with:
    github-token: ${{secrets.GITHUB_TOKEN}}
    metadata-file-path: '.github/project.yml'
```

A metadata file:

```yaml
name: Project Name
release:
  current-version: 1.0.0
  next-version: 2.0.0
```

When the action run, the properties `name`, `current-version` and `next-version` are added in the step metadata. Use 
`${{steps.metadata.outputs.property_name}}` to reference any property from the file. Just replace `property_name` with 
the property you are looking for.
