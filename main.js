define(function(require, exports, module) {
    "use strict";

    // Brackets modules
    var EditorManager = brackets.getModule("editor/EditorManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var tagRegExp = new RegExp(/^[a-z\-]+[1-6]*$/);

    var overlay = {
        token: function(stream/*, state*/) {
            var arr;
            arr = stream.match(/<(\/|)([a-z\-]+[1-6]*)(|(.*?)[^?%\-$])>/);
            if (arr && tagRegExp.test(arr[2])) {
                return "dreamweaver-html-tag-" + arr[2].toUpperCase();
            }
            while (stream.next() != null && !stream.match(/<(\/|)|(\/|)>/, false)) {}
            return null;
        }
    };

    function tag_color_change() {
        var cmTag = document.getElementById("editor-holder").querySelectorAll(".cm-tag:not(.cm-comment), .cm-attribute, .cm-builtin, .cm-qualifier");
        Array.prototype.forEach.call(cmTag, function(elm) {
            var html = elm.innerHTML;
            html = html.replace(/^(#|\.)/, "");
            if(tagRegExp.test(html)){
                elm.classList.add("cm-dreamweaver-html-tag-" + html.toUpperCase());
            }
        });
    }

    function updateUI() {
        var editor = EditorManager.getCurrentFullEditor();
        if(!editor){
            return;
        }
        var cm = editor._codeMirror;
        cm.removeOverlay(overlay);
        cm.addOverlay(overlay);
        cm.on("update", tag_color_change);
    }

    // Initialize extension
    AppInit.appReady(function() {
        MainViewManager.on("currentFileChange", updateUI);
        ExtensionUtils.loadStyleSheet(module, "main.less");
    });
});