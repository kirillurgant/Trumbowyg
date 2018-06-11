/* ===========================================================
 * trumbowyg.preformatted.js v1.0
 * Preformatted plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Casella Edoardo (Civile)
 */


(function ($) {
    'use strict';

    var defaultOptions = {
        className: '',
    };

    $.extend(true, $.trumbowyg, {
        langs: {
            // jshint camelcase:false
            en: {
                preformatted: 'Code sample <pre>'
            },
            fr: {
                preformatted: 'Exemple de code <pre>'
            },
            it: {
                preformatted: 'Codice <pre>'
            },
            zh_cn: {
                preformatted: '代码示例 <pre>'
            },
            ru: {
                preformatted: 'Пример кода <pre>'
            },
            ja: {
                preformatted: 'コードサンプル <pre>'
            },
            tr: {
                preformatted: 'Kod örneği <pre>'
            }
        },
        // jshint camelcase:true

        plugins: {
            preformatted: {
                init: function (trumbowyg) {
                    trumbowyg.o.plugins.preformatted = $.extend(true, {},
                      defaultOptions,
                      trumbowyg.o.plugins.preformatted || {}
                    );

                    var btnDef = {
                        fn: function () {
                            trumbowyg.saveRange();
                            var text = trumbowyg.getRangeText();
                            if (text.replace(/\s/g, '') !== '') {
                                try {
                                    var curtag = getSelectionParentElement().tagName.toLowerCase();
                                    if (curtag === 'code' || curtag === 'pre') {
                                        return unwrapCode();
                                    }
                                    else {
                                        trumbowyg.execCmd('insertHTML', '<code class=' + trumbowyg.o.plugins.preformatted.className +
                                            '>' + escapeHtml(text) +'</code>');
                                    }
                                } catch (e) {
                                }
                            }
                        }
                    };

                    trumbowyg.addBtnDef('preformatted', btnDef);
                }
            }
        }
    });

    function escapeHtml(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    /*
     * GetSelectionParentElement
     */
    function getSelectionParentElement() {
        var parentEl = null,
            selection;

        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.rangeCount) {
                parentEl = selection.getRangeAt(0).commonAncestorContainer;
                if (parentEl.nodeType !== 1) {
                    parentEl = parentEl.parentNode;
                }
            }
        } else if ((selection = document.selection) && selection.type !== 'Control') {
            parentEl = selection.createRange().parentElement();
        }

        return parentEl;
    }

    /*
     * UnwrapCode
     * ADD/FIX: to improve, works but can be better
     * "paranoic" solution
     */
    function unwrapCode() {
        var container = null;

        if (document.selection) { //for IE
            container = document.selection.createRange().parentElement();
        } else {
            var select = window.getSelection();
            if (select.rangeCount > 0) {
                container = select.getRangeAt(0).startContainer.parentNode;
            }
        }

        //'paranoic' unwrap
        var ispre = $(container).contents().closest('pre').length;
        var iscode = $(container).contents().closest('code').length;

        if (ispre && iscode) {
            $(container).contents().unwrap('code').unwrap('pre');
        } else if (ispre) {
            $(container).contents().unwrap('pre');
        } else if (iscode) {
            $(container).contents().unwrap('code');
        }
    }
})(jQuery);
