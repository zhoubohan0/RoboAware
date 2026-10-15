'use strict';

const gallery = document.querySelector('#gallery');
const controllers = [];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const playIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2.5v15L17 10z"/></svg>';

function videoPane(video, experiment, index) {
  const label = escapeHTML(video.label);
  const description = escapeHTML(`${video.label}: ${experiment.title}`);
  return `<figure class="video-pane${video.ours ? ' is-ours' : ''}">
    <figcaption><p class="video-label">${label}</p></figcaption>
    <div class="media-frame">
      <video controls playsinline muted preload="none" poster="assets/posters/${experiment.id}-${index}.jpg" aria-label="${description}">
        <source src="${escapeHTML(video.src)}" type="video/mp4">
        Your browser does not support embedded video. <a href="${escapeHTML(video.src)}">Open this video</a>.
      </video>
      <button class="poster-play" type="button" aria-label="Play ${description}"><span>${playIcon}</span></button>
      <div class="media-error" hidden role="status">This video could not be loaded.<a href="${escapeHTML(video.src)}">Open the original video ↗</a></div>
    </div>
    ${video.outcome ? `<p class="video-outcome ${video.result}"><span aria-hidden="true">${video.result === 'success' ? '✓' : '×'}</span>${escapeHTML(video.outcome)}</p>` : ''}
  </figure>`;
}

function cardMarkup(experiment) {
  return `<article id="${experiment.id}" class="comparison-card${experiment.group === 'embodiments' ? ' robot-card' : ''}" aria-labelledby="${experiment.id}-title">
    <header class="card-intro"><div><p class="card-tag">${escapeHTML(experiment.tag)}</p><h4 id="${experiment.id}-title">${escapeHTML(experiment.title)}</h4></div></header>
    <div class="comparison-scroll" tabindex="0" role="region" aria-label="${escapeHTML(experiment.title)} Side-by-side videos; scroll horizontally on small screens."><div class="video-grid" style="--columns:${experiment.videos.length}">${experiment.videos.map((video, index) => videoPane(video, experiment, index)).join('')}</div></div>
    ${experiment.caption ? `<p class="card-caption">${escapeHTML(experiment.caption)}</p>` : ''}
    <div class="card-controls">
      <button class="play-together" type="button" aria-label="Play all videos: ${escapeHTML(experiment.title)}">▶ Play together</button>
      <button class="restart" type="button" aria-label="Restart all videos: ${escapeHTML(experiment.title)}">↻ Restart</button>
      <label class="speed-control" for="${experiment.id}-speed">Playback<select id="${experiment.id}-speed" aria-label="Playback speed: ${escapeHTML(experiment.title)}">${[0.25, 0.5, 1, 2].map(speed => `<option value="${speed}"${speed === (experiment.speed || 1) ? ' selected' : ''}>${speed}×</option>`).join('')}</select></label>
      <p class="playback-status" role="status"></p>
    </div>
  </article>`;
}

gallery.innerHTML = experimentGroups.map(group => `<section class="experiment-group" data-group="${group.id}" aria-labelledby="${group.id}-title">
  <header class="group-heading"><span class="group-number" aria-hidden="true">${group.number}</span><div><p class="eyebrow">${group.label}</p><h3 id="${group.id}-title">${escapeHTML(group.title)}</h3><p class="group-description">${escapeHTML(group.description)}</p></div></header>
  ${experiments.filter(experiment => experiment.group === group.id).map(cardMarkup).join('')}
</section>`).join('');

function waitForMedia(video) {
  if (video.readyState >= 2) return Promise.resolve();
  if (video.error) return Promise.reject(video.error);
  return new Promise((resolve, reject) => {
    const finish = error => {
      clearTimeout(timeout);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('error', failed);
      video.querySelector('source').removeEventListener('error', failed);
      error ? reject(error) : resolve();
    };
    const ready = () => finish();
    const failed = () => finish(new Error('Video could not be loaded.'));
    const timeout = setTimeout(() => finish(new Error('Video loading timed out.')), 15000);
    video.addEventListener('loadeddata', ready, { once: true });
    video.addEventListener('error', failed, { once: true });
    video.querySelector('source').addEventListener('error', failed, { once: true });
    video.preload = 'auto';
    video.load();
  });
}

