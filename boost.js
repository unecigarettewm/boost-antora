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
    }

    doReplace1(elem, pat, sub) {
        if (Array.isArray(elem)) {
            for(var i = 0; i < elem.length; i++)
                if (typeof elem[i] != "string")
                    this.doReplace1(elem[i], pat, sub)
                else
                    elem[i] = elem[i].replaceAll(pat, sub)
        } else if (typeof elem == 'object') {
            for (let key in elem)
                if (typeof elem[key] != "string")
                    this.doReplace1(elem[key], pat, sub)
                else
                    elem[key] = elem[key].replaceAll(pat, sub)
        }
    }

    doReplace(playbook) {
        for (const [key, value] of Object.entries(playbook.asciidoc.attributes)) {
            var pat = "${" + key + "}"
            this.doReplace1(playbook.site, pat, value)
            this.doReplace1(playbook.urls, pat, value)
            this.doReplace1(playbook.content, pat, value)
            this.doReplace1(playbook.output, pat, value)
            this.doReplace1(playbook.ui, pat, value)
        }
    }

    contextStarted({playbook}) {
        var version = playbook.asciidoc.attributes.boost_version

        if(! version )
            throw new Error("Missing required attribute: asciidoc.attributes.boost_version");

        if( version == "master" || version == "develop") {
            playbook.content.tags = ""
            playbook.content.branches = version
        } else {
            playbook.content.tags = "boost-" + version
            playbook.content.branches = null // disable branches
            playbook.urls.latestVersionSegment = "" // disable tag in URL
        } /* else {
            playbook.content.branches = "HEAD"
            console.log( "branches: ", playbook.content.branches)
        }
        */

        this.doReplace(playbook);
    }
}

module.exports = Ext
