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

  // Utilizza l'highlighting nativo di Docsify con Prism
  highlight: function (code, lang) {
    if (lang === 'rust') {
      return Prism.highlight(code, Prism.languages.rust, 'rust');
    }
    return code;
  },

  plugins: [
    function (hook, vm) {
      hook.doneEach(function () {
        // Aggiungi icona di caricamento
        const app = document.getElementById('app');
        if (app) {
          app.classList.add('loaded');
        }

        // Aggiungi icona alle intestazioni
        addIconsToHeaders();
      });

      // Aggiungi gestione personalizzata della ricerca
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

// Inizializza la ricerca personalizzata
function initCustomSearch() {
  const searchInput = document.querySelector('.search input');
  const sidebarNav = document.querySelector('.sidebar-nav');

  if (!searchInput || !sidebarNav) return;

  // Crea un contenitore per i risultati della ricerca
  const searchResultsContainer = document.createElement('div');
  searchResultsContainer.className = 'search-results';
  sidebarNav.parentNode.insertBefore(searchResultsContainer, sidebarNav);

  // Gestisci l'input della ricerca
  searchInput.addEventListener('input', function (e) {
    const query = e.target.value.trim();

    if (query.length > 2) {
      // Simula risultati di ricerca (nella realtà questi verrebbero da Docsify)
      showSearchResults(query, searchResultsContainer);
      sidebarNav.style.display = 'none';
    } else {
      hideSearchResults(searchResultsContainer);
      sidebarNav.style.display = 'block';
    }
  });

  // Gestisci il click fuori dalla ricerca
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search') && !e.target.closest('.search-results')) {
      hideSearchResults(searchResultsContainer);
      sidebarNav.style.display = 'block';
    }
  });
}

// Mostra i risultati della ricerca
function showSearchResults(query, container) {
  // Simulazione di risultati (nella realtà questi verrebbero dal motore di ricerca di Docsify)
  const results = [
    { title: 'Introduzione a Bevy', path: 'introduzione.md', excerpt: 'Bevy è un motore di gioco in Rust...' },
    { title: 'Configurazione Windows', path: 'configurazione-windows.md', excerpt: 'Per configurare Bevy su Windows...' },
    { title: 'Gestione Input', path: 'input.md', excerpt: 'La gestione degli input in Bevy...' },
    { title: 'Rendering 3D', path: 'rendering-3d.md', excerpt: 'Come funziona il rendering 3D in Bevy...' },
    { title: 'Gestione Stati', path: 'stati.md', excerpt: 'La gestione degli stati dell\'applicazione...' }
  ];

  // Filtra i risultati in base alla query (simulato)
  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  // Genera l'HTML dei risultati
  container.innerHTML = '';

  if (filteredResults.length > 0) {
    filteredResults.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.className = 'search-result-item';

      // Evidenzia la query nel titolo
      const highlightedTitle = highlightText(result.title, query);
      const highlightedExcerpt = highlightText(result.excerpt, query);

      resultElement.innerHTML = `
                        <div><strong>${highlightedTitle}</strong></div>
                        <div style="font-size: 0.8em; margin-top: 5px; color: #a0aec0;">${highlightedExcerpt}</div>
                    `;

      // Aggiungi il click per navigare al risultato
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

// Nascondi i risultati della ricerca
function hideSearchResults(container) {
  container.classList.remove('active');
  setTimeout(() => {
    container.innerHTML = '';
  }, 300);
}

// Evidenzia il testo della query nei risultati
function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="search-result-highlight">$1</span>');
}

// Funzione per aggiungere icone alle intestazioni
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
  // Aggiungi icone alla sidebar
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

  // Osserva cambiamenti nella sidebar per aggiungere icone
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
    // Aspetta che la sidebar sia caricata
    setTimeout(addSidebarIcons, 1000);
  }
});