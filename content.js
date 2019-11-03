'use strict';

addSearchElements();
addSearchScripts();
// showSearch();

function addSearchElements() {
  addSearchNavLink();
  addSearchPane();
  addStyles();
}

function addSearchScripts() {
  const defaultApp = 'HBBYL2QI18';
  const defaultKey = 'b32e9a1c66a55cbcfcb4ef9aaaf972b5';
  setTimeout(() => {
    Vue.use(VueInstantSearch);

    new Vue({
        el: '#bs',
        data: {
            searchClient: algoliasearch(
              defaultApp,
              defaultKey,
            ),
        },
    });
  }, 1);
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

function toggleSearch() {
  const isHidden = document.getElementById('bs').className.includes('is-hidden');
  if(isHidden) {
    showSearch();
  } else {
    hideSearch();
  }
}

function showSearch() {
  document.getElementsByTagName('html')[0].className += ' is-clipped';
  document.getElementById('bs').className = document.getElementById('bs').className.replace('is-hidden', '');
}

function hideSearch() {
  document.getElementsByTagName('html')[0].className = document.getElementsByTagName('html')[0].className.replace(' is-clipped', '');
  document.getElementById('bs').className += 'is-hidden';
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
            <ais-hits>
              <div slot-scope="{ items }">
                <a v-for="item in items" :key="item.objectID" class="box" :href="item.url">
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
          </div>
        </div>
      </ais-instant-search>
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
