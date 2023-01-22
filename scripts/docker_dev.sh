# build
docker build -t wind-im .       
# run
docker run --name test_wind_im -p 8080:3000 -d wind-im:latest
# compose
docker compose up --build
# redis
docker run --name dev_redis -p 6379:6379 -d redis:alpine