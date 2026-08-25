/* Preview loader.
   In the design-system host a compiled bundle exposes the components on window;
   this file is the standalone fallback so every card and UI-kit page also opens
   directly from the file system. It fetches the component sources, strips the ESM
   syntax, transpiles the JSX with Babel standalone, and evaluates everything in a
   single scope, returning an explicit namespace built from the export names. */
(function () {
  var CORE = [
    'components/core/Button.jsx',
    'components/core/Tag.jsx',
    'components/core/Card.jsx',
    'components/core/Divider.jsx',
    'components/core/Portrait.jsx',
    'components/forms/Input.jsx',
    'components/forms/Textarea.jsx',
    'components/content/SectionHeader.jsx',
    'components/content/ExperienceItem.jsx',
    'components/content/StatBlock.jsx',
    'components/content/SkillGroup.jsx',
    'components/content/ProjectCard.jsx',
    'components/navigation/NavBar.jsx',
    'components/navigation/TextLink.jsx'
  ];
  var KIT = [
    'ui_kits/portfolio/data.js',
    'ui_kits/portfolio/Hero.jsx',
    'ui_kits/portfolio/Work.jsx',
    'ui_kits/portfolio/Experience.jsx',
    'ui_kits/portfolio/About.jsx',
    'ui_kits/portfolio/Contact.jsx',
    'ui_kits/portfolio/ProjectDrawer.jsx',
    'ui_kits/portfolio/PortfolioSite.jsx'
  ];

  /* A pre-compiled bundle, if the host provided one. */
  function hosted(names) {
    for (var k in window) {
      try {
        var v = window[k];
        if (v && typeof v === 'object' && names.every(function (n) { return typeof v[n] === 'function'; })) return v;
      } catch (e) {}
    }
    return null;
  }

  var cache = {};

  window.dsResolve = function (names, opts) {
    var o = opts || {};
    var rel = o.root || '';
    var key = rel + (o.kit ? ':kit' : ':core');

    var host = hosted(names);
    if (host) return Promise.resolve(host);
    if (cache[key]) return cache[key];

    var files = o.kit ? CORE.concat(KIT) : CORE;

    cache[key] = Promise.all(files.map(function (f) {
      return fetch(rel + f).then(function (r) {
        if (!r.ok) throw new Error('could not load ' + f + ' (' + r.status + ')');
        return r.text();
      });
    })).then(function (sources) {
      var exported = [];
      var body = sources.map(function (src) {
        var re = /^export\s+(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)/gm;
        var m;
        while ((m = re.exec(src))) if (exported.indexOf(m[1]) === -1) exported.push(m[1]);
        return src
          .replace(/^\s*import\s[\s\S]*?;\s*$/gm, '')
          .replace(/^export\s+/gm, '');
      }).join('\n\n');

      var wrapped = '(function (React, ReactDOM) {\n' + body +
        '\nreturn {' + exported.join(', ') + '};\n})';
      var code = window.Babel.transform(wrapped, { presets: ['react'] }).code;

      return (0, eval)(code)(window.React, window.ReactDOM);
    });

    return cache[key];
  };
})();
