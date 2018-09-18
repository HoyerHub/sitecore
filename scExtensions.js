var Toast;(function(Toast){Toast.defaults={width:"",displayDuration:2e3,fadeOutDuration:800};function info(message,title,options){_toast("info",message,title,options)}Toast.info=info;function warning(message,title,options){_toast("warning",message,title,options)}Toast.warning=warning;function error(message,title,options){_toast("error",message,title,options)}Toast.error=error;function success(message,title,options){_toast("success",message,title,options)}Toast.success=success;var _container;function _toast(type,message,title,options){if(options===void 0){options={}}options=jQuery.extend({},Toast.defaults,options);if(!_container){_container=jQuery("#toast-container");if(_container.length===0){_container=jQuery("<div>").attr("id","toast-container").appendTo(jQuery("body"))}}if(options.width){_container.css({width:options.width})}var toastElement=jQuery("<div>").addClass("toast").addClass("toast-"+type);if(title){var titleElement=jQuery("<div>").addClass("toast-title").append(title);toastElement.append(titleElement)}if(message){var messageElement=jQuery("<div>").addClass("toast-message").append(message);toastElement.append(messageElement)}if(options.displayDuration>0){setTimeout(function(){toastElement.fadeOut(options.fadeOutDuration,function(){toastElement.remove()})},options.displayDuration)}toastElement.on("click",function(){toastElement.remove()});_container.prepend(toastElement)}})(Toast||(Toast={}));
var scExtensions = {

    version: '1.17',

    set: function (setting, value) {
        this.settings[setting] = value;
        this.saveSettings();
        this.onChange(setting);
    },

    onChange: function (setting) {
        if (setting === 'use-shortcuts') {
            this.shortcuts.updateHTML();
        }
        else
            if (setting === 'use-editor' ||
                setting === 'hide-automate') {
                this.reloadNode();
            }
            else if (setting === 'version') {
                if (this.settings.version === this.version)
                    jQuery('#scExChangelog').text('Changelog');
            }
    },

    settings: {
        "use-editor": true,
        "use-shortcuts": true,
        "version": '0.00',
        "auto-raw": true,
        "funny-loader": false
    },

    loadSettings: function () {
        var json = Cookies.get('ext-settings');
        if (typeof json !== 'undefined') {
            var obj = JSON.parse(json);
            jQuery.each(obj, function (name, value) { scExtensions.settings[name] = value; });
        }
        else this.saveSettings();
    },

    runNextLoad: null,

    saveSettings: function () {
        var json = JSON.stringify(this.settings);
        Cookies.set('ext-settings', json, { expires: 1000 });
    },

    editor: null,

    shortcuts: null,

    focusMode: null,

    catchRequest: false,

    reloadNode: function () {
        let id = jQuery('td:contains("Item ID:")').next().find('.scEditorHeaderQuickInfoInput').val();
        scForm.invoke("item:load(id=" + id + ")");
    },

    //Runs once when the script loads.
    //Link to Ace Editor: https://ace.c9.io/
    //Link to js-cookie: https://github.com/js-cookie/js-cookie
    init: function () {
        let scripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js'
        ];

        this.loadExternalScripts(scripts);

        var css = '.ace_editor{height: 100%;}.ace_print-margin{display: none;}.editor_theme{text-transform: capitalize;}\
                    .hidden{display:none!important}\
                    div#ShortcutsPanel { \
                        border-bottom: 1px solid #D6D6D6; \
                        background: #404040; \
                        color: #fff; \
                    } \
                    .link { \
                        display: inline-block; \
                        border-radius: 10px; \
                        border: solid 1px #cc1111; \
                        padding: 2px 6px; \
                        color: #fff !important; \
                        margin: 0 1px; \
                    }\
                    .context-option { \
                        height: 27px; \
                    }\
                    .context-option:hover { \
                        background-color: #E3E3E3; \
                        cursor:pointer; \
                    }\
                    #ShortcutsPanel > div::-webkit-scrollbar { \
                        height: 12px;\
                    }\
                    #ShortcutsPanel > div::-webkit-scrollbar-thumb { \
                        background-color: #909090;\
                        border-radius: 15px;\
                        border: 2px solid #404040;\
                    }\
                    #ShortcutsPanel > div::-webkit-scrollbar-track-piece { \
                        background-color: #404040;\
                    }\
                    a.focus-button, a.focus-off-button {\
                        padding: 4px 8px;\
                        background: rgba(53, 53, 53, .8);\
                        color: #fff;\
                        border-radius: 3px;\
                        margin-left: 20px;\
                    }\
                    div.focused-editor{\
                        position: absolute;\
                        height: 100%;\
                        width: 99.59%;\
                        top: 0;\
                        left: 0;\
                    }\
                    .content-editor-focusmode{\
                        left: 0!important;\
                        width: 100%!important;\
                    }\
                    .height-hack{\
                        height: 100vh!important;\
                    }\
                    .toast{font-size:18px;padding:8px 35px 8px 14px;margin-bottom:8px;text-shadow:0 1px 0 rgba(255,255,255,.5);border:2px solid;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;box-shadow:#999 0 0 8px}.toast:hover{cursor:pointer;box-shadow:#666 0 0 8px}#toast-container{width:300px;bottom:40px;right:12px;position:fixed;z-index:9999}.toast-title{font-weight:700}.toast-success{color:#468847;background-color:#dff0d8;border-color:#d6e9c6}.toast-error{color:#b94a48;background-color:#f2dede;border-color:#eed3d7}.toast-info{color:#3a87ad;background-color:#d9edf7;border-color:#bce8f1}.toast-warning{color:#c09853;background-color:#fcf8e3;border-color:#fbeed5}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        
        this.waitForStatement(function(){return typeof ace != 'undefined' && typeof Cookies != 'undefined'}, function(){
            let lateLoadScripts = [
                'https://rawgithub.com/ajaxorg/ace-builds/master/src/ext-emmet.js',
                'https://rawgithub.com/nightwing/emmet-core/master/emmet.js'
            ]
            scExtensions.loadExternalScripts(lateLoadScripts);
            scExtensions.loadSettings();
            scExtensions.shortcuts.init();

            jQuery('.sc-globalHeader-content .col2:first-child').css('display', '-webkit-inline-box');
            jQuery('.sc-globalHeader-content .col2:first-child').append('<span style="margin-left: 14px;color: #cccccc;">Jabra-Extension</span><span style="margin-left: 7px;">|</span><a style="margin-left: 7px;color: #969696;" href="#" id="scExSettings">Settings</a><span style="margin-left: 7px;">|</span><a style="margin-left: 7px;color: #969696;" href="#" id="scExChangelog">Changelog' + scExtensions.getNotification('changelog') + '</a><span style="margin-left: 7px;">|</span><a style="margin-left: 7px;color: #969696;" href="#" id="scExReload">Reload Item View</a>');
            jQuery('#scExSettings').click(function () {
                top.document.getElementById("jqueryModalDialogsFrame").contentWindow.showModalDialog("/test/sitecore-extension/settings", null, "dialogWidth:600px;dialogHeight:600px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no");
            });
            jQuery('#scExChangelog').click(function () {
                top.document.getElementById("jqueryModalDialogsFrame").contentWindow.showModalDialog("/test/sitecore-extension/changelog", null, "dialogWidth:600px;dialogHeight:600px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no");
            });
            jQuery('#scExReload').click(scExtensions.reloadNode);
        });
    },

    loadExternalScripts: function (scripts) {
        for (let i = 0; i < scripts.length; i++) {
            let el = document.createElement("script");
            el.src = scripts[i];
            document.body.appendChild(el);
        }
    },

    waitForStatement:function(condition, callback){
        if (condition()){
            callback();
            return;
        }
        
        var interval = setInterval(function(){
            var conditionvalue = condition();
            top.console.log(conditionvalue);
            if (conditionvalue){
                callback();
                clearInterval(interval);
                return;
            }
        }, 200);
    },

    getNotification: function (element) {
        if (element === 'changelog' && this.settings.version !== this.version)
            return '<span style="margin-left: 2px;font-weight: 900;font-size: 14px;color: red;">!</span>';

        return '';
    },

    pageTitleDescriptionCheck: function(){
        if(jQuery('.scEditorWarningOption:contains("Add a new version.")').length != 0) return;
        var title = "";
        var description = "";
        jQuery('.scEditorFieldLabel:contains("PageTitle")').next().find('input').each(function(){
            title += this.value;
        });
        jQuery('.scEditorFieldLabel:contains("PageDescription")').next().find('input').each(function(){
            description += this.value;
        });
        var editorWarning = jQuery('#EditorWarning');
        if (title == "" || description == ""){
            if (editorWarning.length == 0){
                jQuery('#EditorTabs').after('<table border="0" width="100%" cellpadding="0" cellspacing="0" class="scEditorWarning" style="display:block;background-color: #900; color: #fff;"><tbody><tr><td valign="top"></td><td width="100%"><div class="scEditorWarningTitle">Missing title or description</div><div class="scEditorWarningHelp">Page title and description should be set for this page before publishing.</div></td></tr></tbody></table>');
                jQuery('#EditorFrames').css('margin-top','110px');
            }
        }
        else {
            if (editorWarning.length > 0){
                jQuery('#EditorFrames').css('margin-top','58px');
                editorWarning.remove();
            }
        }
    },

    recommendPublishLanguage: function () {
        var iFrame = jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId0');

        if (!scExtensions.quickPublish.active) {
            if (iFrame.length <= 0) return;
            iFrame.load(function () {
                if (iFrame.contents().find('#Languages').length <= 0) return;

                let languages = [],
                    langBtnTxt = jQuery('.scEditorHeaderVersionsLanguage.scEditorHeaderButton.scButton').text();

                if (langBtnTxt.replace(/ /g, '').toLowerCase() === 'english') {
                    languages = [
                        {
                            long: 'English',
                            short: 'en',
                            id: iFrame.contents().find('#Languages input').filter(function () { return jQuery(this).val() === "en" }).attr('id')
                        },
                        {
                            long: 'English (United Kingdom)',
                            short: 'en-GB',
                            id: iFrame.contents().find('#Languages input').filter(function () { return jQuery(this).val() === "en-GB" }).attr('id')
                        },
                    ];
                }
                else {
                    iFrame.contents().find('#Languages label').filter(function () { return jQuery(this).text().includes(langBtnTxt) }).each(function () {
                        let input = iFrame.contents().find('#' + jQuery(this).attr('for'))
                        languages.push({
                            long: jQuery(this).text(),
                            short: input.val(),
                            id: jQuery(this).attr('for')
                        });
                    });
                    languages.push({
                        long: 'English',
                        short: 'en',
                        id: iFrame.contents().find('#Languages input').filter(function () { return jQuery(this).val() === "en" }).attr('id')
                    });
                }
                iFrame.contents().find('#LanguagesPanellegend').after('<div id="recommended-languages" style="border-bottom: 1px solid #303030; padding-bottom:10px; margin-bottom: 10px">' +
                    '<p style="font-style: italic !important;font-size: 12px !important;font-weight: 400; !important">Maybe you need one of these?</p></div><p id="current-sel" style="font-size: 12px !important;font-weight: 400; !important; color: #808080 !important; padding-top: 0!important;"></p>');
                languages.forEach(function (lang) {
                    iFrame.contents().find('#recommended-languages')
                        .append('<input id="rec_' + lang.short + '" class="rec-lang" data-for="' + lang.id + '" type="checkbox" ' + (iFrame.contents().find('#' + lang.id)[0].checked ? 'checked="true"' : '') + '><label for="rec_' + lang.short + '">' + lang.long + '</label><br>');
                    iFrame.contents().find('#' + lang.id).on('change', function () {
                        let recInput = iFrame.contents().find('#rec_' + lang.short);
                        recInput[0].checked = this.checked;
                    });
                });
                iFrame.contents().find('.rec-lang').click(function () {
                    let forInput = iFrame.contents().find('#' + jQuery(this).data('for'));
                    forInput[0].checked = this.checked;
                    updateSelected();
                });
                iFrame.contents().find('#SelectAllLanguages').click(function () {
                    let sel = this;
                    iFrame.contents().find('.rec-lang').each(function () {
                        this.checked = sel.checked;
                    });
                    updateSelected();
                });
                iFrame.contents().find('#Languages input').click(function () {
                    updateSelected();
                });
                updateSelected();
                scExtensions.publishNotification();
            });
        }
        else {
            scExtensions.quickPublish.active = false;
            if (iFrame.length <= 0) return;
            iFrame.load(function () {
                iFrame.unbind('load');
                iFrame.contents().find('#SelectAllLanguages')[0].click();
                if (iFrame.contents().find('#Languages input').filter(function () { return this.checked }).length !== 0) {
                    iFrame.contents().find('#SelectAllLanguages')[0].click();
                }
                let title = jQuery('.scEditorHeaderVersionsLanguage.scEditorHeaderButton.scButton').attr('title');
                let id = iFrame.contents().find('#Languages label').filter(function () {
                    return jQuery(this).text() == title.substr(0, title.indexOf(' :'));
                }).attr('for');
                iFrame.contents().find('#' + id).click();
                console.log("Quick Publish: publishing to " + iFrame.contents().find('#Languages input').filter(function () { return this.checked })[0].value);
                iFrame.contents().find('#NextButton').click();
                jQuery('#ribbonReplacement h2').text('Step 1/3: Language selected, entering queue..');
                scExtensions.publishNotification();
                scExtensions.waitForStatement(function(){return jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId1').length > 0 && jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId1').contents().find('#OK').length > 0;},
                function(){jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId1').contents().find('#OK').click();});
            });
        }
        function updateSelected() {
            let string = 'Currently selected: ',
                selected = iFrame.contents().find('#Languages input').filter(function () { return this.checked });
            if (selected.length === 0) {
                string += 'none';
            }
            else if (selected.length < 10) {
                selected.each(function (inp) {
                    if (string != 'Currently selected: ')
                        string += ', '
                    string += '[' + this.value + ']';
                });
            }
            else {
                string += selected.length + ' languages';
            }
            iFrame.contents().find('#current-sel').text(string);
        };
        updateSelected();
    },

    publishNotification: function(){
        let iFrame = jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId0'),
            cmd = 0,
            msg = "";

        let getNewiFrame = function(){
            return jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId1');
        }
        //publishcheck
        iFrame[0].contentWindow.scRequest.prototype.send = (function() {
            var cached_function = jQuery('#jqueryModalDialogsFrame').contents().find('#scContentIframeId0')[0].contentWindow.scRequest.prototype.send;
            return function() {
                this.callback = function(){
                    if(this.parameters === "CheckStatus" && (this.currentCommand === 11 || this.currentCommand === 13)){
                        cmd = this.currentCommand;
                        if (this.currentCommand === 13) {
                            Toast.warning(this.commands[this.currentCommand-1].value, 'Publish Info', {displayDuration: 15000});
                            top.jQuery('#jqueryModalDialogsFrame').show();
                            jQuery('#QuickPublish, #RibbonPanel').show();
                            jQuery('#ribbonReplacement, #funnyLoader').remove();
                            jQuery(".scFlexColumnContainer.scWindowBorder2>div:not(:first-child),.col2,#SystemMenu").fadeIn();
                        }
                        else msg = this.commands[this.currentCommand-1].value;
                        iFrame.contents().find('#CancelButton').click();
                    }
                    else if (this.control === 'CancelButton'){
                        if (cmd === 11){
                            jQuery('#ribbonReplacement h2').text('Step 3/3: Finalizing');
                            scExtensions.waitForStatement(function(){
                                return getNewiFrame().length > 0 && getNewiFrame().contents().find('#OK').length > 0;
                            }, function(){
                                getNewiFrame().contents().find('#OK').click();
                                Toast.warning(msg, 'Publish Info', {displayDuration: 15000});
                                jQuery('#QuickPublish, #RibbonPanel').show();
                                jQuery('#ribbonReplacement, #funnyLoader').remove();
                                jQuery(".scFlexColumnContainer.scWindowBorder2>div:not(:first-child),.col2,#SystemMenu").fadeIn();
                                top.jQuery('#jqueryModalDialogsFrame').show();
                            });
                        }
                    }
                    else if (this.parameters === "CheckStatus" && !(this.currentCommand === 11 || this.currentCommand === 13)){
                        let value = this.commands.find(function(el){return el.command === "SetInnerHtml"}).value;
                        if (value.includes('<br/><br/>')) jQuery('#ribbonReplacement h2').text("Step 3/3: " + value.replace(/<br\/><br\/>/g, ' - '));
                        else jQuery('#ribbonReplacement h2').text("Step 2/3: " + value);
                    }
                    console.log(this);
                }.bind(this)
                var result = cached_function.apply(this, arguments);
                return result;
            };
        })();

    },

    addUrlToFile: function () {
        let fileTemplate =
            jQuery('input[value=\'{DAF085E8-602E-43A6-8299-038FF171349F}\']').length +
            jQuery('input[value=\'{F1828A2C-7E5D-4BBD-98CA-320474871548}\']').length +
            jQuery('input[value=\'{0603F166-35B8-469F-8123-E8D87BEDC171}\']').length +
            jQuery('input[value=\'{962B53C4-F93B-4DF9-9821-415C867B8903}\']').length;

        if (fileTemplate > 0 && jQuery('#copy_src').length <= 0) {
            jQuery('.scEditorQuickInfo tbody')
                .prepend('<tr id="copy_src"><td>Copyable src:</td><td><input class="scEditorHeaderQuickInfoInput" readonly="readonly" onclick="javascript:this.select();return false" value="' + scID.makeUrl(jQuery('.scEditorHeaderQuickInfoInput').val()) + '"></td></tr>')
        }
    },

    quickPublish: {
        active: false,

        addButton: function () {
            if (jQuery('#QuickPublish').length > 0) return;
            jQuery('#EditorTabControls_Content .scEditorTabControls>span').prepend('<a class="scEditorHeaderNavigator scEditorHeaderButton scButton" title="Publish to Current Language" href="#" id="QuickPublish">Quick Publish</a>');
            jQuery('#QuickPublish').click(function () {
                scExtensions.quickPublish.active = true;
                jQuery('#Ribbon_Nav_PublishStrip').click();
                setTimeout(function () {
                    jQuery('#Ribbon_Strip_PublishStrip .chunk:nth-child(3) .scRibbonToolbarLargeComboButton a:last-child')[0].click();
                    setTimeout(function () {
                        jQuery('.scPopup tr:last-child')[0].click();
                    }, 150);
                }, 150);
            });
            if (jQuery('#ribbonReplacement').length > 0){
                jQuery('#RibbonPanel, #QuickPublish, .scFlexColumnContainer.scWindowBorder2>div:last-child,#SystemMenu,.col2').hide();
            }
        }
    },

    automate: {
        fixSiteMap: {
            list: null,
            working: false,
            isActive: function () {
                return this.list !== null ? this.getIndex() < this.list.length : false;
            },
            run: function () {
                if (this.isActive()) {
                    if ((this.working && jQuery('select.scContentControlMultilistBox').last().find('option').length > 0) || jQuery('.scEditorHeaderQuickInfoInputID').val() !== "{CA6A022B-3205-45FF-9F9A-756A7F33B744}") {
                        this.next();
                        return;
                    }
                    this.working = true;
                    jQuery('.scContentButton:contains("Select all")').last().click();
                    setTimeout(function () {
                        scForm.invoke("contenteditor:save");
                    }, 1500);
                }
            },
            getIndex: function () {
                return this.list.index(jQuery('.scContentTreeNodeActive')[0]);
            },
            next: function () {
                this.working = false;
                if ((this.getIndex() + 1) < this.list.length) {
                    console.log('next click');
                    scForm.invoke("item:load(id=" + scID.make(this.list.eq(this.getIndex() + 1).attr('id').substring(10)) + ")");
                }
                else {
                    this.list = null;
                    document.querySelector('.scEditorPanel').scrollTop = 0;
                    alert('Done');
                }
            },
            start: function () {
                scExtensions.automate.fixSiteMap.list = jQuery('.scContentTreeNodeActive').next().find('.scContentTreeNode > a');
                scExtensions.automate.fixSiteMap.list.eq(0).click();
            },
            delayedStart: function () {
                scExtensions.automate.openChildrenCallback = scExtensions.automate.fixSiteMap.start;
                console.log(scExtensions.automate.openChildrenCallback);
                scExtensions.automate.openAllChildren();
            }
        },

        openAllChildrenDelay: function () {
            setTimeout(this.openAllChildren, 1000);
        },
        openAllChildren: function () {
            if (jQuery('.scContentTreeNodeActive').parent().find('img').eq(0).attr('src') === '/sitecore/shell/themes/standard/images/treemenu_collapsed.png') {
                jQuery('.scContentTreeNodeActive').parent().find('img').eq(0).click();
                scExtensions.automate.openAllChildrenDelay();
                return;
            }
            let toOpen = jQuery('.scContentTreeNodeActive').next().find('img[src$="/sitecore/shell/themes/standard/images/treemenu_collapsed.png"]');
            if (toOpen.length > 0) {
                toOpen.click();
                scExtensions.automate.openAllChildrenDelay();
                return;
            }
            let loading = jQuery('.scContentTreeNodeActive').next().find('img[src$="/sitecore/shell/themes/standard/images/sc-spinner16.gif"]');
            if (loading.length > 0) {
                scExtensions.automate.openAllChildrenDelay();
                return;
            }
            scExtensions.automate.openChildrenCallback();
        },
        openChildrenCallback: function () { },

        currentState: {
            isActive: function () {
                if (this.index < 0 || this.queue.length < 1) return false;
                return this.index < this.queue.length;
            },
            getProgress: function () {
                return ((100 / this.queue.length) * this.index).toFixed(2);
            },
            getEntry: function () {
                return this.queue[this.index];
            },
            getItemIndex: function () {
                return this.items.indexOf(this.getEntry().item);
            },
            items: [],
            languages: [],
            queue: [],
            index: -1,
            code: ""
        },

        transfers: [],

        transferVal: function (parameters) {
            this.transfers.push(parameters);
        },

        obtainVal: function (parameters) {
            const cur = this.currentState;
            let tryFind = this.transfers.find(function (el) {
                let lang = typeof el.language === 'undefined' || el.language.to === cur.getEntry().language || el.language.from === parameters.fromLang,
                    item = typeof el.item === 'undefined' || el.item.to === cur.getItemIndex() || el.item.from === parameters.fromItem;
                return (el.tag === parameters.tag && item && lang);
            });
            return typeof tryFind === 'undefined' ? null : tryFind.value;
        },

        next: function () {
            let cmd = "item:load(id=" + this.currentState.getEntry().item + ",language=" + this.currentState.getEntry().language + ")";
            if (this.currentState.getEntry().language === 'save') cmd = "contenteditor:save";
            console.log('Automate: Invoking command: ' + cmd);
            scForm.invoke(cmd);
        },

        run: function () {
            if (this.currentState.getEntry().language !== 'save') eval(this.currentState.code);
            this.currentState.index++;
            console.log('Automate: Current progress: ' + this.currentState.getProgress() + '%');
            if (this.currentState.isActive()) {
                setTimeout(function () {
                    scExtensions.automate.next();
                }, 400);
            }
            else{
                top.jQuery('#jqueryModalDialogsFrame').contents().find('button.ui-dialog-titlebar-close').click();
                Toast.warning("Automate Finished", 'Automate has gone through a total of ' + (this.currentState.items.length * this.currentState.languages.length) + ' total tasks', {displayDuration: 8000});
                this.queue = [];
                if (this.postAutomationCallback !== null) this.postAutomationCallback();
                this.postAutomationCallback = null;
            }
        },

        postAutomationCallback: null,

        addButton: function () {
            if (jQuery('#Automate').length > 0) return;
            jQuery('#EditorTabControls_Content .scEditorTabControls>span').prepend('<a class="scEditorHeaderNavigator scEditorHeaderButton scButton" title="Automate tasks in javascript" href="#" id="Automate">Automate</a>');
            jQuery('#Automate').click(scExtensions.automate.showPopup);
        },

        showPopup: function () {
            top.document.getElementById("jqueryModalDialogsFrame").contentWindow.showModalDialog("/test/sitecore-extension/automate", null, "dialogWidth:750px;dialogHeight:600px;help:no;scroll:auto;resizable:yes;maximizable:yes;closable:yes;center:yes;status:no;header:;autoIncreaseHeight:yes;forceDialogSize:no");
        },

        start: function (code, items, languages) {
            if (code.length <= 0 || items.length <= 0 || languages.length <= 0) return;
            this.currentState.code = code;
            let queue = [];

            for (let i = 0; i < items.length; i++) {
                for (let i2 = 1; i2 < (languages.length * 2) + 1; i2++) {
                    if (i2 & 1) {
                        queue.push({
                            item: items[i],
                            language: languages[i2 / 2 - .5]
                        });
                    }
                    else queue.push({
                        item: '',
                        language: 'save'
                    });
                }
            }
            this.currentState.languages = languages;
            this.currentState.items = items;
            this.currentState.queue = queue;
            this.currentState.index = 0;
            this.transfers.length = 0;
            this.next();
        },

        queue: []
    },

    checkSearchParameter: function (str) {
        let par = "&TreeSearch=",
            start = str.lastIndexOf(par) + par.length,
            i = 0;

        while (str[start + i] !== '&') {
            i++;
        }
        let searchInput = str.substr(start, i);
        if (searchInput.indexOf("-") >= 0 || searchInput.indexOf("/") >= 0) return null;

        return str.replace(searchInput, scID.make(searchInput));
    },

    hideEmptyLanguages: function () {
        jQuery('#Header_Language_Gallery').contents().find('.scMenuPanelItem > table > tbody > tr > td > div > div:nth-child(2)').each(function () {
            var text = jQuery(this).text();
            var num = text.replace(/\D+$/g, "");
            if (num == "0") {
                jQuery(this).parent().parent().parent().parent().parent().parent().hide();
            }
        });
    },

    onLoadRequest: function () {
        scExtensions.editor.onLoadRequest();
        scExtensions.shortcuts.onLoadRequest(this.parameters);
    }
};

