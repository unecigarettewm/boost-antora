/*
    Copyright (c) 2023 Vinnie Falco (vinnie.falco@gmail.com)

    Distributed under the Boost Software License, Version 1.0. (See accompanying
    file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

    Official repository: https://github.com/boostorg/antora
*/

'use strict'

const fs = require('node:fs');
const path = require('node:path');

/*
    This extension allows  every asciidoc attribute
    specified in the playbook or the command line
    to become a variable in the playbook using the
    syntax ${var}.
*/
class Ext {
    static register() {
        new Ext(this)
    }

    constructor(ctx) {
        ;(this.ctx = ctx)
        .on('contextStarted', this.contextStarted.bind(this))
        .on('playbookBuilt', this.playbookBuilt.bind(this))
        .on('beforeProcess', this.beforeProcess.bind(this))
        .on('sitePublished', this.sitePublished.bind(this))
    }

    contextStarted({playbook}) {
        this.dir = playbook.output.dir;
        this.branch = playbook.asciidoc.attributes.branch
        if(this.branch) {
            if( this.branch == "develop" ||
                this.branch == "master" ||
                this.branch == "HEAD") {
                playbook.content.branches = this.branch
                console.log( "branches: ", playbook.content.branches)
            } else {
                playbook.content.branches = "~" // disable branches
                playbook.content.tags = "boost-" + this.branch
                console.log( "tags: ", playbook.content.tags)
            }
        } else {
            playbook.content.branches = "HEAD"
            console.log( "branches: ", playbook.content.branches)
        }
        playbook.site.url = playbook.site.url.replace("${branch}", this.branch)
        playbook.ui.bundle.url = playbook.ui.bundle.url.replace("${branch}", this.branch)
        playbook.output.dir = playbook.output.dir.replace("${branch}", this.branch)
    }

    playbookBuilt({playbook}) {
        /*console.log(playbook);*/
    }

    beforeProcess({playbook, siteAsciiDocConfig, siteCatalog}) {
    }

    sitePublished({playbook, contentCatalog}) {
        var sources = playbook.content.sources;
        for(var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if(source.hasOwnProperty('outdir')) {
                var outdir = source['outdir'];
                var component = contentCatalog.getComponents()[i];
            }
        }
    }
}

module.exports = Ext
