// email.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('[email.js] DOM loaded');
    const btn = document.getElementById('send-coins-email');
    console.log('[email.js] button element:', btn);
  
    if (!btn) return;
  
    btn.addEventListener('click', () => {
      console.log('[email.js] Send‑coins button clicked');
      const user = JSON.parse(sessionStorage.getItem('user') || 'null');
      console.log('[email.js] user from sessionStorage:', user);
  
      if (!user || !user.email) {
        alert('You must be logged in to send an email.');
        return;
      }
  
      const templateParams = {
        to_email: user.email,
        nickname: user.nickname,
        coins: user.coins || 0
      };
      console.log('[email.js] templateParams →', templateParams);
  
      // Make the send call
      emailjs.send(
        'service_5x6bgze',
        'template_gdyes64',
        templateParams,
        '4D4g13EQ49270twmN'
      )
      .then(res => {
        console.log('[email.js] EmailJS success:', res);
        alert(`✉️ Check your inbox (${user.email}) — we just emailed you ${templateParams.coins} coins!`);
      })
      .catch(err => {
        console.error('[email.js] EmailJS error:', err);
        alert('❗️ Oops! Couldn’t send the email. Try again later.');
      });
    });
  });
  