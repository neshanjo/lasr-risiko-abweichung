const qualityObjectives = [
  {
    id: 'q1',
    badge: 'Qualitätsziel 1',
    name: 'Sicherheit',
    color: '#F7A1A7',
    target: 83,
    risk: 0,
  },
  {
    id: 'q2',
    badge: 'Qualitätsziel 2',
    name: 'Funktion',
    color: '#89D1EE',
    target: 83,
    risk: 0,
  },
  {
    id: 'q3',
    badge: 'Qualitätsziel 3',
    name: 'Laufzeit-Effizienz',
    color: '#FFF2A3',
    target: 75,
    risk: 0,
  },
  {
    id: 'q4',
    badge: 'Qualitätsziel 4',
    name: 'Kosten',
    color: '#BCE4D3',
    target: 67,
    risk: 0,
  },
  {
    id: 'q5',
    badge: 'Qualitätsziel 5',
    name: 'Wartbarkeit',
    color: '#BAC1C4',
    target: 67,
    risk: 0,
  },
];

function createCard(quality) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.background = quality.color;

  card.innerHTML = `
    <h2 class="card-title">${quality.badge}</h2>

    <div class="input-group">
      <label class="input-label">
        Zielwert
        <span class="target-value">${quality.target}</span>
      </label>
      <input type="number" class="target-input" value="${quality.target}" min="0" max="100" />
      <input type="range" class="target-slider" value="${quality.target}" min="0" max="100" />
    </div>

    <div class="input-group">
      <label class="input-label">
        Risikopunkte
        <span class="risk-value">${quality.risk}</span>
      </label>
      <input type="number" class="risk-input" value="${quality.risk}" min="0" max="150" />
      <input type="range" class="risk-slider" value="${quality.risk}" min="0" max="150" />
    </div>

    <div class="results">
      <div class="result-item">
        <span class="result-label">Abweichung</span>
        <span class="result-value deviation"></span>
      </div>
      <div class="result-item">
        <span class="result-label">Ist-Wert</span>
        <span class="result-value actual"></span>
      </div>
      <div class="result-bar">
        <div class="result-bar-fill" style="width: 0%; background: ${adjustColor(quality.color, -30)};"></div>
      </div>
    </div>
  `;

  const title = card.querySelector('.card-title');
  const targetInput = card.querySelector('.target-input');
  const targetSlider = card.querySelector('.target-slider');
  const riskInput = card.querySelector('.risk-input');
  const riskSlider = card.querySelector('.risk-slider');
  const targetValueEl = card.querySelector('.target-value');
  const riskValueEl = card.querySelector('.risk-value');
  const deviationEl = card.querySelector('.deviation');
  const actualEl = card.querySelector('.actual');
  const barFill = card.querySelector('.result-bar-fill');

  card.title = title;

  function startRename() {
    const original = title.textContent;
    title.textContent = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'title-input';
    input.value = original;
    title.appendChild(input);
    input.focus();
    input.select();

    function finishRename() {
      title.textContent = input.value || original;
      card.updateValues();
    }

    input.addEventListener('blur', finishRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
      if (e.key === 'Escape') {
        input.value = original;
        input.blur();
      }
    });
  }

  title.addEventListener('click', (e) => {
    if (!title.querySelector('.title-input')) startRename();
  });

  function calculateDeviation(target, risk) {
    if (risk <= 0) return 0;
    if (risk >= 100) return target;
    return target / 100 * risk;
  }

  card.updateValues = function () {
    const target = parseFloat(targetInput.value) || 0;
    const risk = parseFloat(riskInput.value) || 0;
    const deviation = calculateDeviation(target, risk);
    const actual = target - deviation;

    targetValueEl.textContent = Math.round(target);
    riskValueEl.textContent = Math.round(risk);
    targetSlider.value = Math.round(target);
    riskSlider.value = Math.round(risk);

    deviationEl.textContent = `- ${deviation.toFixed(1)}`;
    actualEl.textContent = actual.toFixed(1);

    barFill.style.width = `${actual}%`;
  };

  targetInput.addEventListener('input', () => {
    targetSlider.value = targetInput.value;
    card.updateValues();
  });

  targetSlider.addEventListener('input', () => {
    targetInput.value = targetSlider.value;
    card.updateValues();
  });

  riskInput.addEventListener('input', () => {
    riskSlider.value = riskInput.value;
    card.updateValues();
  });

  riskSlider.addEventListener('input', () => {
    riskInput.value = riskSlider.value;
    card.updateValues();
  });

  return card;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16 | g << 8 | b) >>> 0).toString(16).padStart(6, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  qualityObjectives.forEach(q => {
    const card = createCard(q);
    container.append(card);
    card.updateValues();
  });
});
