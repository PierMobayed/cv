/**
 * Pier Mobayed — Personal Portfolio Script
 * Interactive UI, Terminal Emulator, CV Modal, Clipboard & Filters
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Toast Notification Helper ---
  const toastContainer = document.getElementById('toast-container');
  
  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--accent-cyan); font-weight: bold;">${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- 2. Copy to Clipboard Utility ---
  function copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(err => {
      console.warn('Clipboard write failed, fallback:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(successMsg);
    });
  }

  // Copy email triggers
  const emailHero = document.getElementById('copy-email-hero');
  if (emailHero) {
    emailHero.addEventListener('click', () => {
      copyTextToClipboard('piermtech@gmail.com', 'Email copied: piermtech@gmail.com');
    });
  }

  const contactEmailCard = document.getElementById('contact-copy-email');
  if (contactEmailCard) {
    contactEmailCard.addEventListener('click', () => {
      copyTextToClipboard('piermtech@gmail.com', 'Email copied: piermtech@gmail.com');
    });
  }

  // Inline project command copy buttons
  document.querySelectorAll('.btn-copy-inline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cmd = e.target.getAttribute('data-copy');
      if (cmd) {
        copyTextToClipboard(cmd, `Command copied: ${cmd}`);
      }
    });
  });

  // --- 3. Mobile Navigation Drawer ---
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // --- 4. Project Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 5. CV Modal Viewer & Printing ---
  const cvModal = document.getElementById('cv-modal');
  const openCvNavBtn = document.getElementById('open-cv-modal-btn');
  const openCvMobileBtn = document.getElementById('open-cv-modal-btn-mobile');
  const heroCvBtn = document.getElementById('hero-cv-btn');
  const closeCvBtn = document.getElementById('modal-close-btn');
  const printCvBtn = document.getElementById('modal-print-btn');
  const cvIframe = document.getElementById('cv-iframe');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  if (openCvNavBtn) openCvNavBtn.addEventListener('click', openCvModal);
  if (openCvMobileBtn) openCvMobileBtn.addEventListener('click', openCvModal);
  if (heroCvBtn) heroCvBtn.addEventListener('click', openCvModal);
  if (closeCvBtn) closeCvBtn.addEventListener('click', closeCvModal);

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCvModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('open')) {
      closeCvModal();
    }
  });

  if (printCvBtn && cvIframe) {
    printCvBtn.addEventListener('click', () => {
      try {
        cvIframe.contentWindow.focus();
        cvIframe.contentWindow.print();
      } catch (err) {
        window.open('cv.html', '_blank');
      }
    });
  }

  // --- 6. Interactive Terminal Emulator ---
  const termInput = document.getElementById('terminal-input');
  const termHistory = document.getElementById('terminal-history');
  const termBody = document.getElementById('terminal-body');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  const commandResponses = {
    help: `Available commands:
  • about       - Overview & executive summary of Pier Mobayed
  • education   - University degree, First Class classification & module scores
  • projects    - Active engineering repositories and live utilities
  • skills      - Technical competencies & toolchains
  • ped.run     - Open-source Windows administration tool & execution command
  • cv          - Opens the interactive Curriculum Vitae preview
  • contact     - Direct email, phone, and professional profiles
  • whoami      - Current session visitor information
  • date        - Displays system date & local timezone
  • clear       - Clears terminal output history`,

    about: `PIER MOBAYED
BSc (Hons) Computer Science • First Class Honours (Overall 75%)
Location: Leeds, West Yorkshire, United Kingdom
Focus: Cyber Security, Enterprise Cisco Networking, OS Hardening, Distributed Systems

Pier combines deep theoretical knowledge in network protocols and digital forensics
with proven engineering experience: building production tools (ped.run), high-throughput
FastAPI backends (sub-5ms latency), and multi-agent test-driven systems (127+ automated tests).`,

    education: `ACADEMIC CREDENTIALS:
Degree:         BSc (Hons) Computer Science
Institution:    University / NCG (Elizabeth School), Leeds
Classification: First Class Honours (75% Overall) (2023 - 2026)

Key Module Scores & Standards:
  [83%] Advanced Networking (Cisco IOS, BGP, OSPF, VLANs, IASME)
  [77%] Digital Forensic Investigation (Autopsy, FTK Imager, Wireshark, Volatility)
  [74%] CMP600 Capstone Dissertation (Door2Door Real-time Logistics Prototype)
  [1st] Vulnerability & Penetration Testing (OWASP Top 10, Kali, Metasploit, Burp)
  [1st] Secure Web Development (SQLi, XSS, CSRF, Audit Logs)
  [1st] DevOps & Collaborative Development (CI/CD, Git branching, TDD)`,

    projects: `FEATURED REPOSITORIES & PRODUCTION ARTEFACTS:
1. PEDToolBox (ped.run)
   - Windows OS maintenance, hardening & zero-touch deployment (autounattend.xml)
   - Launch: powershell iex(irm ped.run) | GitHub: github.com/PierMobayed/PEDToolBox

2. PM Bridge System
   - Distributed Multi-Agent orchestration via Chrome DevTools Protocol (CDP)
   - 127+ automated tests via native node:test | GitHub: github.com/PierMobayed/pm-bridge-system

3. CMP600 Dissertation Prototype
   - FastAPI real-time logistics engine with sub-5ms P95 latency & 3 React portals
   - GitHub: github.com/PierMobayed/CMP600_Dissertation_Project

4. CPU Thermometer
   - Next.js 16 / TypeScript real-time kernel & hardware telemetry dashboard
   - GitHub: github.com/PierMobayed/cpu-thermometar

5. Enterprise Fleet Rental Platform
   - Laravel 11, Spatie RBAC, Stripe payment integration & automated PDF contracts
   - GitHub: github.com/PierMobayed/fleet-rental-management-system`,

    skills: `TECHNICAL COMPETENCIES MATRIX:
• Networking:        Cisco IOS (83%), BGP, OSPF, VLANs, TCP/IP, Wireshark, Firewalls, IASME
• Cyber Security:    Digital Forensics (77%), FTK Imager, Autopsy, Volatility, OWASP Top 10, Nmap, Burp Suite
• OS & Hardening:    Windows Internals, Registry, Services, Group Policy, Defender, Linux (Ubuntu/Debian)
• Languages:         Python, PowerShell, JavaScript/TypeScript, PHP, SQL, Bash, Batch
• Frameworks/Tools:  FastAPI, React, Next.js 16, Node.js, Laravel 11, Docker, Playwright, CDP, TDD (node:test)`,

    'ped.run': `PEDToolBox — Production Windows Administration & Security Tool
Domain:  https://ped.run (https://piermobayed.github.io/PEDToolBox/)
Author:  Pier Mobayed

One-line PowerShell execution:
  powershell iex(irm ped.run)

Key Capabilities:
  • Automated restore points with visual progress indicator
  • Complete Registry, Services, and Task Scheduler backup & restore
  • Defender, UAC, and ExecutionPolicy hardening
  • Unattended Windows 10/11 installation file generator (autounattend.xml)
  • Automated system health & driver diagnostics`,

    cv: `Opening Curriculum Vitae modal...`,

    contact: `GET IN TOUCH:
  • Email:    piermtech@gmail.com
  • Phone:    *** *** ***
  • Location: Leeds, West Yorkshire, United Kingdom
  • GitHub:   https://github.com/PierMobayed
  • LinkedIn: https://linkedin.com/in/piermobayed`,

    whoami: `visitor@pier-portfolio (Leeds, UK Node) — Access Level: Guest Observer`,

    date: `Current System Date: ${new Date().toUTCString()}`,

    sudo: `Permission denied: Pier Mobayed is the superuser on this system.`
  };

  function executeTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      termHistory.innerHTML = '';
      return;
    }

    const commandEntry = document.createElement('div');
    commandEntry.className = 'terminal-output-line term-cmd-log';
    commandEntry.innerHTML = `<span class="term-prompt">visitor@pier-portfolio:~$</span> <span>${escapeHtml(cmdRaw)}</span>`;
    termHistory.appendChild(commandEntry);

    const resultEntry = document.createElement('div');
    resultEntry.className = 'terminal-output-line term-result';

    if (commandResponses[cmd]) {
      resultEntry.textContent = commandResponses[cmd];
      if (cmd === 'cv') {
        setTimeout(openCvModal, 400);
      }
    } else {
      resultEntry.innerHTML = `<span style="color: #ef4444;">zsh: command not found: ${escapeHtml(cmd)}</span>. Type <span class="term-highlight">'help'</span> for a list of valid commands.`;
    }

    termHistory.appendChild(resultEntry);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeTerminalCommand(val);
      }
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        if (termInput) termInput.value = '';
        executeTerminalCommand(cmd);
      }
    });
  });

  // --- 7. Contact Form Simulation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      showToast(`Thank you, ${name}! Your inquiry has been dispatched.`, '🚀');

      // Create mailto link for client convenience
      const mailtoLink = `mailto:piermtech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 900);

      contactForm.reset();
    });
  }

  // --- 8. Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
