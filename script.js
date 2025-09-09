window.$docsify = {
  name: '🦀 Bevy Tutorials',
  repo: '',
  loadSidebar: true,
  autoHeader: true,
  auto2top: true,
  subMaxLevel: 4,
  coverpage: false,
  notFoundPage: '404.md',

  search: {
    placeholder: '🔍 Cerca tra i tutorial...',
    noData: '😞 Nessun risultato trovato',
    depth: 4,
    paths: 'auto',
    hideOtherSidebarContent: false,
    namespace: 'bevy-tutorials'
  },

  themeColor: '#f17f0d',

  highlight: function (code, lang) {
    if (lang === 'rust') {
      return Prism.highlight(code, Prism.languages.rust, 'rust');
    }
    return code;
  },


  plugins: [
    function (hook, vm) {
      hook.doneEach(function () {
        const app = document.getElementById('app');
        if (app) {
          app.classList.add('loaded');
        }

        addIconsToHeaders();
        highlightActiveSidebarItem();
      });

      hook.ready(function () {
        initCustomSearch();
      });
    }
  ],

  markup: function (markdown) {
    return markdown
      .replace(/^## (Basic)/gm, '## 🧠 $1')
      .replace(/^## (2D Rendering)/gm, '## 🎨 $1')
      .replace(/^## (Input)/gm, '## ⌨️ $1')
      .replace(/^## (States)/gm, '## 🔄 $1')
      .replace(/^## (3D Rendering)/gm, '## 🎮 $1')
      .replace(/^## (See Also)/gm, '## 🔗 $1')
      .replace(/^### (.*Windows.*)/gm, '### 🪟 $1')
      .replace(/^### (.*Images.*)/gm, '### 🖼️ $1')
      .replace(/^### (.*Texts.*)/gm, '### 🔤 $1')
      .replace(/^### (.*Shapes.*)/gm, '### 🔷 $1')
      .replace(/^### (.*Keyboards.*)/gm, '### ⌨️ $1')
      .replace(/^### (.*Mouses.*)/gm, '### 🖱️ $1')
      .replace(/^### (.*Timers.*)/gm, '### ⏱️ $1');
  }
};

function initCustomSearch() {
  const searchInput = document.querySelector('.search input');
  const sidebarNav = document.querySelector('.sidebar-nav');

  if (!searchInput || !sidebarNav) return;

  const searchResultsContainer = document.createElement('div');
  searchResultsContainer.className = 'search-results';
  sidebarNav.parentNode.insertBefore(searchResultsContainer, sidebarNav);

  searchInput.addEventListener('input', function (e) {
    const query = e.target.value.trim();

    if (query.length > 2) {
      showSearchResults(query, searchResultsContainer);
      sidebarNav.style.display = 'none';
    } else {
      hideSearchResults(searchResultsContainer);
      sidebarNav.style.display = 'block';
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search') && !e.target.closest('.search-results')) {
      hideSearchResults(searchResultsContainer);
      sidebarNav.style.display = 'block';
    }
  });
}
function highlightActiveSidebarItem() {
  const currentPath = window.location.hash.replace('#/', '') || 'README.md';

  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

  sidebarLinks.forEach(link => {
    link.classList.remove('active');
  });

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');

      let parent = link.parentElement;
      while (parent && parent !== document.querySelector('.sidebar-nav')) {
        if (parent.classList.contains('collapse')) {
          parent.classList.add('open');
        }
        parent = parent.parentElement;
      }
    }
  });
}
function showSearchResults(query, container) {
  const results = [
    { title: 'Introduzione a Bevy', path: 'introduzione.md', excerpt: 'Bevy è un motore di gioco in Rust...' },
    { title: 'Configurazione Windows', path: 'configurazione-windows.md', excerpt: 'Per configurare Bevy su Windows...' },
    { title: 'Gestione Input', path: 'input.md', excerpt: 'La gestione degli input in Bevy...' },
    { title: 'Rendering 3D', path: 'rendering-3d.md', excerpt: 'Come funziona il rendering 3D in Bevy...' },
    { title: 'Gestione Stati', path: 'stati.md', excerpt: 'La gestione degli stati dell\'applicazione...' }
  ];

  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  container.innerHTML = '';

  if (filteredResults.length > 0) {
    filteredResults.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.className = 'search-result-item';

      const highlightedTitle = highlightText(result.title, query);
      const highlightedExcerpt = highlightText(result.excerpt, query);

      resultElement.innerHTML = `
            <div><strong>${highlightedTitle}</strong></div>
            <div style="font-size: 0.8em; margin-top: 5px; color: #a0aec0;">${highlightedExcerpt}</div>
          `;

      resultElement.addEventListener('click', function () {
        window.location.hash = '#/' + result.path;
        hideSearchResults(container);
        document.querySelector('.sidebar-nav').style.display = 'block';
      });

      container.appendChild(resultElement);
    });

    container.classList.add('active');
  } else {
    container.innerHTML = '<div class="search-result-item">Nessun risultato trovato</div>';
    container.classList.add('active');
  }
}

function hideSearchResults(container) {
  container.classList.remove('active');
  setTimeout(() => {
    container.innerHTML = '';
  }, 300);
}

function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="search-result-highlight">$1</span>');
}

function addIconsToHeaders() {
  const headers = document.querySelectorAll('.markdown-section h2, .markdown-section h3');
  const iconMap = {
    'Basic': '🧠',
    '2D Rendering': '🎨',
    'Input': '⌨️',
    'States': '🔄',
    '3D Rendering': '🎮',
    'See Also': '🔗',
    'Windows': '🪟',
    'Images': '🖼️',
    'Texts': '🔤',
    'Shapes': '🔷',
    'Keyboards': '⌨️',
    'Mouses': '🖱️',
    'Timers': '⏱️'
  };

  headers.forEach(header => {
    const text = header.textContent;
    for (const [key, icon] of Object.entries(iconMap)) {
      if (text.includes(key)) {
        if (!header.innerHTML.includes(icon)) {
          header.innerHTML = icon + ' ' + header.innerHTML;
        }
        break;
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  function addSidebarIcons() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const iconMap = {
      'Basic': '🧠',
      '2D Rendering': '🎨',
      'Input': '⌨️',
      'States': '🔄',
      '3D Rendering': '🎮',
      'See Also': '🔗',
      'Windows': '🪟',
      'Images': '🖼️',
      'Texts': '🔤',
      'Shapes': '🔷',
      'Keyboards': '⌨️',
      'Mouses': '🖱️',
      'Timers': '⏱️'
    };

    sidebarLinks.forEach(link => {
      const text = link.textContent;
      for (const [key, icon] of Object.entries(iconMap)) {
        if (text.includes(key) && !link.innerHTML.includes(icon)) {
          link.innerHTML = icon + ' ' + link.innerHTML;
          break;
        }
      }
    });
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        addSidebarIcons();
      }
    });
  });

  const sidebar = document.querySelector('.sidebar-nav');
  if (sidebar) {
    observer.observe(sidebar, { childList: true, subtree: true });

    setTimeout(addSidebarIcons, 1000);
  }
});