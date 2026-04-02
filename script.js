// Lógica do botão de instalar PWA
let deferredPrompt = null;
const showInstallButton = () => {
    const container = document.getElementById('pwa-install-container');
    if (container) container.style.display = 'block';
};
const hideInstallButton = () => {
    const container = document.getElementById('pwa-install-container');
    if (container) container.style.display = 'none';
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

window.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    hideInstallButton();
                }
                deferredPrompt = null;
            } else {
                // Fallback: instrução para instalar manualmente
                alert('Para instalar, use o menu do navegador: "Adicionar à tela inicial" ou "Install app".');
            }
        });
    }

    // Fallback: se o evento não disparar, mostrar botão em navegadores suportados
    setTimeout(() => {
        if (!deferredPrompt && window.matchMedia('(display-mode: browser)').matches) {
            showInstallButton();
        }
    }, 3000);
});
// PWA: Registrar o service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js');
    });
}
function updateCountdown() {
    const now = new Date();
    let nextFriday = new Date();

    // Calcula a próxima sexta
    const daysUntilFriday = (5 - now.getDay() + 7) % 7;
    nextFriday.setDate(now.getDate() + daysUntilFriday);

    // 👉 PULA essa sexta e vai para a outra
    nextFriday.setDate(nextFriday.getDate() + 7);

    // Horário do evento
    nextFriday.setHours(20, 0, 0, 0);

    const diff = nextFriday - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Dice Roller Functionality
function rollDice(expression) {
    // Simple dice roller - handles basic expressions like 2d6+3, d20, etc.
    const pattern = /^(\d*)d(\d+)(?:([+-]\d+))?$/i;
    const match = expression.match(pattern);
    
    if (!match) {
        return { total: 0, rolls: [], error: "Invalid dice expression" };
    }
    
    const numDice = match[1] ? parseInt(match[1]) : 1;
    const numSides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    if (numDice < 1 || numDice > 100) {
        return { total: 0, rolls: [], error: "Number of dice must be between 1 and 100" };
    }
    
    if (numSides < 2 || numSides > 100) {
        return { total: 0, rolls: [], error: "Number of sides must be between 2 and 100" };
    }
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    total += modifier;
    
    return { total, rolls, modifier, error: null };
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Dice roller functionality
    const rollButton = document.getElementById('roll-button');
    const diceExpression = document.getElementById('dice-expression');
    const diceResult = document.getElementById('dice-result');
    const quickDiceButtons = document.querySelectorAll('.quick-dice');
    
    rollButton.addEventListener('click', function() {
        const expression = diceExpression.value.trim() || 'd20';
        const result = rollDice(expression);
        
        if (result.error) {
            diceResult.innerHTML = `<span class="text-red-400">${result.error}</span>`;
        } else {
            let rollsText = result.rolls.join(' + ');
            if (result.modifier !== 0) {
                rollsText += ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}`;
            }
            
            diceResult.innerHTML = `
                <div class="animate-pulse">
                    <div class="text-xl">${result.total}</div>
                    <div class="text-sm text-gray-400">${rollsText}</div>
                </div>
            `;
            
            // Add rolling animation
            diceResult.classList.add('dice-roll-animation');
            setTimeout(() => {
                diceResult.classList.remove('dice-roll-animation');
            }, 500);
        }
    });
    
    // Quick dice buttons
    quickDiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            diceExpression.value = this.dataset.dice;
        });
    });
    
    // Allow Enter key to trigger dice roll
    diceExpression.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            rollButton.click();
        }
    });
    
    // Initialize particle background for hero section
    createParticleBackground();
});

// Create simple particle background
function createParticleBackground() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-bg';
    document.querySelector('section.relative').prepend(particleContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full bg-fire-400';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        const animationDuration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        particle.style.animation = `float ${animationDuration}s ease-in-out ${delay}s infinite`;
        
        particleContainer.appendChild(particle);
    }
    
    // Add to style dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            50% {
                transform: translateY(-20px) translateX(10px);
            }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  const vid = document.getElementById('highlight-video');
  const btnSound = document.getElementById('toggle-sound');
  const btnPlay = document.getElementById('toggle-play');

  if (!vid) return;

  // Atualiza texto do botão conforme estado
  const updateButtons = () => {
    btnSound.textContent = vid.muted ? 'Som' : 'Sem som';
    btnPlay.textContent = vid.paused ? 'Play' : 'Pause';
  };

  // Toggle som — exige interação do usuário, por isso botão
  btnSound?.addEventListener('click', async (e) => {
    try {
      if (vid.muted) {
        vid.muted = false;
        // tentar tocar (alguns navegadores exigem play() após unmute)
        await vid.play().catch(() => {});
      } else {
        vid.muted = true;
      }
    } catch (err) {
      console.warn('Não foi possível alternar som:', err);
    }
    updateButtons();
  });

  // Play / Pause toggle
  btnPlay?.addEventListener('click', () => {
    if (vid.paused) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
    updateButtons();
  });

  // Clique sobre o vídeo também alterna play/pause (opcional)
  vid.addEventListener('click', () => {
    if (vid.paused) vid.play().catch(() => {});
    else vid.pause();
    updateButtons();
  });

  updateButtons();
});

// ===========================
// CAMPAIGN SECTION LOGIC
// ===========================

// Dados dos personagens da campanha
const campaignCharacters = [
  {
    id: 1,
    name: 'Marco',
    class: 'Guerreiro',
    race: 'Humano',
    description: 'Um guerreiro valente e determinado, conhecido por sua coragem em batalha.',
    portrait: 'imagens/Marco.jpeg',
    attributes: {
      str: 18,
      dex: 12,
      con: 16,
      int: 10,
      wis: 13,
      cha: 14
    },
    equipment: ['Espada Longa', 'Escudo de Aço', 'Armadura de Placas', 'Capacete de Guerra'],
    skills: ['Combat', 'Intimidação', 'Atletismo', 'Percepção']
  },
  {
    id: 2,
    name: 'Brida',
    class: 'Ladina',
    race: 'Valforde',
    description: 'Uma gatuna astuta e ágil, especialista em furtos e furtividade.',
    portrait: 'imagens/WhatsApp Image 2026-04-01 at 18.38.13.jpeg',
    attributes: {
      str: 10,
      dex: 18,
      con: 12,
      int: 14,
      wis: 11,
      cha: 15
    },
    equipment: ['Adagas Gêmeas', 'Capa de Invisibilidade', 'Kit de Roubo', 'Veneno'],
    skills: ['Furtividade', 'Prestidigitação', 'Acrobacia', 'Percepção']
  },
  {
    id: 3,
    name: 'Geraldo',
    class: 'Orc - Bárbaro',
    race: 'Orc',
    description: 'Um bárbaro feroz e poderoso, com força bruta incomparável.',
    portrait: 'imagens/Geraldo.jpeg',
    attributes: {
      str: 20,
      dex: 10,
      con: 18,
      int: 8,
      wis: 12,
      cha: 11
    },
    equipment: ['Machado de Guerra', 'Pele de Animal', 'Totém Tribal', 'Colar de Dentes'],
    skills: ['Atletismo', 'Intimidação', 'Sobrevivência', 'Percepção']
  },
  {
    id: 4,
    name: 'Elandor',
    class: 'Elfo da Floresta - Ladino',
    race: 'Elfo',
    description: 'Um elfo gracioso da floresta, mestre em stealth e combat.',
    portrait: 'imagens/Elandor.jpeg',
    attributes: {
      str: 13,
      dex: 17,
      con: 13,
      int: 16,
      wis: 15,
      cha: 12
    },
    equipment: ['Arco Élfico', 'Flechas Mágicas', 'Adaga Élfica', 'Capa Verde'],
    skills: ['Furtividade', 'Percepção', 'Sobrevivência', 'Conhecimento da Natureza']
  },
  {
    id: 5,
    name: 'Valenhardt',
    class: 'Paladino',
    race: 'Humano',
    description: 'Um paladino justo e honrado, dedicado à justiça e proteção dos inocentes.',
    portrait: 'imagens/Valenhart.jpeg',
    attributes: {
      str: 17,
      dex: 13,
      con: 14,
      int: 11,
      wis: 18,
      cha: 16
    },
    equipment: ['Espada Sagrada', 'Escudo Crusado', 'Armadura Divina', 'Símbolo Sagrado'],
    skills: ['Intuição', 'Percepção', 'Religião', 'Medicina']
  }
];

// Function to render characters list
function renderCharactersList() {
  const container = document.getElementById('characters-container');
  if (!container) return;

  container.innerHTML = '';

  campaignCharacters.forEach((character) => {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card');
    characterCard.setAttribute('data-character-id', character.id);
    
    characterCard.innerHTML = `
      <img src="${character.portrait}" alt="${character.name}">
      <div class="character-card-info flex-1">
        <h4>${character.name}</h4>
        <p>${character.class}</p>
      </div>
    `;

    characterCard.addEventListener('click', () => {
      // Remove active class from all cards
      document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('active');
      });

      // Add active class to clicked card
      characterCard.classList.add('active');

      // Display character details
      displayCharacterDetails(character);
    });

    container.appendChild(characterCard);
  });

  // Auto-select first character
  if (campaignCharacters.length > 0) {
    displayCharacterDetails(campaignCharacters[0]);
    const firstCard = document.querySelector('[data-character-id="1"]');
    if (firstCard) firstCard.classList.add('active');
  }
}

// Function to display character details
function displayCharacterDetails(character) {
  const detailContent = document.getElementById('character-detail-content');
  if (!detailContent) return;

  detailContent.innerHTML = `
    <div class="character-detail-wrapper">
      <div class="character-portrait-container">
        <img src="${character.portrait}" alt="${character.name}" class="character-portrait">
      </div>
    </div>
  `;
}

// Initialize campaign section when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  renderCharactersList();
});


