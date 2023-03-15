const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const OrdersService = require('../lib/orders_service-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new OrdersService.OrdersServiceStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
