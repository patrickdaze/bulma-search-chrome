'use strict';

/*
This code is pretty messy. Just hacking to together a quick solution for search.
*/

addSearchElements();
// showSearch();

let focusItem = -1;

function addSearchElements() {
  addSearchNavLink();
  addSearchPane();
  addStyles();
  addGlobalEvents();
}

function addSearchScripts() {
  chrome.storage.sync.get(['appId', 'appKey'], (settings) => {
    const hasCustomSettings = typeof settings.appId === 'string' && settings.appId.length > 1 && typeof settings.appKey === 'string' && settings.appKey.length > 1;
    const defaultApp = hasCustomSettings ? settings.appId : 'HBBYL2QI18';
    const defaultKey = hasCustomSettings ? settings.appKey : 'b32e9a1c66a55cbcfcb4ef9aaaf972b5';

    const searchClient = algoliasearch(
      defaultApp,
      defaultKey,
    );

    Vue.use(VueInstantSearch);
    
    new Vue({
        el: '#bs',
        data: {
            searchClient: {
              search(requests) {
                focusItem = -1;
                return searchClient.search(requests, {
                  analyticsTags: [
                    'extension',
                  ],
                });
              }
            }
        },
    });
  });

  // Quick way to check if Algolia was loaded
  let hasErrorChecks = 0;
  const hasErrorInterval = setInterval(() => {
    hasErrorChecks++;
    if(document.getElementsByClassName('ais-SearchBox-input').length >= 1) {
      document.getElementById('bsSearchError').className = "is-hidden";
      clearInterval(hasErrorInterval);
    }

    if(hasErrorChecks >= 20) {
      clearInterval(hasErrorInterval);
    }
  }, 100);
}

function addSearchNavLink() {
  const searchNavLink = document.createElement('div');
  searchNavLink.innerHTML = '<a href="#" class="navbar-item bd-navbar-item-search" id="navSearchLink"><span class="icon has-text-info"><i class="fas fa-search"></i></span></a>';
  const firstNavLink = document.querySelector('#navbar .navbar-start a');
  firstNavLink.parentNode.insertBefore(searchNavLink, firstNavLink);
  document.getElementById('navSearchLink').addEventListener('click', (e) => {
    e.preventDefault();
    toggleSearch();
  });
}

function isHidden() {
  return document.getElementById('bs').className.includes('is-hidden');
}

function toggleSearch() {
  if(isHidden()) {
    showSearch();
  } else {
    hideSearch();
  }
}

function addGlobalEvents() {
  document.body.addEventListener('keyup', (e) => {
    if(e.key === '/' && e.target.tagName !== 'INPUT') {
      showSearch();
    } else if(e.key === 'Escape') {
      hideSearch();
    } else if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if(!isHidden()) {
        const hits = document.getElementsByClassName('ais-Hits');
        if(hits.length === 0) {
          return;
        }

        const items = document.getElementsByClassName('ais-Hits')[0].getElementsByClassName('box');
        if(items.length === 0) {
          return;
        }

        focusItem += e.key === 'ArrowDown' ? 1 : -1;
        if(focusItem <= -1) {
          focusItem = -1;
          setTimeout(() => document.getElementsByClassName('ais-SearchBox-input').length >= 1 && document.getElementsByClassName('ais-SearchBox-input')[0].focus(), 10);
          return;
        } else if(focusItem >= items.length) {
          focusItem = items.length - 1;
        }

        items[focusItem].focus();
      }
    }
  });
  document.body.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && e.target.className.includes('ais-SearchBox-input')) {
      document.getElementsByClassName('ais-Hits')[0].getElementsByClassName('box')[0].click();
    }
  });
}

let firstSearch = true;
function showSearch() {
  if(firstSearch) {
    firstSearch = false;
    addSearchScripts();
  }

  focusItem = -1;

  if(isHidden()) {
    adjustLayout();
    document.getElementsByTagName('html')[0].className += ' is-clipped';
    document.getElementById('bs').className = document.getElementById('bs').className.replace('is-hidden', '');
  }

  setTimeout(() => document.getElementsByClassName('ais-SearchBox-input').length >= 1 && document.getElementsByClassName('ais-SearchBox-input')[0].focus(), 10);
}

