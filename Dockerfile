FROM node:17
WORKDIR /app
COPY package.json .
RUN npm install
RUN yarn prisma generate
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . ./

CMD ["node", "src/app.ts"]