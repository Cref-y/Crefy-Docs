// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Getting Started</a></li><li class="chapter-item expanded affix "><li class="part-title">Crefy 1.0</li><li class="chapter-item expanded "><a href="guide/installation.html"><strong aria-hidden="true">1.</strong> Crefy </a></li><li><ol class="section"><li class="chapter-item expanded "><a href="v1/crefy-passports.html"><strong aria-hidden="true">1.1.</strong> Crefy Passports</a></li><li class="chapter-item expanded "><a href="v1/crefy-credentials.html"><strong aria-hidden="true">1.2.</strong> Crefy Credentials</a></li><li class="chapter-item expanded "><a href="v1/crefy-memories.html"><strong aria-hidden="true">1.3.</strong> Crefy Memories</a></li></ol></li><li class="chapter-item expanded "><a href="develop/installations.html"><strong aria-hidden="true">2.</strong> Build with Crefy</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="develop/prerequisites.html"><strong aria-hidden="true">2.1.</strong> Prerequisites</a></li><li class="chapter-item expanded "><a href="develop/api.html"><strong aria-hidden="true">2.2.</strong> API Overview</a></li><li class="chapter-item expanded "><a href="develop/sdk.html"><strong aria-hidden="true">2.3.</strong> SDK Overview</a></li><li class="chapter-item expanded "><a href="develop/tools.html"><strong aria-hidden="true">2.4.</strong> Developer Tools</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Crefy 2.0</li><li class="chapter-item expanded "><a href="v2/preview.html"><strong aria-hidden="true">3.</strong> Crefy 2.0 </a></li><li><ol class="section"><li class="chapter-item expanded "><a href="v2/Appchain.html"><strong aria-hidden="true">3.1.</strong> App-Chain Direction</a></li><li class="chapter-item expanded "><a href="v2/NativeZk.html"><strong aria-hidden="true">3.2.</strong> Native ZK Support</a></li><li class="chapter-item expanded "><a href="v2/progAttestations.html"><strong aria-hidden="true">3.3.</strong> Programmable Attestations</a></li><li class="chapter-item expanded "><a href="storge/shardspace.html"><strong aria-hidden="true">3.4.</strong> Shardspace</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="storge/architecture.html"><strong aria-hidden="true">3.4.1.</strong> Architecture</a></li><li class="chapter-item expanded "><a href="storge/incentives.html"><strong aria-hidden="true">3.4.2.</strong> Incentives</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="resources/eg.html"><strong aria-hidden="true">4.</strong> Resources</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