scExtensions.shortcuts = {
    currentItem: null,

    array: [],

    init: function () {
        var json = Cookies.get('shortcuts');
        if (typeof json !== 'undefined') {
            this.array = JSON.parse(json);
        }
        this.updateHTML();
    },

    add: function () {
        if (jQuery.inArray(this.currentItem, this.array) > -1) {
            alert('Shortcut already exists');
            return;
        };
        this.array.push(this.currentItem);
        this.updateHTML();
    },

    remove: function (id) {
        for (let i = 0; i < this.array.length; i++) {
            const element = this.array[i];
            if (element.id === id) {
                this.array.splice(i, 1);
                break;
            }
        }
        this.updateHTML();
    },

    createLinks: function () {
        var returnStr = '<div id="ShortcutsPanel"><div style="overflow-x: scroll;overflow-y: hidden;height: 100%;"><div style="width: max-content; padding: 6px">';
        if (this.array.length > 0)
            for (let i = 0; i < this.array.length; i++) {
                const link = this.array[i];
                returnStr += '<a class="link" href="#" data-item-id="' + link.id + '"><span>' + link.name + '</span></a>';
            }
        else returnStr += '<span style="color: #909090;">Right-click items to add them to shortcuts</span>';
        returnStr += '</div></div></div>';
        return returnStr;
    },

    updateHTML: function () {
        Cookies.set('shortcuts', JSON.stringify(this.array), { expires: 1000 });
        if (jQuery('#ShortcutsPanel').length > 0) jQuery('#ShortcutsPanel').remove();

        if (!scExtensions.settings["use-shortcuts"]) return;

        jQuery('#SearchPanel').after(this.createLinks());
        jQuery('.link').click(function () { scForm.postRequest("", "", "", "item:load(id=" + jQuery(this).data('item-id') + ")", function () {/*Not used, see OnLoadRequest instead*/ }) });
        jQuery('.link').contextmenu(function (e) { e.preventDefault(); scExtensions.shortcuts.remove(jQuery(this).data('item-id')); });
    },

    onLoadRequest: function (parameters) {
        var itemID = parameters.substr(13, parameters.length - 14),
            itemStr = scID.break(itemID),
            nodeID = "#Tree_Node_" + itemStr;

        scExtensions.waitForStatement(function(){return jQuery(nodeID).length > 0}, function () {
            jQuery('#ContentTreeInnerPanel').animate({
                scrollTop: jQuery(nodeID).offset().top - jQuery('#ContentTreeInnerPanel').offset().top + jQuery('#ContentTreeInnerPanel').scrollTop() - (jQuery('#ContentTreeInnerPanel').height() / 2)
            });
        });
    },
};