for (const experiment of experiments) {
  const card = document.getElementById(experiment.id);
  const videos = [...card.querySelectorAll('video')];
  const playButton = card.querySelector('.play-together');
  const speedSelect = card.querySelector('select');
  const status = card.querySelector('.playback-status');
  let runId = 0;
  let loading = false;

  const refresh = () => {
    if (loading) return;
    const playing = videos.some(video => !video.paused && !video.ended);
    const ended = videos.every(video => video.ended);
    playButton.textContent = playing ? 'Ⅱ Pause together' : ended ? '↻ Replay together' : '▶ Play together';
    playButton.setAttribute('aria-label', `${playing ? 'Pause' : ended ? 'Replay' : 'Play'} all videos: ${experiment.title}`);
  };
  const pause = () => {
    runId += 1;
    loading = false;
    playButton.disabled = false;
    videos.forEach(video => video.pause());
    if (status.textContent === 'Loading all videos…') status.textContent = '';
    refresh();
  };
  const setSpeed = () => videos.forEach(video => { video.playbackRate = Number(speedSelect.value); });
  setSpeed();

  const startTogether = async () => {
    const thisRun = ++runId;
    loading = true;
    playButton.disabled = true;
    playButton.textContent = 'Loading…';
    status.textContent = 'Loading all videos…';
    videos.forEach(video => video.pause());
    try {
      await Promise.all(videos.map(waitForMedia));
      if (thisRun !== runId) return;
      videos.forEach(video => {
        video.currentTime = 0;
        video.playbackRate = Number(speedSelect.value);
      });
      const results = await Promise.allSettled(videos.map(video => video.play()));
      if (thisRun !== runId) { videos.forEach(video => video.pause()); return; }
      if (results.some(result => result.status === 'rejected')) {
        videos.forEach(video => video.pause());
        status.textContent = 'Playback was interrupted. Try Play together again, or use each video’s play button.';
      } else {
        status.textContent = 'Started together · each clip holds its final frame.';
      }
    } catch {
      if (thisRun === runId) status.textContent = 'A video could not be loaded. Try again or open its original file.';
    } finally {
      if (thisRun === runId) {
        loading = false;
        playButton.disabled = false;
        refresh();
      }
    }
  };

  playButton.addEventListener('click', () => {
    if (videos.some(video => !video.paused && !video.ended)) pause();
    else startTogether();
  });
  card.querySelector('.restart').addEventListener('click', () => {
    pause();
    videos.forEach(video => { if (video.readyState > 0) video.currentTime = 0; });
    status.textContent = 'All clips reset to the beginning.';
    refresh();
  });
  speedSelect.addEventListener('change', setSpeed);
  for (const video of videos) {
    const frame = video.closest('.media-frame');
    const overlay = frame.querySelector('.poster-play');
    const showError = () => {
      frame.querySelector('.media-error').hidden = false;
      overlay.hidden = true;
      status.textContent = 'A video could not be loaded. Open its original file to view it.';
    };
    video.addEventListener('loadedmetadata', setSpeed);
    video.addEventListener('play', () => { frame.classList.add('has-started'); refresh(); });
    video.addEventListener('pause', refresh);
    video.addEventListener('ended', refresh);
    video.addEventListener('error', showError);
    video.querySelector('source').addEventListener('error', showError);
    overlay.addEventListener('click', async () => {
      video.playbackRate = Number(speedSelect.value);
      frame.classList.add('has-started');
      try { await video.play(); }
      catch { frame.classList.remove('has-started'); status.textContent = 'Playback could not start. Try again or use Play together.'; }
    });
  }
  controllers.push({ card, pause, videos });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => !entry.isIntersecting).forEach(entry => {
      controllers.find(controller => controller.card === entry.target)?.pause();
    });
  }, { rootMargin: '160px' });
  controllers.forEach(controller => observer.observe(controller.card));
}
document.addEventListener('visibilitychange', () => { if (document.hidden) controllers.forEach(controller => controller.pause()); });
