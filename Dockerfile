FROM hmctspublic.azurecr.io/base/node:18-alpine as base
USER root
RUN corepack enable
USER hmcts
COPY --chown=hmcts:hmcts . .
COPY /definitions/consented /
ADD ./config "/config"
RUN yarn install && yarn cache clean
COPY index.js ./
ENV NODE_CONFIG_DIR="/config"
CMD ["yarn", "start"]
EXPOSE 3000