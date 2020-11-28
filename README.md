# action-maven-deploy

GitHub Action for deploying to a Maven repository.

## Inputs
### `username`
**Required** Username that should be used to connect to the repository.

### `password`
**Required** Password that should be used to connect to the repository.

### `repository`
**Required** Repository that should be deployed to.

### `maven-goals`
The Maven goals to be executed.

### `maven-args`
Additional Maven command line arguments.

## Usage
### Bintray
```yaml
- name: Deploy to Bintray
  uses: simontunnat/action-maven-deploy@v1.1
  with:
    username: simontunnat
    password: SECRET_API_KEY
    repository: https://api.bintray.com/maven/simontunnat/maven/org.tunnat%3Amaven-parent
```

## Legal
Copyright 2020 Simon Tunnat

Licensed under the [Apache License](LICENSE), Version 2.0.
