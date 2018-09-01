odoo.define('interface_pos.models', function (require) {
    "use strict";
    var models = require("point_of_sale.models");
    models.load_fields('account.journal', ['payment_form']);
});