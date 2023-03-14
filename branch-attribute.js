'use strict'

class Ext {
    static register() {
        new Ext(this)
    }

    constructor(ctx) {
        ;(this.ctx = ctx)
        .on('contextStarted', this.onContextStarted.bind(this))
    }

    onContextStarted({playbook}) {
        var version = playbook.asciidoc.attributes.branch
        if(version) {
            if( version == "develop" ||
                version == "master" ||
                version == "HEAD") {
                playbook.content.branches = version
                console.log( "branches: ", playbook.content.branches)
            } else {
                playbook.content.branches = "~" // disable branches
                playbook.content.tags = "boost-" + version
                console.log( "tags: ", playbook.content.tags)
            }
        } else {
            playbook.content.branches = "HEAD"
            console.log( "branches: ", playbook.content.branches)
        }
        if(playbook.output.dir == "./build") // VFALCO MASSIVE HACK
            playbook.output.dir += "/" + version + "/libs"
        playbook.ui.bundle.url = playbook.ui.bundle.url.replace("${branch}", version)
    }
}

module.exports = Ext
