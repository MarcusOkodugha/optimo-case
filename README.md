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
![image](https://github.com/user-attachments/assets/1266b85a-5f97-42a3-8a23-a4faa1aa3f5e)



