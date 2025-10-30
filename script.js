// Countdown to next Friday 8PM
function updateCountdown() {
    const now = new Date();
    let nextFriday = new Date();
    
    // Set to next Friday
    nextFriday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7);
    nextFriday.setHours(20, 0, 0, 0);
    
    // If it's already Friday after 8PM, set to next week
    if (now.getDay() === 5 && now.getHours() >= 20) {
        nextFriday.setDate(nextFriday.getDate() + 7);
    }
    
    const diff = nextFriday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
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

