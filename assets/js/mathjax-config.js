MathJax = {
  loader: {
    load: ['input/tex', 'output/chtml', '[tex]/physics']
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    packages: {'[+]': ['physics']}
  },
  processEscapes: true,
  // Re: [mathjax-users] How to make inline math copyable?
  // https://groups.google.com/g/mathjax-users/c/1BzTQFINbqY/m/xGYAlhDNAwAJ
  options: {
    renderActions: {
      addCopyText: [155,
        (doc) => {for (const math of doc.math) MathJax.config.addCopyText(math, doc)},
        (math, doc) => MathJax.config.addCopyText(math, doc)
      ]
    }
  },
  addCopyText(math, doc) {
    const adaptor = doc.adaptor;
    const text = adaptor.node('mjx-copytext', {'aria-hidden': true}, [
      adaptor.text(math.start.delim + math.math + math.end.delim)
    ]);
    adaptor.append(math.typesetRoot, text);
  },
  startup: {
    ready() {
      MathJax._.output.chtml_ts.CHTML.commonStyles['mjx-copytext'] = {
        display: 'inline-block',
        position: 'absolute',
        top: 0, left: 0, width: 0, height: 0,
        opacity: 0,
        overflow: 'hidden'
      };
      MathJax.startup.defaultReady();
    }
  }
};