function hideSearch() {
  if(isHidden()) {
    return;
  }

  document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(' is-clipped', '');
  document.getElementById('bs').className += 'is-hidden';
}

function adjustLayout() {
  const navbarBoundingBoxHeight = document.getElementById('navbar').getBoundingClientRect().height + 2; // 2 for shadow/border
  const offset = window.scrollY < navbarBoundingBoxHeight ? navbarBoundingBoxHeight - window.scrollY : 0;
  document.getElementById('bs').style.top = `${offset}px`;
}

function addSearchPane() {
  const template = `
    <div class="container">
      <ais-instant-search index-name="classes" v-bind:search-client="searchClient">
        <div class="columns">
          <div class="column">
            <nav class="level bs-search_header">
              <div class="level-left">
                <div class="level-item">
                    <ais-search-box
                      placeholder="Search Bulma…"
                      :class-names="{
                        'ais-SearchBox-input': 'input bs-search_input',
                        'ais-SearchBox-submit': 'is-hidden',
                        'ais-SearchBox-reset': 'is-hidden',
                      }"
                      autofocus
                    ></ais-search-box>
                </div>
                <div class="level-item has-text-grey-light is-size-7">
                  Shortcuts: <span class="tag has-text-weight-bold has-text-grey mx-1">/</span> open <span class="tag has-text-weight-bold has-text-grey ml-3 mr-1">esc</span> close <span class="tag has-text-weight-bold has-text-grey ml-3">up</span>/<span class="tag has-text-weight-bold has-text-grey mr-1">down</span> select <span class="tag has-text-weight-bold has-text-grey ml-3 mr-1">enter</span> go to
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <ais-powered-by />
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div class="columns bs-search_hits">
          <div class="column">
            <ais-state-results>
              <template slot-scope="{ hits }">
                <ais-hits v-if="hits.length > 0">
                  <div slot-scope="{ items }">
                    <a v-for="item in items" :key="item.objectID" class="box" :href="'/' + item.url">
                      <template v-if="typeof item.pageTitle === 'string'">
                        <h2 class="title is-5 is-marginless">
                          {{ item.pageTitle }}
                          <span v-if="item.sectionTitle" class="has-text-grey">#{{ item.sectionTitle }}</span>
                        </h2>
                        <p v-if="item.pageBreadcrumbLevel > 1" class="has-text-grey-light"><small>{{ item.pageBreadcrumb }}</small></p>
                        <ais-snippet attribute="sectionContent" :hit="item" :class-names="{
                            'ais-Snippet': 'has-text-grey-dark',
                            'ais-Snippet-highlighted': 'has-text-info',
                          }" />
                      </template>
                      <template v-else>
                        <h2 class="title is-5 is-marginless">
                          {{ item.title }}
                        </h2>
                        <p class="has-text-grey-light"><small>{{ item.breadcrumb }}</small></p>
                      </template>
                    </a>
                  </div>
                </ais-hits>
                <p v-else>
                  No results found
                </p>
              </template>
            </ais-state-results>
          </div>
        </div>
      </ais-instant-search>
      <div class="columns bs-search_error" id="bsSearchError">
        <div class="column">
          <p class="has-text-grey-light">Search loading… If it doesn't load within a couple seconds, try switching the search provider from the extension's options.</p>
        </div>
      </div>
    </div>
  `;

  const searchPane = document.createElement('div');
  searchPane.innerHTML = template;
  searchPane.className = 'is-hidden';
  searchPane.setAttribute('id', 'bs');
  const navbar = document.getElementById('navbar');
  navbar.parentNode.insertBefore(searchPane, navbar);
}

function addStyles() {
  const styles = document.createElement('style');
  styles.innerHTML = `
    #bs {
      position: fixed;
      top: 87px;
      z-index: 199;
      background: #fff;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .bs-search_header {
      height: 70px;
      padding-top: 20px;
    }
    .bs-search_hits {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: calc(100vh - 87px - 70px - 20px);
    }
    .bs-search_input {
      width: 500px;
    }
  `;

  const firstScript = document.querySelector('head script');
  firstScript.parentNode.insertBefore(styles, firstScript);
}
