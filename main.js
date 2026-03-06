import { gsap } from 'gsap';
import { RetellWebClient } from 'retell-client-js-sdk';

const retellWebClient = new RetellWebClient();
let isCalling = false;

async function toggleCall(buttonElement) {
  if (isCalling) {
    retellWebClient.stopCall();
    isCalling = false;
    if (buttonElement && buttonElement.querySelector('.btn-text')) {
      buttonElement.querySelector('.btn-text').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
        Connect With Concierge`;
    }
    return;
  }

  isCalling = true;
  if (buttonElement && buttonElement.querySelector('.btn-text')) {
    buttonElement.querySelector('.btn-text').innerText = "Connecting...";
  }

  try {
    const response = await fetch('/api/create-web-call', { method: 'POST' });
    if (!response.ok) throw new Error("Failed to fetch token");
    const data = await response.json();

    await retellWebClient.startCall({
      accessToken: data.access_token,
    });

    if (buttonElement && buttonElement.querySelector('.btn-text')) {
      buttonElement.querySelector('.btn-text').innerText = "Stop Call";
    }
  } catch (error) {
    console.error("Error starting call:", error);
    isCalling = false;
    if (buttonElement && buttonElement.querySelector('.btn-text')) {
      buttonElement.querySelector('.btn-text').innerText = "Connection Failed";
      setTimeout(() => {
        buttonElement.querySelector('.btn-text').innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          Connect With Concierge`;
      }, 2000)
    }
  }
}

retellWebClient.on("agent_start_talking", () => {
  // Optional animation could go here
});

retellWebClient.on("call_ended", () => {
  isCalling = false;
  // Reset buttons if needed
  const ctaBtns = document.querySelectorAll('.cta-btn');
  ctaBtns.forEach(btn => {
    if (btn.querySelector('.btn-text')) {
      btn.querySelector('.btn-text').innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          Connect With Concierge`;
    }
  })
});
document.addEventListener('DOMContentLoaded', () => {
  // GSAP Initial Animations for Hero
  gsap.from('.badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.hero-header h1', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.hero-subline', { y: 20, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });

  gsap.from('.video-container', {
    x: -40,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.5
  });

  gsap.from('.voice-ai-card', {
    x: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    delay: 0.7
  });

  // Magnetic Button Logic
  const magneticButton = document.querySelector('.magnetic-btn');

  if (magneticButton) {
    magneticButton.addEventListener('mousemove', (e) => {
      const rect = magneticButton.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate dist
      const dist = Math.sqrt(x * x + y * y);
      // Dampen the effect based on size
      gsap.to(magneticButton, {
        duration: 0.3,
        x: x * 0.2,
        y: y * 0.2,
        scale: 1.05,
        ease: 'power2.out'
      });
      // Move inner text slightly more for parallax
      gsap.to(magneticButton.querySelector('.btn-text'), {
        duration: 0.3,
        x: x * 0.1,
        y: y * 0.1,
        ease: 'power2.out'
      });
    });

    magneticButton.addEventListener('mouseleave', () => {
      gsap.to(magneticButton, {
        duration: 0.6,
        x: 0,
        y: 0,
        scale: 1,
        ease: 'elastic.out(1, 0.3)'
      });
      gsap.to(magneticButton.querySelector('.btn-text'), {
        duration: 0.6,
        x: 0,
        y: 0,
        ease: 'elastic.out(1, 0.3)'
      });
    });

    magneticButton.addEventListener('click', () => {
      toggleCall(magneticButton);
    });
  }

  // Slider Logic
  const slider = document.getElementById('baSlider');
  const wrapper = document.getElementById('baAfterWrapper');
  const handle = document.getElementById('baHandle');
  const riskText = document.getElementById('riskLevelText');

  if (slider && wrapper && handle) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      wrapper.style.width = `${val}%`;
      handle.style.left = `${val}%`;

      if (val > 80) {
        riskText.innerHTML = `Risk Level: <span class="risk-neutralized">Neutralized</span>`;
      } else if (val > 40) {
        riskText.innerHTML = `Risk Level: <span style="color:#F59E0B;">Moderate</span>`;
      } else {
        riskText.innerHTML = `Risk Level: <span class="risk-high">High</span>`;
      }
    });
  }

  // Tilt Card Logic
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.5,
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out'
      });
    });
  });

  // Sticky AI Bubble Visibility logic
  const stickyBubble = document.getElementById('stickyAiBubble');
  window.addEventListener('scroll', () => {
    // Show bubble after scrolling past hero section (approx 600px)
    if (window.scrollY > 600) {
      stickyBubble.classList.add('visible');
    } else {
      stickyBubble.classList.remove('visible');
    }
  });

  if (stickyBubble) {
    stickyBubble.addEventListener('click', () => {
      toggleCall(stickyBubble);
    });
  }

  // Reactive Exit Intent Modal Logic
  const exitOverlay = document.getElementById('exitOverlay');
  const exitModal = document.getElementById('exitModal');
  const closeModal = document.getElementById('closeModal');
  let exitIntentTriggered = false;

  document.addEventListener('mouseleave', (e) => {
    // Check if moving to top of window (URL bar area)
    if (e.clientY <= 0 && !exitIntentTriggered) {
      exitOverlay.classList.add('active');
      exitModal.classList.add('active');
      exitIntentTriggered = true;
    }
  });

  closeModal.addEventListener('click', () => {
    exitOverlay.classList.remove('active');
    exitModal.classList.remove('active');
  });

  exitOverlay.addEventListener('click', () => {
    exitOverlay.classList.remove('active');
    exitModal.classList.remove('active');
  });

  // Attach magnetic effect to modal btn too
  const modalBtn = document.getElementById('modalAiBtn');
  if (modalBtn) {
    modalBtn.addEventListener('mousemove', (e) => {
      const rect = modalBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(modalBtn, { duration: 0.3, x: x * 0.1, y: y * 0.1, ease: 'power2.out' });
      gsap.to(modalBtn.querySelector('.btn-text'), { duration: 0.3, x: x * 0.05, y: y * 0.05, ease: 'power2.out' });
    });
    modalBtn.addEventListener('mouseleave', () => {
      gsap.to(modalBtn, { duration: 0.6, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
      gsap.to(modalBtn.querySelector('.btn-text'), { duration: 0.6, x: 0, y: 0, ease: 'elastic.out(1, 0.3)' });
    });
    modalBtn.addEventListener('click', () => {
      toggleCall(modalBtn);
    });
  }

  // Custom Video Embed Logic (Facade Pattern)
  const videoEmbeds = document.querySelectorAll('.custom-video-embed');
  videoEmbeds.forEach(embed => {
    embed.addEventListener('click', function () {
      const videoId = this.dataset.videoId;
      this.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:8px;"></iframe>`;
      this.style.cursor = 'default';
    });
  });
});
