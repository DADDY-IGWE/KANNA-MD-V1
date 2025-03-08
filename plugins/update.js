
const config = require('../config');
let fs = require('fs');
const { execSync } = require('child_process');
const { cmd } = require('../command');

cmd({ 
  pattern: "update", 
  react: "🆙", 
  desc: "Update bot", 
  category: "system", 
  use: '.update', 
  filename: __filename 
}, async (conn, mek, m, { from, reply }) => { 
  try { 
    await conn.sendMessage(from, { text: 'Please wait Checking for KANNA MD V1 updates...🚀' }, { quoted: mek });
    
    if (!fs.existsSync('./.git')) { 
      console.log("Initializing git repository..."); 
      execSync('git init'); 
      execSync('git remote add origin https://github.com/LORD-IGWE/KANNA-MD-V1.git'); 
    } else { 
      console.log("Checking existing remotes..."); 
      const remotes = execSync('git remote').toString().split('\n').filter(r => r.trim()); 
      if (!remotes.includes('origin')) { 
        execSync('git remote add origin https://github.com/LORD-IGWE/KANNA-MD-V1.git'); 
      } 
    }
    
    console.log("Fetching updates..."); 
    execSync('git fetch origin'); 
    
    console.log("Checking remote branches..."); 
    let defaultBranch = null; 
    const branches = execSync('git ls-remote --heads origin').toString(); 
    if (branches.includes('refs/heads/main')) { 
      defaultBranch = 'main'; 
    } else if (branches.includes('refs/heads/master')) { 
      defaultBranch = 'master'; 
    } else { 
      throw new Error("Could not determine the default branch."); 
    }
    
    console.log(`Using ${defaultBranch} as the default branch.`); 
    
    const hasCommits = execSync('git rev-list --count HEAD').toString().trim();
    if (hasCommits === '0') {
      console.log("No commits in local repository. Pulling updates...");
      execSync(`git pull origin ${defaultBranch}`);
      await conn.sendMessage(from, { text: '*_✅ Kanna md v1 updated successfully!_*' }, { quoted: mek });
    } else {
      const localCommit = execSync('git rev-parse HEAD').toString().trim(); 
      const originCommit = execSync(`git rev-parse origin/${defaultBranch}`).toString().trim();
      
      if (localCommit === originCommit) { 
        await conn.sendMessage(from, { text: '*_✅ Kanna md v1 is update now_*' }, { quoted: mek });
      } else { 
        console.log("Resetting to origin state..."); 
        execSync(`git reset --hard origin/${defaultBranch}`); 
        console.log("Pulling updates..."); 
        execSync(`git pull origin ${defaultBranch}`); 
        await conn.sendMessage(from, { text: '*_✅ Kanna md v1 updated successfully!_*' }, { quoted: mek });
      }
    }
  } catch (error) { 
    console.error(error); 
    reply(`*Error during update:* ${error.message}`); 
  }
});
    }
  } catch (error) { 
    console.error(error); 
    reply(`*Error during update:* ${error.message}`); 
  }
});
*/