scExtensions.editor = {

    activeEditors: [],

    autoRaw: function () {
        let itemTemplate =
            jQuery('input[value=\'{165B15E4-81FA-403F-BAE0-7836F86C9EC4}\']').length +
            jQuery('input[value=\'{03450BFA-315B-40CE-85C2-DFB22DFA5213}\']').length +
            jQuery('input[value=\'{8B583F8C-E38B-4C2B-A159-88A62F0B0EEF}\']').length +
            jQuery('input[value=\'{3FCFE890-904B-448F-83F0-B8F3BD06F963}\']').length +
            jQuery('input[value=\'{904B192F-A4F8-41E0-B092-87B958CE5B68}\']').length +
            jQuery('input[value=\'{183892F1-0EC7-468B-A988-631F1DEB4DA0}\']').length,
            isRaw = false,
            currentRibbonTab = jQuery('.scRibbonNavigatorButtonsActive'),
            returnVal = false;

        jQuery('#Ribbon_Nav_ViewStrip').click();
        isRaw = jQuery('#Ribbon_Strip_ViewStrip .chunk:last-child .scRibbonToolbarSmallButtons:last-child span:first-child input').is(':checked');

        if (itemTemplate > 0) {
            returnVal = !isRaw;
        }
        else {
            returnVal = isRaw
        }

        currentRibbonTab.click();
        return returnVal;
    },

    themes: [
        "ambiance",
        "chaos",
        "chrome",
        "clouds",
        "clouds_midnight",
        "cobalt",
        "crimson_editor",
        "dawn",
        "dracula",
        "dreamweaver",
        "eclipse",
        "github",
        "gob",
        "gruvbox",
        "idle_fingers",
        "iplastic",
        "katzenmilch",
        "kr_theme",
        "kuroir",
        "merbivore",
        "merbivore_soft",
        "mono_industrial",
        "monokai",
        "pastel_on_dark",
        "solarized_dark",
        "solarized_light",
        "sqlserver",
        "terminal",
        "textmate",
        "tomorrow",
        "tomorrow_night",
        "tomorrow_night_blue",
        "tomorrow_night_bright",
        "tomorrow_night_eighties",
        "twilight",
        "vibrant_ink",
        "xcode"
    ],
    loadEvents: [
        'loaditem',
        'item:load',
        //'item:save', stupid sitecore update broke this
        'contenteditor:save',
        'rawvalues_click'
    ],
    default_values: {
        'theme': 'monokai',
        'fontsize': 15,
        'wrap': false
    },

    customThemes: [],

    lazyloadCheck: function(){
        var editorWarning = jQuery('#EditorWarning');
        var passedRegex = false;
        scExtensions.editor.activeEditors.forEach(element => {
            if(/(<img(?!.*?data-src=(['"]).*?\2)[^>]*)(>)/.test(element.getValue())){
                passedRegex = true;
            }
        });

        if(passedRegex){
            if (editorWarning.length == 0){
                jQuery('#EditorTabs').after('<div id="EditorWarning" class="scEditorWarning" style="margin-bottom: 10px; padding: 10px;"><img src="/sitecore/shell/themes/standard/Images/warning_yellow.png" class="scEditorSectionCaptionIcon" alt="" border="0" style="float: left; margin-right: 15px;"><div class="scEditorWarningTitle">Image without lazy-loading found, please use following syntax:</div><div class="scEditorWarningHelp">&lt;img src="/components/design/content/blank.png" fallback-src="/components/design/content/blank.png" ng-attr-data-src="XXX" alt="XXX"&gt;</div></div>');
                jQuery('#EditorFrames').css('margin-top','110px');
            }
        }
        else {
            if (editorWarning.length > 0){
                jQuery('#EditorFrames').css('margin-top','58px');
                editorWarning.remove();
            }
        }
    },

    //Runs if a scRequest's parameters matches the loadevents array.
    //Hides textareas, and makes new divs with editors to replace them.
    //When text is changed in editors it will update the hidden textareas with the new values.
    onLoadRequest: function () {


        if(typeof scExtensions.runNextLoad === "function"){
            scExtensions.runNextLoad();
            scExtensions.runNextLoad = null;
            return;
        }
        else if (scExtensions.automate.currentState.isActive()) {
            scExtensions.automate.run();
            return;
        }
        if (scExtensions.automate.fixSiteMap.isActive()) {
            scExtensions.automate.fixSiteMap.run();
            return;
        }
        else if (scExtensions.settings["auto-raw"]) {
            if (scExtensions.editor.autoRaw()) {
                jQuery('#Ribbon_Strip_ViewStrip .chunk:last-child .scRibbonToolbarSmallButtons:last-child span:first-child input').click();
                return;
            }
        }

        var name = jQuery('.sc-accountInformation li').eq(1).text().replace(new RegExp('\n', 'g'), '').split(' ').filter(function (n) { return n != '' }).join(' ').toLowerCase();

        if (jQuery('.scEditorHeaderQuickInfoInputID').val() === "{CA6A022B-3205-45FF-9F9A-756A7F33B744}" ||
            jQuery('.scEditorHeaderQuickInfoInputID').val() === "{18938BF9-6F8F-480B-86FF-2A905679194A}") {
            scExtensions.pageTitleDescriptionCheck();
            jQuery('.scEditorFieldLabel:contains("PageTitle")').next().find('input').each(function(){
                jQuery(this).change(scExtensions.pageTitleDescriptionCheck);
            });
            jQuery('.scEditorFieldLabel:contains("PageDescription")').next().find('input').each(function(){
                jQuery(this).change(scExtensions.pageTitleDescriptionCheck);
            });
            jQuery('.scEditorHeaderTitlePanel').append('<a href="#" class="helpme">Add to Sitemap</a>');
            jQuery('.scEditorHeaderTitlePanel').append('<a style="margin-left: 10px" href="#" class="thisishorrible">Next</a>');
            jQuery('.scEditorHeaderTitlePanel').append('<a style="margin-left: 10px" href="#" class="pleasewhy">Add all children</a>');
            jQuery('.scEditorHeaderTitlePanel').append('<a style="margin-left: 10px" href="#" class="ahhh">Add just en & en-ca</a>');
            jQuery('.helpme').click(function () {
                jQuery('.scContentButton:contains("Deselect all")').click();
                jQuery('.scContentButton:contains("Select all")').last().click();
                document.querySelector('.scEditorPanel').scrollTop = 0;
                scForm.invoke("contenteditor:save");
            });
            jQuery('.thisishorrible').click(function () {
                jQuery('.scContentTreeNodeActive').parent().next().find('a').click();
            });
            jQuery('.pleasewhy').click(function () {
                scExtensions.automate.fixSiteMap.delayedStart();
            });
            jQuery('.ahhh').click(function () {
                jQuery('.scContentButton:contains("Deselect all")').click();
				let box = jQuery('.scContentControlMultilistBox');
				box = box.eq(box.length - 2);
				let en = box.find('option:not(:contains("-"))'),
					enca = box.find('option:contains("en-CA")');
				box.val([en.val(), enca.val()]);
                box.dblclick();
                document.querySelector('.scEditorPanel').scrollTop = 0;
				scForm.invoke("contenteditor:save");
            });
        }

        scExtensions.focusMode.disable();
        scExtensions.addUrlToFile();
        scExtensions.quickPublish.addButton();

        if (!scExtensions.settings["use-editor"]) return;
        if (scExtensions.editor.activeEditors.length > 0) {
            scExtensions.editor.activeEditors.forEach(function (editor) {
                editor.destroy();
                jQuery('#' + editor.container.id).remove();
            }, this);
            scExtensions.editor.activeEditors = [];
        }
        scExtensions.editor.loadCustomThemes();
        jQuery('textarea').each(function () {
            var label = jQuery(this).parent().parent().find(".scEditorFieldLabel");
            var text = label.text().toLowerCase();
            var mode = "";
            if (text.substr(0, 4) === "text") {
                mode = "html";
            }
            else if (text.substr(0, 10) === "javascript") {
                mode = "javascript";
            }
            else if (text.substr(0, 3) === "css") {
                mode = "css";
            }
            if (mode !== "") {
                jQuery(this).after('<div id="editor' + jQuery(this)[0].id + '"></div>');
                jQuery(this).css('display', 'none');
                var editor = ace.edit('editor' + jQuery(this)[0].id);
                editor.getSession().setMode("ace/mode/" + mode);
                scExtensions.editor.loadEditorSettings(editor);
                let emmetloader = require("ace/ext/emmet");
                editor.setOption("enableEmmet", true);
                editor.$blockScrolling = Infinity;
                editor.setValue(jQuery(this).text());
                editor.on("change", function (e) {
                    if (jQuery("#" + editor.container.id.replace('editor', "")).val() !== editor.getValue()){
                        jQuery("#" + editor.container.id.replace('editor', "")).val(editor.getValue());
                        scExtensions.editor.lazyloadCheck();
                    }
                });
                editor.clearSelection();
                setTimeout(function () {
                    if (jQuery('#Ribbon_Nav_EditorStrip').length === 0) {
                        jQuery('.scRibbonNavigatorButtonsGroupButtons').append('<a id="Ribbon_Nav_EditorStrip" href="#" class="scRibbonNavigatorButtonsNormal" ' +
                            'onclick="javascript:return scContent.ribbonNavigatorButtonClick(this, event, \'Ribbon_Strip_EditorStrip\')">Code Editor</a>');

                        jQuery('#Ribbon_Toolbar').append('<div id="Ribbon_Strip_EditorStrip" class="scRibbonToolbarStrip" style="display: none;">' +

                            '<div class="chunk"><div class="panel"><a href="#" class="scRibbonToolbarLargeButton" title="Apply any changes" onclick="javascript:return scExtensions.editor.setEditorSettings()"><img src="/temp/iconcache/office/24x24/floppy_disk.png" class="scRibbonToolbarLargeButtonIcon" alt="Apply any changes" border="0"><span class="scRibbonToolbarKeyCodeLargeButton" style="display:none">Ctrl+S</span><span class="header">Save & Apply</span></a></div><div class="caption">Write</div></div>' +

                            '<div class="chunk"><div class="panel">' + scExtensions.editor.makeThemeSelector() + '</div><div class="caption">Editor Theme</div></div>' +

                            '<div class="chunk"><div class="panel"><input class="editor_fontsize" type="text" style="width: 100px" name="fontsize" value="' + editor.getFontSize() + '"></div><div class="caption">Font Size (in px)</div></div>' +

                            '<div class="chunk"><div class="panel"><div class="scRibbonToolbarSmallButtons"><span class="scRibbonToolbarSmallCheckButton" title="Wrap lines to prevent extremely long lines"><input id="editor-wrap" type="checkbox" class="scRibbonToolbarSmallCheckButtonCheckbox" ' + (editor.getOption('wrap') === 'off' ? '' : 'checked="checked"') + '><label class="header" for="editor-wrap">Wrap Lines</label></span></div></div><div class="caption">Toggles</div></div>' +

                            '<div class="chunk"><div class="panel"><a id="sendForMarkupLargeButton" href="#" class="scRibbonToolbarLargeButton" onclick="javascript:return scExtensions.editor.fixMarkUp()"><img src="/temp/iconcache/network/24x24/earth_add.png" class="scRibbonToolbarLargeButtonIcon" alt="" border="0"><span class="header">Send...</span></a></div><div class="caption">Fix Markup</div></div>' +

                            '</div>');
                    }
                    editor.getSession().getUndoManager().reset();
                    scExtensions.editor.activeEditors.push(editor);
                    scExtensions.editor.lazyloadCheck();
                }, 500);
            }
        });
        jQuery('.focus-button').remove();
        jQuery('.ace_editor').parent().parent().find('.scEditorFieldLabel')
            .append('<a class="focus-button" title href="#">Focus Mode</a>');
        jQuery('.focus-button').click(function () { scExtensions.focusMode.enable(this) });

        if (jQuery('.scEditorHeaderVersionsLanguage.scEditorHeaderButton.scButton').length > 0) {
            jQuery('.scEditorHeaderVersionsLanguage.scEditorHeaderButton.scButton')
                .click(function () {
                    setTimeout(function () {
                        jQuery('#Header_Language_Gallery').load(function () {
                            let lang = jQuery(this).contents().find('#Languages');
                            if (lang.parent().find('#Nick').length <= 0) {
                                lang.parent().prepend('<div style="height: 36px;" class="scMenuPanelItem" id="Nick" onmouseover="javascript:return scForm.rollOver(this,event)" onfocus="javascript:return scForm.rollOver(this,event)" onmouseout="javascript:return scForm.rollOver(this,event)" onblur="javascript:return scForm.rollOver(this,event)"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td valign="top" style="padding: 0px 4px"><img style="margin:0px 4px 0px 4px;" src="/sitecore/images/blank.gif" border="0" alt="" width="32px" height="32px"></td><td width="100%" valign="top"><div style="padding:2px 4px 2px 0px;"><div style="padding:0px 0px 4px 0px;" nowrap="true"><b>Hide Empty Languages</b></div><div nowrap="true" style="color:#666666;"></div></div></td></tr></tbody></table></div>')
                                lang.parent().find('#Nick').click(function () {
                                    top.scExtensions.hideEmptyLanguages();
                                });
                            }
                        });
                    }, 200);
                });
        }
    },

    //Runs every time we initiate loaders
    //Attempts to load settings from cookies. If unable, will use default values.
    loadEditorSettings: function (editor) {
        var data = Cookies.get('editor-settings');
        if (typeof data !== 'undefined') {
            data = JSON.parse(data);

            editor.setFontSize(typeof data['fontsize'] === 'undefined' ? this.default_values['fontsize'] : parseInt(data['fontsize']));
            editor.setTheme('ace/theme/' + (typeof data['theme'] === 'undefined' ? this.default_values['theme'] : data['theme']));
            editor.setOption('wrap', typeof data['wrap'] === 'undefined' ? this.default_values['wrap'] : data['wrap'])
        }
        else {
            editor.setTheme("ace/theme/" + this.default_values['theme']);
            editor.setFontSize(this.default_values['fontsize']);
            editor.setOption('wrap', this.default_values['wrap']);
        }
    },

    //Runs when 'Apply' button is pressed in settings tab
    //Applies the new settings on all active editors and saves them in cookies
    setEditorSettings: function () {
        this.activeEditors.forEach(function (editor) {
            var theme = jQuery('.editor_theme').val(),
                fontsize = parseInt(jQuery('.editor_fontsize').val()),
                wrap = jQuery('#editor-wrap').is(':checked');

            editor.setTheme("ace/theme/" + theme);
            editor.setFontSize(fontsize);
            editor.setOption('wrap', wrap);

            Cookies.set('editor-settings', JSON.stringify(
                {
                    'theme': theme,
                    'fontsize': fontsize,
                    'wrap': wrap
                }
            ), { expires: 1000 });
        }, this);

        return scForm.invoke('contenteditor:save', event);
    },

    //Runs every time we initiate loaders
    //Makes the html for the dropdown list in settings
    makeThemeSelector: function () {
        var html = '<select class="editor_theme" style="height:35px;">',
            data = Cookies.get('editor-settings'),
            theme = null;
        if (typeof data !== 'undefined') {
            data = JSON.parse(data);
            theme = data["theme"];
        }
        for (var index = 0; index < this.themes.length; index++) {
            var element = this.themes[index];
            element[0] = element[0].toUpperCase();
            html += '<option value="' + element + '" ' + (element === theme ? "selected" : "") + '>' + element + '</option>';
        }
        html += '</select>';
        return html;
    },

    //Runs every time we initiate loaders
    //Could be improved by making custom themes objects instead of functions.
    loadCustomThemes: function () {
        for (var i = 0; i < this.customThemes.length; i++) {
            this.customThemes[i]();
        }
    },

    //Runs on every scRequest
    //Checks if a scRequest's parameters matches the loadevents array
    isLoadRequest: function (request) {
        if (request == null) return false;
        request = request.toLowerCase();
        for (var i = 0; i < this.loadEvents.length; i++) {
            var event = this.loadEvents[i];
            if (request.substr(0, event.length) === event) {
                return true;
            }
        }
        return false;
    },

    fixMarkUp: function () {
        if (this.activeEditors == null || this.activeEditors.length === 0) return;
        if (!confirm('Please make sure this page doesn\'t use custom HTML tags such as <product> or <price>. If you are sure there aren\'t any, click OK. Otherwise click Cancel')) return;
        this.activeEditors.forEach(function (editor, index) {
            let mode = editor.session.getMode().$id,
                settings = { 'code': editor.getValue(), 'indent': 'tabs' };

            mode = mode.substr(mode.lastIndexOf('/') + 1);
            if (mode === 'html') {
                settings['output'] = 'fragment';
                settings['allow-proprietary-attribs'] = 'true';
            }
            else if (mode === 'javascript') {
                mode = 'js';
            }
            jQuery.post('https://www.10bestdesign.com/dirtymarkup/api/' + mode, settings)
                .then(function (res) {
                    editor.setValue(res.clean);
                });
        });
    }
};

scExtensions.focusMode = {
    isActive: false,

    enable: function (button) {
        if (scExtensions.editor.activeEditors == null || scExtensions.editor.activeEditors.length === 0) return;
        button = button || jQuery('.focus-button')[0];
        let editor = jQuery(jQuery(button).first().parent().parent().find('textarea')[1]).parent()
        editor.addClass('focused-editor');
        editor.parent().addClass('height-hack');
        jQuery('.scEditorFieldMarkerInputCell>div>div:nth-child(2):not(.focused-editor)').hide()
        jQuery('.scDockBottom').parent().hide();
        jQuery('#ContentEditor').addClass('content-editor-focusmode');
        jQuery('.splitter-bar-vertical').hide();
        jQuery('#RibbonPanel').hide()
        jQuery('#BTAddNewSearch').after('<a style="display: inline-block; margin-top: 29px" class="focus-off-button" title="" href="#">Focus Mode Off</a>');
        jQuery('.focus-off-button').click(function () {
            scExtensions.focusMode.disable();
        });
        scExtensions.editor.activeEditors.forEach(function (editor) { editor.resize(); }, this);
        this.isActive = true;
    },

    disable: function () {
        jQuery('.height-hack').removeClass('height-hack');
        jQuery('.scEditorFieldMarkerInputCell>div>div:nth-child(2):not(.focused-editor)').show()
        jQuery('.scDockBottom').parent().show();
        jQuery('.focus-off-button').remove();
        jQuery('.splitter-bar-vertical').show();
        jQuery('#RibbonPanel').show()
        jQuery('#ContentEditor').removeClass('content-editor-focusmode');
        jQuery('.focused-editor').removeClass('focused-editor');
        scExtensions.editor.activeEditors.forEach(function (editor) { editor.resize(); }, this);
        this.isActive = false;
    }
};

var scID = {
    get: function () {
        return jQuery('.scEditorHeaderQuickInfoInput').val();
    },
    break: function (str) {
        return str.replace(/{|-|}/g, "");
    },
    make: function (str) {
        var returnStr = '{';
        returnStr += str.substr(0, 8);
        returnStr += '-';
        returnStr += str.substr(8, 4);
        returnStr += '-';
        returnStr += str.substr(12, 4);
        returnStr += '-';
        returnStr += str.substr(16, 4);
        returnStr += '-';
        returnStr += str.substr(20, 12);
        returnStr += '}';
        return returnStr;
    },
    makeUrl: function (str) {
        let ret = str;
        if (ret[0] === '{') {
            ret = scID.break(ret);
        }
        return '-/media/' + ret + '.ashx';
    }
}


//Overrides default behaviour on the scRequest send method
scRequest.prototype.send = (function() {
    var cached_function = scRequest.prototype.send
    return function() {

        if (typeof this.parameters !== 'undefined' && this.parameters !== null) {
            if ((scExtensions.editor.isLoadRequest(this.parameters) && this.callback == null) || scExtensions.catchRequest) {
                this.callback = scExtensions.editor.onLoadRequest;
                scExtensions.catchRequest = false;
            }
            else if (scExtensions.editor.isLoadRequest(this.parameters)) this.callback = scExtensions.onLoadRequest;
            else if (this.parameters.substr(0, 13).toLowerCase() === "savefieldsize" && scExtensions.editor.activeEditors.length > 0) {
                scExtensions.editor.activeEditors.forEach(function (editor) { editor.resize(); }, this);
            }
            else if (this.parameters.substr(0, 16).toLowerCase() === "tree_contextmenu" && scExtensions.settings["use-shortcuts"]) {
                let itemID = scID.make(this.parameters.substr(28, this.parameters.length - 30)),
                    itemName = jQuery('#' + this.parameters.substr(18, this.parameters.length - 20) + ' span').text();
                scExtensions.shortcuts.currentItem = { 'id': itemID, 'name': itemName };
                this.callback = function () {
                    jQuery('.scPopup>table>tbody').addClass('main-menu');
                    jQuery('.scMenuDividerIcon').each(function(){
                        jQuery(this).parent().addClass('scMenuDivider');
                    });
                    jQuery('.scPopup .main-menu').after('<tbody class="automate-menu" style="display:none;"><tr class="show-main-menu context-option"><td class="scMenuItemIcon"><img src="/sitecore/shell/themes/standard/Images/Submenu16x16.png" border="0" width="16" height="16" style="vertical-align: middle;transform: rotate(180deg);" alt=""></td><td class="scMenuItemCaption">Back</td><td class="scMenuItemHotkey"></td></tr></tbody>');
                    jQuery('.scPopup .automate-menu')
                    .append('<tr class="add-to-automate context-option" data-id="' + itemID + '"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Add to Automate Queue</td><td class="scMenuItemHotkey"></td></tr>')
                    .append('<tr class="add-direct-children-to-automate context-option" data-id="' + itemID + '"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Add Direct Children to Automate Queue</td><td class="scMenuItemHotkey"></td></tr>')
                    .append('<tr class="add-children-to-automate context-option" data-id="' + itemID + '"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Add All Children to Automate Queue</td><td class="scMenuItemHotkey"></td></tr>')
                    .append('<tr class="clear-queue context-option"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Clear Queue</td><td class="scMenuItemHotkey"></td></tr><tr class="scMenuDivider"><td class="scMenuDividerIcon"></td><td class="scMenuDividerCaption"></td><td class="scMenuDividerHotkey"></td></tr>')
                    .append('<tr class="open-automate context-option"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Open Automation Tool</td><td class="scMenuItemHotkey"></td></tr>');
                    jQuery('.scPopup .main-menu>tr:last-child').before('<tr class="show-automate-menu context-option"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Automation Tool</td><td class="scMenuItemHotkey"><img src="/sitecore/shell/themes/standard/Images/Submenu16x16.png" border="0" width="16" height="16" style="vertical-align: middle;" alt=""></td></tr>');
                    jQuery('.scPopup .main-menu>tr:last-child').before('<tr class="add-shortcut context-option"><td class="scMenuItemIcon"></td><td class="scMenuItemCaption">Add Shortcut</td><td class="scMenuItemHotkey"></td></tr><tr class="scMenuDivider"><td class="scMenuDividerIcon"></td><td class="scMenuDividerCaption"></td><td class="scMenuDividerHotkey"></td></tr>');
                    jQuery('.scPopup').height(jQuery('.scPopup .main-menu>tr:not(.scMenuDivider)').length * 28);
                    setTimeout(function(){jQuery('.scPopup').css('width', 'initial');}, 100);
                    jQuery('.open-automate').click(scExtensions.automate.showPopup);
                    jQuery('.add-shortcut').click(function () {
                        scExtensions.shortcuts.add();
                    });
                    jQuery('.add-to-automate').click(function () {
                        scExtensions.automate.queue.push({
                            id: jQuery(this).data('id'),
                            name: itemName
                        });
                        Toast.warning('Succesfully added ' + itemName + ' to the Queue', "Item added to Automation Queue", {displayDuration: 8000});
                    });
                    jQuery('.clear-queue').click(function () {
                        scExtensions.automate.queue = [];
                        Toast.warning('Succesfully cleared Automation Queue', "Queue was cleared", {displayDuration: 8000});
                    });
                    jQuery('.add-direct-children-to-automate').click(function(){
                        scExtensions.runNextLoad = function(){
                            setTimeout(function(){
                                if (jQuery('.scContentTreeNodeActive').parent().find('img').eq(0).attr('src') === '/sitecore/shell/themes/standard/images/treemenu_collapsed.png') {
                                    jQuery('.scContentTreeNodeActive').parent().find('img').eq(0).click();
                                }
                                setTimeout(function(){
                                    jQuery('.scContentTreeNodeActive').parent().find('div').eq(1).children().children('.scContentTreeNodeGutter').each(function(){
                                        scExtensions.automate.queue.push({
                                            id: scID.make(this.id.replace('Gutter','')),
                                            name: jQuery(this).parent().parent().parent().find('a').first().text() + "/" + jQuery(this).parent().find('a').first().text()
                                        });
                                    });
                                    Toast.warning('Succesfully added ' + jQuery('.scContentTreeNodeActive').parent().find('div').eq(1).children().children('.scContentTreeNodeGutter').length + ' items to the Queue', "Added direct children to Automation Tool", {displayDuration: 8000});
                                }, 1000);
                            }, 1500);
                        }
                        scForm.invoke("item:load(id=" + itemID + ")");
                    });
                    jQuery('.add-children-to-automate').click(function () {
                        scExtensions.automate.openChildrenCallback = function(){
                            jQuery('.scContentTreeNodeActive').parent().find('.scContentTreeNode>.scContentTreeNodeGutter').each(function(){
                                scExtensions.automate.queue.push({
                                    id: scID.make(this.id.replace('Gutter','')),
                                    name: jQuery(this).parent().parent().parent().find('a').first().text() + "/" + jQuery(this).parent().find('a').first().text()
                                });
                            });
                            Toast.warning('Succesfully added ' + jQuery('.scContentTreeNodeActive').parent().find('.scContentTreeNode>.scContentTreeNodeGutter').length + ' items to the Queue', 'Added children to Automation Tool', {displayDuration: 8000});
                        };
                        scExtensions.runNextLoad = function(){
                            setTimeout(scExtensions.automate.openAllChildren, 1000);
                        };
                        scForm.invoke("item:load(id=" + itemID + ")");
                    });
                    jQuery('.show-automate-menu').click(function(){
                        jQuery('.scPopup .main-menu').hide();
                        jQuery('.scPopup .automate-menu').show();
                        jQuery('.scPopup').height(jQuery('.scPopup .automate-menu>tr').length * 28);
                    }); 
                    jQuery('.show-main-menu').click(function(){
                        jQuery('.scPopup .main-menu').show();
                        jQuery('.scPopup .automate-menu').hide();
                        jQuery('.scPopup').height(jQuery('.scPopup .main-menu>tr:not(.scMenuDivider)').length * 28);
                    });
                }
            }
            else if (this.parameters.substr(0, 16).toLowerCase() === "treesearch_click") {
                let res = scExtensions.checkSearchParameter(this.form);
                if (res != null) this.form = res;
            }
            else if (this.parameters.substr(0, 12).toLowerCase() === 'item:publish') {
                this.callback = function(){
                    if (scExtensions.quickPublish.active){
                        jQuery('#jqueryModalDialogsFrame').hide();
                        jQuery('#RibbonPanel, #QuickPublish, .scFlexColumnContainer.scWindowBorder2>div:last-child,#SystemMenu,.col2').hide();
                        if (scExtensions.settings["funny-loader"]) jQuery("#MainPanel").hide();
                        jQuery('.scDockTop').append('<div id="ribbonReplacement" style="height: 128px;"><h1 style="font-size:  2em;text-align:  center;color:  white;padding-top: calc(60px - 1em);">Publish in progress...</h1><h2 style="font-size: 1.3em;text-align:  center;color:  white;padding-top: 4px;">Step 1/3: Selecting language</h2><h4 style="font-size: 1em;text-align: center;color: white;padding-top: 20px;">Stuck for too long? <a href="#" style="color: #6dabde;" class="show-window">Show window</a></h4></div>');
                        jQuery('.show-window').click(function(){
                            jQuery('#jqueryModalDialogsFrame').show();
                            jQuery('#ribbonReplacement h4')[0].innerHTML = 'Still stuck? <a href="#" style="color: #6dabde;" class="reset-manually">Reset manually</a>';
                            jQuery('.reset-manually').click(function(){
                                jQuery('#QuickPublish, #RibbonPanel').show();
                                jQuery('#ribbonReplacement, #funnyLoader').remove();
                                jQuery(".scFlexColumnContainer.scWindowBorder2>div:not(:first-child),.col2,#SystemMenu").fadeIn();
                                top.jQuery('#jqueryModalDialogsFrame').show();
                                scExtensions.quickPublish.active = false;
                            });
                        });
                        if (scExtensions.settings["funny-loader"]) jQuery('.scFlexColumnContainer.scWindowBorder2').append('<div id="funnyLoader"><img src="-/media/0B32D23B38DD46FE9B0E4143E01B48CB.ashx" style="margin:auto;display:inherit;"></div>');
                        Toast.warning('Quick Publish started. Please wait for it to finish..', 'Publish Info', {displayDuration: 4000});
                    }
                    scExtensions.recommendPublishLanguage();
                }
            }
            else if (this.parameters.substr(0, 24).toLowerCase() === 'contentattachment:attach') {
                scExtensions.catchRequest = true;
            }
        }
        console.log(this);

        var result = cached_function.apply(this, arguments);
        return result;
    };
})();

window.onbeforeunload = function() {
    return "Close SiteCore?";
}

scExtensions.init();