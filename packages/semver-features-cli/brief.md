This is a CLI for semver-features-json package
It provides `semver-features` command that support several actions
- add new toggle
- remove existing toggle
- depreacate existing toggle

All actions should interact with user via questionnaire

Enquirer should be used

ajv is banned, use zod for validation

also use cosmiconfig for configuration file (semver-features)
available options are 
- optional features.json location (default is features.json in package root`


