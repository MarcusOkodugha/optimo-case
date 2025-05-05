# Build containers and database and start backend
cd backend

docker compose down -v 

docker compose build --no-cache 

docker compose up -d 

# Start frontend
cd frontend 

npm install 

npm run dev 

![image](https://github.com/user-attachments/assets/37f2df43-3362-4dbd-8a9f-c9253b3a61ff)
![image](https://github.com/user-attachments/assets/e6ef40ea-53e1-4e2e-a498-a61219d3dd41)


