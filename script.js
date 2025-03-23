const SUPABASE_URL = 'https://dlqisklehtapkbrscqsm.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscWlza2xlaHRhcGticnNjcXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3Mjk5MDIsImV4cCI6MjA1ODMwNTkwMn0.h8n4e7Qz9Pnw5BtlLG7wYtOzeL0eVaS6HcYFEbXc4_I';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

let user = null;

async function checkLoginStatus() {
    const { data: { user } } = await supabaseClient.auth.getUser();
  
    if (user) {
      document.getElementById('authContainer').style.display = 'none';
      document.getElementById('logoutContainer').style.display = 'block';
      document.getElementById('loggedInUser').textContent = user.email;
      await loadGame();
  
      // If character name is set, go to Home, else show naming input
      if (player.character_name) {
        document.getElementById('homeView').style.display = 'block';
      } else {
        document.getElementById('playerNameContainer').style.display = 'block';
      }
    } else {
      document.getElementById('authContainer').style.display = 'block';
      document.getElementById('logoutContainer').style.display = 'none';
      document.getElementById('homeView').style.display = 'none';
      document.getElementById('arenaView').style.display = 'none';
    }
  }
  
  
  // Call on load
  checkLoginStatus();

  async function signup() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
  
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
  
    if (error) {
      alert('Signup Error: ' + error.message);
    } else {
      alert('Signup successful! Please confirm your email.');
    }
  }
  
  async function login() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
  
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  
    if (error) {
      alert('Login Error: ' + error.message);
    } else {
      document.getElementById('authContainer').style.display = 'none';
      document.getElementById('logoutContainer').style.display = 'block';
      document.getElementById('loggedInUser').textContent = data.user.email;
      loadGame();
    }
  }
  
  async function logout() {
    await supabaseClient.auth.signOut();
    
    // Clear local player state for security
    player = null;
  
    // Reset UI
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('logoutContainer').style.display = 'none';
    document.getElementById('playerNameContainer').style.display = 'none';
    document.getElementById('displayName').style.display = 'none';
    
    alert('You have logged out.');
    location.reload();
  }

  async function setCharacterName() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
  
    if (!name) {
      alert('Please enter a valid character name.');
      return;
    }
  
    player.character_name = name;
    await saveGame();
  
    document.getElementById('displayName').textContent = player.character_name;
    document.getElementById('playerNameContainer').style.display = 'none';
    document.getElementById('homeView').style.display = 'block';
  
    logCombat(`Character name set to ${player.character_name}`);
  }
  
  

let playerId = localStorage.getItem('playerId');
if (!playerId) {
  playerId = crypto.randomUUID();
  localStorage.setItem('playerId', playerId);
  console.log('Generated new player ID:', playerId);
} else {
  console.log('Loaded existing player ID:', playerId);
}

