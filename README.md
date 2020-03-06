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

```yaml
- uses: radcortez/project-metadata-action@master
  name: retrieve project metadata
  id: metadata
  with:
    github-token: ${{secrets.GITHUB_TOKEN}}
    metadata-file-path: '.github/project.yml'
```

After this step, you can reference any `property_name` defined in the file with 
`${{steps.metadata.outputs.property_name}}`. Just replace `property_name` with the property you are looking for.
