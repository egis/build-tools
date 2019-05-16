# note that this is executed from client project folder, after `npm install`
yarn dependencies && yarn build && yarn test:build && yarn test --browsers=Chrome --reporters=junit,html,verbose