let player = {
    character_name: null,
    level: 1, exp: 0, expToLevel: 50, currentExp: 0,
    health: 100, maxHealth: 100,
    stamina: 100, maxStamina: 100,
    damage: 1, defense: 0, statPoints: 0,
    enemiesDefeated: 0
  };
  
  let enemy = { level: 1, health: 10, baseHealth: 10, baseDamage: 1 };
  let combatInterval = null;
  const log = document.getElementById('combatLog');
  
  function logCombat(msg) {
    log.innerHTML += `<div>${msg}</div>`;
    log.scrollTop = log.scrollHeight;
  }
  
  function updateStats() {
    document.getElementById('displayName').textContent = player.character_name || 'Soldier';
    document.getElementById('level').textContent = player.level;
    document.getElementById('enemiesDefeated').textContent = player.enemiesDefeated;
    document.getElementById('health').textContent = player.health.toFixed(0);
    document.getElementById('stamina').textContent = player.stamina.toFixed(0);
    document.getElementById('damage').textContent = player.damage;
    document.getElementById('defense').textContent = player.defense;
    document.getElementById('exp').textContent = player.exp;
    document.getElementById('expToLevel').textContent = player.expToLevel;
    document.getElementById('statPoints').textContent = player.statPoints; // Display available stat points
  
    document.getElementById('healthBar').style.width = (player.health / player.maxHealth * 100) + '%';
    document.getElementById('staminaBar').style.width = (player.stamina / player.maxStamina * 100) + '%';
    document.getElementById('expBar').style.width = (player.exp / player.expToLevel * 100) + '%';
    document.getElementById('enemyHealth').textContent = `${enemy.health.toFixed(0)}/${enemy.baseHealth}`;
    document.getElementById('enemyBar').style.width = (enemy.health / enemy.baseHealth * 100) + '%';
  }
  
  
  function resetEnemy() {
    enemy.health = enemy.baseHealth;
  }
  
  function combatRound() {
    if (player.stamina < 5) {
      logCombat('⚠️ Too tired! Resting...');
      stopCombat();
      return;
    }
    player.stamina -= 5;
  
    // Player Attack
    if (Math.random() <= 0.90) {
      let dmg = player.damage;
      if (Math.random() <= 0.1) dmg *= 2;
      enemy.health -= dmg;
      logCombat(`🗡️ You dealt ${dmg} damage.`);
    } else logCombat(`You missed!`);
  
    if (enemy.health <= 0) {
      player.exp += 10;
      player.enemiesDefeated++;
      logCombat('✅ Enemy defeated!');
      checkLevelUp();
      resetEnemy();
      updateStats();
    } else {
      // Enemy Attack only if alive
      if (Math.random() <= 0.60) {
        let enemyDmg = enemy.baseDamage - player.defense;
        enemyDmg = enemyDmg < 0.25 ? 0.25 : enemyDmg;
        if (Math.random() <= 0.05) enemyDmg *= 2;
        player.health -= enemyDmg;
        logCombat(`💥 Enemy dealt ${enemyDmg.toFixed(2)} damage.`);
      } else logCombat(`Enemy missed!`);
  
      if (player.health <= 0) {
        logCombat('❌ You were defeated! Restoring health.');
        player.health = player.maxHealth;
        stopCombat();
      }
      updateStats();
    }
  
    // Trigger auto-save after each combat round
    saveGame();
  }
  
  function startCombat() {
    clearInterval(combatInterval);
    combatInterval = setInterval(combatRound, 6000);
    logCombat('🚀 Combat started!');
    document.getElementById('startCombatButton').style.display = 'none'; // Hide start button
    document.getElementById('stopCombatButton').style.display = 'block'; // Show stop button
  }
  
  function stopCombat() {
    clearInterval(combatInterval);
    logCombat('⏸️ Combat stopped.');
    document.getElementById('startCombatButton').style.display = 'block'; // Show start button
    document.getElementById('stopCombatButton').style.display = 'none'; // Hide stop button
  }
  
  function checkLevelUp() {
    if (player.exp >= player.expToLevel) {
      player.exp -= player.expToLevel;
      player.level++;
      player.expToLevel *= 2;
      player.statPoints += 2;
      player.maxHealth += 10;
      player.health = player.maxHealth;
      logCombat(`🎖️ Leveled up to ${player.level}! +2 Stat points.`);
      saveGame(); // Save game after leveling up
    }
  }
  
  function addStat(type) {
    if (player.statPoints <= 0) {
      logCombat('⚠️ No stat points available.');
      return;
    }
    if (type === 'damage') player.damage += 0.5;
    if (type === 'defense') player.defense += 0.25;
    player.statPoints--;
    updateStats();
    saveGame(); // Save game after spending stat points
  }
  
  setInterval(() => {
    if (player.stamina < player.maxStamina) {
      player.stamina += 1;
      updateStats();
    }
  }, 5000);
  
  updateStats();

  async function saveGame() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return alert('Please login first.');
  
    const { data, error } = await supabaseClient
      .from('players')
      .upsert({
        id: user.id,
        character_name: player.character_name, // Ensure correct naming
        level: player.level, // Include level
        data: {
          ...player,
          damage: player.damage,
          defense: player.defense,
          currentExp: player.currentExp, // Include currentExp
          statPoints: player.statPoints // Include statPoints
        }
      });
  
    if (error) {
      console.error('Save error:', error);
      logCombat('❌ Error saving game.');
    } else {
      console.log('Game auto-saved:', new Date().toLocaleTimeString());
    }
  }
  
  async function loadGame() {
    const { data: { user } } = await supabaseClient.auth.getUser();
  
    if (!user) {
      console.log('No user logged in.');
      return;
    }
  
    const { data, error } = await supabaseClient
      .from('players')
      .select('*')
      .eq('id', user.id)
      .single();
  
    if (error || !data) {
      console.log('No player data found:', error);
      player = {
        character_name: null,
        level: 1, exp: 0, expToLevel: 50, currentExp: 0,
        health: 100, maxHealth: 100,
        stamina: 100, maxStamina: 100,
        damage: 1, defense: 0, statPoints: 0,
        enemiesDefeated: 0
      };
      document.getElementById('playerNameContainer').style.display = 'block';
      document.getElementById('displayName').style.display = 'none';
    } else {
      player = data.data;
  
      // Important: Make sure you assign character_name and level explicitly
      player.character_name = data.character_name || null;
      player.level = data.level || 1;
      player.currentExp = data.currentExp || 0; // Load currentExp
      player.statPoints = data.statPoints || 0; // Load statPoints
  
      if (player.character_name) {
        document.getElementById('displayName').textContent = `Soldier: ${player.character_name}`;
        document.getElementById('displayName').style.display = 'block';
        document.getElementById('playerNameContainer').style.display = 'none';
      } else {
        document.getElementById('playerNameContainer').style.display = 'block';
        document.getElementById('displayName').style.display = 'none';
      }
  
      updateStats();
      logCombat(`✅ Welcome back, ${player.character_name || 'Soldier'}!`);
    }
  }
  
  function goToTraining() {
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('arenaView').style.display = 'block';
    updateStats();
    logCombat('🏟️ Entered the Training Arena!');
    document.getElementById('startCombatButton').style.display = combatInterval ? 'none' : 'block'; // Show/hide based on combat state
    document.getElementById('stopCombatButton').style.display = combatInterval ? 'block' : 'none'; // Show/hide based on combat state
  }
  
  function goToHome() {
    document.getElementById('arenaView').style.display = 'none';
    document.getElementById('homeView').style.display = 'block';
    stopCombat();
  }





