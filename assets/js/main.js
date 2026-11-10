var html = document.documentElement;
var body = document.body;
var timeout;
var st = 0;

cover();
featured();
pagination(false);
callouts();

window.addEventListener('scroll', function () {
    'use strict';
    if (body.classList.contains('home-template') && body.classList.contains('with-full-cover') && !document.querySelector('.cover').classList.contains('half')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(portalButton);
    }
});

if (document.querySelector('.cover') && document.querySelector('.cover').classList.contains('half')) {
    body.classList.add('portal-visible');
}

function portalButton() {
    'use strict';
    st = window.scrollY;

    if (st > 300) {
        body.classList.add('portal-visible');
    } else {
        body.classList.remove('portal-visible');
    }
}

function cover() {
    'use strict';
    var cover = document.querySelector('.cover');
    if (!cover) return;

    imagesLoaded(cover, function () {
        cover.classList.remove('image-loading');
    });

    document.querySelector('.cover-arrow').addEventListener('click', function () {
        var element = cover.nextElementSibling;
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
}

function featured() {
    'use strict';
    var feed = document.querySelector('.featured-feed');
    if (!feed) return;

    tns({
        container: feed,
        controlsText: [
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        gutter: 30,
        loop: false,
        nav: false,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

/* Callout cards: let post text wrap around them on wider screens, and tilt
 * each line of text a little differently so it reads as handwritten. */
function callouts() {
    'use strict';
    var cards = document.querySelectorAll('.gh-content .kg-callout-card');
    if (!cards.length) return;

    var ANGLES = [-2.6, -1.4, -2.2, -1, -3]; // degrees, one per line
    var INDENTS = [0, 1.1, 0.15, 1.6, 0.5]; // em, one per line
    var FLOWS = ['P', 'UL', 'OL'];

    Array.prototype.forEach.call(cards, function (card) {
        // Group the callout with the paragraphs that follow it
        var next = card.nextElementSibling;
        if (card.parentElement.classList.contains('gh-content') && next && FLOWS.indexOf(next.tagName) !== -1) {
            var flow = document.createElement('div');
            flow.className = 'callout-flow';
            card.parentElement.insertBefore(flow, card);
            flow.appendChild(card);
            while (flow.nextElementSibling && FLOWS.indexOf(flow.nextElementSibling.tagName) !== -1) {
                flow.appendChild(flow.nextElementSibling);
            }
        }

        var text = card.querySelector('.kg-callout-text');
        if (text) wrapWords(text);
    });

    function wrapWords(el) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(function (node) {
            var parts = node.nodeValue.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            parts.forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    var span = document.createElement('span');
                    span.className = 'callout-word';
                    span.textContent = part;
                    frag.appendChild(span);
                }
            });
            node.parentNode.replaceChild(frag, node);
        });
    }

    function layout() {
        Array.prototype.forEach.call(document.querySelectorAll('.gh-content .kg-callout-text'), function (text, cardIndex) {
            var words = text.querySelectorAll('.callout-word');
            Array.prototype.forEach.call(words, function (word) {
                word.style.transform = '';
                word.style.transformOrigin = '';
            });
            text.classList.add('is-handwritten');

            // Sort words into lines by their vertical position
            var lines = [];
            var lastTop = null;
            Array.prototype.forEach.call(words, function (word) {
                var top = word.offsetTop;
                if (lastTop === null || Math.abs(top - lastTop) > word.offsetHeight / 2) {
                    lines.push([]);
                    lastTop = top;
                }
                lines[lines.length - 1].push(word);
            });

            // Rotate each line as one piece around its first word
            lines.forEach(function (line, i) {
                var n = i + cardIndex;
                var angle = ANGLES[n % ANGLES.length];
                var indent = i === 0 ? 0 : INDENTS[n % INDENTS.length];
                var startX = line[0].offsetLeft;
                line.forEach(function (word) {
                    word.style.transformOrigin = (startX - word.offsetLeft) + 'px 60%';
                    word.style.transform = 'translateX(' + indent + 'em) rotate(' + angle + 'deg)';
                });
            });
        });
    }

    var lastWidth = window.innerWidth;
    var resizeTimer;
    window.addEventListener('resize', function () {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 150);
    });

    layout();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layout);
    }
}
