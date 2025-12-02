# LYRIONA

Orchestra-project by Felix Müller

## Installation

```bash
apt install -y nodejs npm
git clone <repository-url>
cd <project-folder>

rm -rf node_modules package-lock.json .next
npm install
npm run build
pm2 start "npm run start" --name "lyriona"
