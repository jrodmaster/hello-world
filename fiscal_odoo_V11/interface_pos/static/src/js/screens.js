odoo.define('interface_pos.screens', function (require) {
    "use strict";
    var gui = require('point_of_sale.gui');
    var chrome = require('point_of_sale.chrome');
    var core = require('web.core');
    var screens = require('point_of_sale.screens');
    var rpc = require('web.rpc');
    var _t = core._t;
    var is_fiscal_pos=true;

    // -Configuracion de  la Interfaz

    var iconfig = NaN;

    // -Instancia del Protocol

    //protocol_send
    var psend = window.interfaz_protocol.send_message; // Interfaz_Protocol es una variable global creada por cualquier modulo neotec
    //que implemente algun protocolo;

    //-Notas:
    /*
    Modulos Interfaz Pos:

    Dependencia
    La comunicacion con la impresora, es por medio de una extension/app, que se comunica con la neoexpress.
    */

    //--------------------------------------------------------------------------------------------------------

    chrome.Chrome.include({

        loading_hide: function () {
            this._super();


            try {
                //Id de los impuesto que se estan utilizando en el Pos


                standard_format.setTaxes_by_Id(this.pos.taxes_by_id)
                // Obtenemos la configuracion de la Interfaz
                var config_interface = this.pos.config.config_interface_id
            } catch (error) {}

            if (config_interface) { // llama a este comando para obtener la configuracion de la interfaz configurada, y asi podemos
                //conectarnos al servidor configurado.

                rpc.query({
                        model: 'config.interface',
                        method: 'get_config',
                        args: [config_interface[0]]
                    }, {})
                    .then(function (pconf) {
                        iconfig = pconf;
                        standard_format.setConfigInterface(pconf);
                        if(pconf.mode_restaurant == false){
                            $('.interface-order-printbill').hide();
                        }

                    });




            } else {
                is_fiscal_pos =false
                // if not config, doesnt show the printer options
                $('.interface-order-printbill').hide();
                $('.interface_menu_fiscal').hide();
               
            }

        }
    });

    // //Modificamos Los pagos para enviar la facturas, cuando se realizen estos.
    screens.PaymentScreenWidget.include({

        create_invoice_document: function (order) {


            var ticket = standard_format.FormatFiscalDocument(order, {});


            psend('invoice', ticket)
        },

        create_credit_note_document: function (order) {
            var self = this;

            rpc.query({
                model: 'pos.order',
                method: 'search_read',
                args: [
                    [
                        ['id', '=', order.return_order_id]
                    ],
                    ['name']
                ],
            }, {
                timeout: 10000,
            }).then((order_info) => {
                rpc.query({
                    model: 'account.invoice',
                    method: 'search_read',
                    args: [
                        [
                            ['origin', '=', order_info[0].name]
                        ],
                        ['number']
                    ],
                }, {
                    timeout: 10000,
                }).then((invoice_info) => {
                    if (invoice_info.length > 0) {

                        order.ref_ncf = invoice_info[0].number

                        var ticket = standard_format.FormatFiscalDocument(order, {});

                        psend('invoice', ticket);

                    } else {
                        // Esto no deberia pasar, esto es en caso de emergencia 
                        self.gui.show_popup('textinput', {

                            'title': _t('No se encontro la factura creada de esta order, por favor introduzcala manualmente'),

                            'value': 'B----------',

                            'confirm': function (value) {

                                order.ref_ncf = value
                                var ticket = standard_format.FormartFiscalDocument(order, {});
                                psend('invoice', ticket);


                            },

                        });
                    }

                })

            })

        },
        get_next_ncf: function (order) {
            self = this
            let ncf_promise = this._super(order);
            ncf_promise.done(function () {
                if(is_fiscal_pos){
 
                if (!order.is_return_order) {
                    self.create_invoice_document(order);
                } else {
                    self.create_credit_note_document(order);
                }

            }
            }).fail(function () {
                console.error("No se encontro NCF");
            });

            return ncf_promise;

        }

    });

    //Boton que muestar el menu fiscal de la  impresora

    var PrinterFiscalOptionButton = screens.ActionButtonWidget.extend({
        template: 'PrinterFiscalOption',
        button_click: function () {
            this.gui.show_popup("selection", {
                title: "Menu Fiscal",
                list: [{
                        label: 'Cierre Z',
                        item: "cierrez"
                    },
                    {
                        label: 'Cierre X',
                        item: "cierrex"
                    },
                    {
                        label: 'Cancelar Documento',
                        item: "cancel_ticket"
                    },
                ],
                confirm: function (item) {
                    psend(item, {});

                }
            });
        }
    });


    screens.define_action_button({
        'name': 'menu_fiscal',
        'widget': PrinterFiscalOptionButton,
        'condition': function () {
            return true;
        },
    });



    var InterfacecBillButton = screens.ActionButtonWidget.extend({
        template: 'InterfaceBillButton',
        button_click: function () {
            let self = this;
            let order = this.pos.get_order()

            if (order.get_orderlines().length ==0) {
                self.gui.show_popup('error', {
                    'title': 'Error: Order Sin Productos',
                    'body': 'No se ha agregado productos a la orden, no se puede realiza una precuenta vacia.',
                    'cancel': function () {
                        self.gui.show_screen('products');
                    }
                });

                return false;
            }


            let preorder = standard_format.FormatNoVentaDocument(order,{});
            psend('nosale', preorder)

            return true;

        }
    });

    screens.define_action_button({
        'name': 'interface_print_bill',
        'widget': InterfacecBillButton,
        'condition': function () {
            return true 
        },
    });


});