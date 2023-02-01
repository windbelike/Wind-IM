# init prisma schema
npx prisma init

# push schema to db (Depretecated)
npx prisma db push

# migrate for dev (Recommended)
npx prisma migrate dev
# migrate for deploy (Recommended)
npx prisma migrate deploy

# generate prisma sdk
npx prisma generate