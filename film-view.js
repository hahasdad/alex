export function initFilmView(onLoad) {
  const sections = [...document.querySelectorAll('body > #home, body > #about, body > #works, body > #help')];
  const homeTitle = document.title;
  let film;
  let loading;
  let returnScroll = 0;
  let returnFocus;
  let visible = false;

  async function loadFilm() {
    if (film) return film;
    if (!loading) {
      loading = (async () => {
        const response = await fetch('film.html');
        if (!response.ok) throw new Error('Film page request failed');
        const source = new DOMParser().parseFromString(await response.text(), 'text/html');
        const content = source.querySelector('main.film');
        if (!content) throw new Error('Film content missing');
        film = document.importNode(content, true);
        film.id = 'film';
        film.hidden = true;
        film.querySelectorAll('img').forEach(image => { image.decoding = 'async'; });
        const back = film.querySelector('a[href="index.html#works"]');
        back.href = '#works';
        back.addEventListener('click', event => {
          if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          if (history.state?.filmView) history.back();
          else location.hash = 'works';
        });
        const dialog = film.querySelector('#video-dialog');
        film.querySelector('.video-trigger').addEventListener('click', () => dialog.showModal());
        dialog.querySelector('.close').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => {
          if (event.target !== dialog) return;
          const bounds = dialog.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
        });
        document.body.insertBefore(film, document.querySelector('.music-player'));
        onLoad();
        return film;
      })().catch(error => { loading = null; throw error; });
    }
    return loading;
  }

  async function renderRoute() {
    if (location.hash === '#film') {
      try {
        await loadFilm();
        if (location.hash !== '#film' || visible) return;
        returnScroll = scrollY;
        returnFocus = document.activeElement;
        sections.forEach(section => { section.hidden = true; });
        film.hidden = false;
        visible = true;
        document.body.classList.add('film-view');
        document.querySelector('.skip')?.setAttribute('href', '#film');
        document.title = film.querySelector('h1').textContent.trim() + ' — Hongbo Hao';
        window.scrollTo({ top: 0, behavior: 'instant' });
        const heading = film.querySelector('h1');
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      } catch (error) {
        console.warn('Could not load film view', error);
        // The standalone page remains available if the in-page request fails.
        location.assign('film.html');
      }
    } else if (visible) {
      film.querySelector('dialog[open]')?.close();
      film.hidden = true;
      sections.forEach(section => { section.hidden = false; });
      visible = false;
      document.body.classList.remove('film-view');
      document.querySelector('.skip')?.setAttribute('href', '#home');
      document.title = homeTitle;
      const destination = returnFocus?.matches('.work-one') ? returnScroll : document.querySelector('#works').offsetTop;
      window.scrollTo({ top: destination, behavior: 'instant' });
      returnFocus?.focus({ preventScroll: true });
    }
  }

  document.querySelectorAll('a[href="film.html"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState({ filmView: true }, '', '#film');
      renderRoute();
    });
  });
  window.addEventListener('popstate', renderRoute);
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
