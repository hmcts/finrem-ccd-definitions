FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-10:10-stretch-slim as base
USER hmcts
COPY --chown=hmcts:hmcts package.json yarn.lock ./
COPY /definitions/consented /
ADD ./config "/config"
RUN yarn install --production && yarn cache clean
COPY index.js ./
ENV NODE_CONFIG_DIR="/config"
CMD ["yarn", "start"]
EXPOSE 3000
