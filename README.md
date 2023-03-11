
## Antora demo  

https://antora.cppalliance.org  

## Instructions  

The workflow may change in the future.

For the moment, the contents of build/site/ are being publish as-is to https://antora.cppalliance.org  

The Asciidoc attribute "branch" is used to select the branch to be built.
It can be "master", "develop", or a boost release tag such as "boost-1.82.0".

There are two playbooks:

libs.yml        Builds per-release documentation such as libs and the user manual
website.yml     Builds release-independent website documentation such as the contributor manual

Build website first then libs. Set the branch from the CLI:

To build the master branch run antora as usual without attributes.

To build the develop branch for the website:
```
antora --fetch --attribute branch=master site.yml
antora --fetch --attribute branch=master libs.yml
```

To build the library documentation for just a release:

```
antora --fetch --attribute branch=boost-1.82.0 libs.yml
```

The master/develop branches of the website are designed to be
deployed to different domains, thus the branch does not appear
in its URLs.

The master/develop branches of the library documentation is
designed to co-exist alongside the per-release documentation
and thus the branch name (or release version) does appear
in its URLs.
