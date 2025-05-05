# Build containers and database and start backend
cd backend

docker compose down -v
docker compose build --no-cache
docker compose up -d

# Start frontend
cd frontend 
npm install
npm run dev

